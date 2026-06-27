import { useClerk } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardField, StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { Pressable, Text } from "../tw";
import {
  getActiveUserTier,
  getPaidSubscriptionItem,
  getPlanTier,
  type PlanTier,
} from "../lib/subscription";

// These are experimental Clerk billing hooks — imported from @clerk/react directly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { usePlans, useSubscription } = require("@clerk/react/experimental");

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(295, SCREEN_WIDTH - 72);

const TIER_ACCENT: Record<PlanTier, string> = {
  free: "#6C4EF5",
  silver: "#ADADAD",
  gold: "#F5A623",
};

const TIER_ICON: Record<PlanTier, React.ComponentProps<typeof Ionicons>["name"]> = {
  free: "leaf-outline",
  silver: "star-outline",
  gold: "trophy-outline",
};

const TIER_PERKS: Record<PlanTier, string[]> = {
  free: ["Spanish lessons", "Basic AI tutor chat", "Daily XP tracking"],
  silver: ["Everything in Free", "French & Portuguese lessons", "Priority AI tutor"],
  gold: ["Everything in Silver", "Japanese lessons", "All future languages", "AI video teacher sessions"],
};

// ─── Checkout Modal ───────────────────────────────────────────────────────────
// Split into two layers so StripeProvider can be mounted with the correct
// stripeAccountId (the Stripe Connect account ID from initializePaymentMethod).
// Clerk uses loadStripe(platformKey, { stripeAccount: externalGatewayId }) on web;
// we mirror that here with StripeProvider publishableKey + stripeAccountId.

function CheckoutModal({
  plan,
  onClose,
  onSuccess,
}: {
  plan: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const clerk = useClerk();
  const [paymentSetup, setPaymentSetup] = useState<any>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Platform Stripe publishable key — matches the key used in loadStripe on web
  const stripeKey =
    (clerk as any).__internal_environment?.commerceSettings?.billing?.stripePublishableKey ?? "";

  // Fetch the Setup Intent + connected account ID as soon as the modal opens.
  // externalGatewayId = Stripe Connect account ID (acct_xxx) — required as stripeAccountId.
  // externalClientSecret = Stripe SetupIntent client secret — used for confirmSetupIntent.
  useEffect(() => {
    (clerk as any).user
      .initializePaymentMethod({ gateway: "stripe" })
      .then((setup: any) => setPaymentSetup(setup))
      .catch((err: any) =>
        setSetupError(err?.message ?? "Could not initialize payment. Please try again.")
      );
  }, []);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {setupError ? (
            <>
              <Text style={styles.modalTitle}>Payment Unavailable</Text>
              <Text style={[styles.modalSubtitle, { marginTop: 8 }]}>{setupError}</Text>
              <Pressable onPress={onClose} style={[styles.payBtn, { backgroundColor: "#6C4EF5", marginTop: 20 }]}>
                <Text style={styles.payBtnText}>Close</Text>
              </Pressable>
            </>
          ) : !paymentSetup || !stripeKey ? (
            <View style={{ alignItems: "center", paddingVertical: 32, gap: 12 }}>
              <ActivityIndicator color="#6C4EF5" size="large" />
              <Text style={styles.loadingText}>Initializing payment...</Text>
            </View>
          ) : (
            // Mount StripeProvider with the correct platform key + connected account ID.
            // Only pass stripeAccountId when it's a real Stripe Connect account (acct_xxx).
            // Passing an invalid value (null, "stripe", etc.) can cause "No such setupintent".
            <StripeProvider
              publishableKey={stripeKey}
              stripeAccountId={
                typeof paymentSetup.externalGatewayId === "string" &&
                paymentSetup.externalGatewayId.startsWith("acct_")
                  ? paymentSetup.externalGatewayId
                  : undefined
              }
              merchantIdentifier="merchant.com.anonymous.FleaMarket"
            >
              <CheckoutForm
                plan={plan}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            </StripeProvider>
          )}
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Inner form — must be a child of StripeProvider to use useStripe()
function CheckoutForm({
  plan,
  onClose,
  onSuccess,
}: {
  plan: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const clerk = useClerk();
  const { confirmSetupIntent } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const tier = getPlanTier(plan.name as string);
  const accent = TIER_ACCENT[tier];
  // Determine billing period from the plan's fee structure:
  //   plan.fee = monthly fee, plan.annualFee = annual fee.
  //   startCheckout will fail with "month" if the plan only has annual billing.
  const planPeriod: string = plan.fee != null ? "month" : plan.annualFee != null ? "annual" : "month";
  const activeFee = plan.fee ?? plan.annualFee;
  const priceAmount = activeFee ? activeFee.amount / 100 : 0;
  const periodLabel = planPeriod === "annual" ? "/year" : "/month";
  const priceLabel = `$${priceAmount.toFixed(2)}`;

  async function handlePay() {
    if (!cardComplete || loading) return;
    setLoading(true);
    try {
      // 1. Create the Clerk checkout — use the plan's actual billing period, not a hardcoded "month".
      const checkout = await (clerk as any).billing.startCheckout({
        planId: plan.id,
        planPeriod,
      });

      // 2. Fetch a FRESH setup intent right before confirming.
      //    Never reuse paymentSetup.externalClientSecret from modal mount — Clerk's
      //    backend reuses the same pending SetupIntent from previous failed attempts,
      //    which causes "No such setupintent" on retry. A fresh POST always creates
      //    or returns the latest valid intent for this user.
      const freshSetup = await (clerk as any).user.initializePaymentMethod({ gateway: "stripe" });
      if (!freshSetup?.externalClientSecret) {
        throw new Error("Could not get payment setup. Please try again.");
      }

      // 3. Confirm the Stripe Setup Intent using the mounted CardField.
      //    StripeProvider is already initialized with the correct stripeAccountId.
      const { setupIntent, error: stripeError } = await confirmSetupIntent(
        freshSetup.externalClientSecret,
        { paymentMethodType: "Card" }
      );
      if (stripeError) throw new Error(stripeError.message);
      const pmId = setupIntent?.paymentMethod?.id;
      if (!pmId) throw new Error("Payment setup did not return a payment method.");

      // 4. Tell Clerk the checkout is confirmed.
      //    paymentToken = Stripe PaymentMethod ID (pm_xxx) from the setup intent.
      await checkout.confirm({
        gateway: "stripe",
        paymentToken: pmId,
      });

      // 5. Reload the Clerk session so the new subscription tier is reflected immediately.
      await clerk.setActive({ session: (clerk as any).session?.id ?? null });

      onSuccess();
    } catch (err: any) {
      Alert.alert("Payment Failed", err?.message ?? "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <View style={styles.modalHeader}>
        <View>
          <Text style={styles.modalTitle}>Subscribe to {plan.name}</Text>
          <Text style={styles.modalSubtitle}>
            {priceLabel}{periodLabel} · Cancel anytime
          </Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </View>

      <View style={styles.modalDivider} />

      {/* Card input */}
      <Text style={styles.cardLabel}>Card details</Text>
      <CardField
        postalCodeEnabled={false}
        style={styles.cardField}
        cardStyle={{
          backgroundColor: "rgba(255,255,255,0.08)",
          textColor: "#FFFFFF",
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: "rgba(255,255,255,0.2)",
          placeholderColor: "rgba(255,255,255,0.35)",
          fontSize: 16,
        }}
        onCardChange={(details) => setCardComplete(details.complete)}
      />

      {/* Pay button */}
      <Pressable
        onPress={handlePay}
        disabled={loading || !cardComplete}
        style={[
          styles.payBtn,
          { backgroundColor: accent, opacity: loading || !cardComplete ? 0.45 : 1 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.payBtnText}>Pay {priceLabel}/month</Text>
        )}
      </Pressable>

      {/* Test card hint (dev only) */}
      {__DEV__ && (
        <Text style={styles.testCardHint}>
          Use Stripe test card: 4242 4242 4242 4242 · Any future date · Any CVC
        </Text>
      )}
    </>
  );
}

// ─── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  userTier,
  onSubscribe,
}: {
  plan: any;
  userTier: PlanTier;
  onSubscribe: (plan: any) => void;
}) {
  const tier = getPlanTier(plan.name as string);
  const accent = TIER_ACCENT[tier];
  const icon = TIER_ICON[tier];
  const perks = TIER_PERKS[tier];
  const isCurrent = tier === userTier;
  const price = plan.fee
    ? `$${(plan.fee.amount / 100).toFixed(2)}/mo`
    : plan.annualFee
    ? `$${(plan.annualFee.amount / 100).toFixed(2)}/yr`
    : "Free";
  const description = (plan.description as string | null) ?? "";
  const useGlass = isGlassEffectAPIAvailable() && isLiquidGlassAvailable();

  return (
    <View style={[styles.card, isCurrent && { borderColor: accent, borderWidth: 2 }]}>
      {/* Background */}
      {useGlass ? (
        <GlassView glassEffectStyle="regular" colorScheme="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.cardFallbackBg]} />
      )}

      {/* Current plan badge */}
      {isCurrent && (
        <View style={[styles.currentBadge, { backgroundColor: accent }]}>
          <Ionicons name="checkmark" size={11} color="#FFFFFF" />
          <Text style={styles.currentBadgeText}>Current</Text>
        </View>
      )}

      <View style={styles.cardBody}>
        {/* Icon row */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconBubble, { backgroundColor: `${accent}22` }]}>
            <Ionicons name={icon} size={22} color={accent} />
          </View>
          <Text style={[styles.tierName, { color: accent }]}>{plan.name}</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{price}</Text>

        {/* Description */}
        {description ? <Text style={styles.description}>{description}</Text> : null}

        {/* Divider */}
        <View style={styles.featureDivider} />

        {/* Features */}
        <View style={styles.featureList}>
          {perks.map((perk, i) => (
            <View key={i} style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={15} color={accent} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Subscribe / Active button */}
      <View style={styles.cardFooter}>
        {isCurrent ? (
          <View style={[styles.activePlanBtn, { borderColor: accent }]}>
            <Text style={[styles.activePlanBtnText, { color: accent }]}>Active Plan</Text>
          </View>
        ) : tier !== "free" ? (
          <Pressable
            onPress={() => onSubscribe(plan)}
            style={[styles.subscribeBtn, { backgroundColor: accent }]}
          >
            <Text style={styles.subscribeBtnText}>Subscribe</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ─── Main Content ──────────────────────────────────────────────────────────────

function SubscriptionContent() {
  const router = useRouter();
  const clerk = useClerk();
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);
  const [canceling, setCanceling] = useState(false);

  const { data: plans, isLoading: plansLoading } = usePlans({ for: "user" });
  const { data: subscription, revalidate } = useSubscription({ for: "user" });

  const userTier = getActiveUserTier(subscription);
  const paidItem = getPaidSubscriptionItem(subscription);
  const useGlass = isGlassEffectAPIAvailable() && isLiquidGlassAvailable();

  const sortedPlans = [...((plans as any[]) ?? [])].sort((a: any, b: any) => {
    const rank: Record<PlanTier, number> = { free: 0, silver: 1, gold: 2 };
    return (rank[getPlanTier(a.name)] ?? 0) - (rank[getPlanTier(b.name)] ?? 0);
  });

  async function handleCancelSubscription() {
    if (!paidItem) return;
    Alert.alert(
      "Cancel Subscription",
      `Are you sure you want to cancel your ${paidItem.plan?.name ?? "current"} plan? You'll keep access until the end of your billing period.`,
      [
        { text: "Keep Plan", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: async () => {
            setCanceling(true);
            try {
              try {
                await paidItem.cancel({});
              } catch (cancelErr: any) {
                // "already canceled" = subscription is already in the desired state.
                // Treat it as success so we still reload the session and clear the UI.
                const msg: string = cancelErr?.message ?? "";
                if (!msg.toLowerCase().includes("already cancel")) throw cancelErr;
              }
              // Reload session so the plan reverts to free immediately.
              await clerk.setActive({ session: (clerk as any).session?.id ?? null });
              await revalidate();
            } catch (err: any) {
              Alert.alert("Error", err?.message ?? "Failed to cancel. Please try again.");
            } finally {
              setCanceling(false);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.root}>
      {/* Decorative glow blobs */}
      <View style={styles.glowBlob1} />
      <View style={styles.glowBlob2} />

      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.9)" />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Your Subscription</Text>
          <Text style={styles.headerSubtitle}>Unlock all languages</Text>
        </View>
      </View>

      {/* Current plan pill */}
      <View style={styles.pillContainer}>
        <View style={styles.pill}>
          <View style={[styles.pillDot, { backgroundColor: TIER_ACCENT[userTier] }]} />
          <Text style={styles.pillText}>
            {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
          </Text>
        </View>
      </View>

      {/* Plan cards */}
      {plansLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#6C4EF5" size="large" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      ) : sortedPlans.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="card-outline" size={40} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>No plans available{"\n"}Contact support to set up billing.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScrollContent}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
          style={styles.cardsScroll}
        >
          {sortedPlans.map((plan: any) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              userTier={userTier}
              onSubscribe={(plan) => setCheckoutPlan(plan)}
            />
          ))}
        </ScrollView>
      )}

      <View style={{ flex: 1 }} />

      {/* Cancel subscription */}
      {paidItem && (
        <View style={styles.cancelContainer}>
          <Pressable
            onPress={handleCancelSubscription}
            disabled={canceling}
            style={[styles.cancelBtn, { opacity: canceling ? 0.55 : 1 }]}
          >
            {useGlass ? (
              <GlassView
                glassEffectStyle="regular"
                colorScheme="dark"
                style={StyleSheet.absoluteFill}
              />
            ) : null}
            <View style={styles.cancelRedLayer} />
            {canceling ? (
              <ActivityIndicator color="#FF4D4F" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={18} color="#FF4D4F" />
                <Text style={styles.cancelText}>Cancel Subscription</Text>
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* CheckoutModal owns its own StripeProvider, mounted after initializePaymentMethod
          returns the correct stripeAccountId (Stripe Connect account). */}
      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={async () => {
            setCheckoutPlan(null);
            await revalidate();
          }}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Root export ───────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  return <SubscriptionContent />;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D0220" },

  // Background glow blobs for visual depth
  glowBlob1: {
    position: "absolute", top: -80, right: -60,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: "rgba(108,78,245,0.28)",
  },
  glowBlob2: {
    position: "absolute", bottom: 80, left: -90,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(77,136,255,0.14)",
  },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 12 },
  backBtn: { padding: 8 },
  headerTitle: { color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 22 },
  headerSubtitle: { color: "rgba(255,255,255,0.45)", fontFamily: "Poppins-Regular", fontSize: 13 },

  // Current plan pill
  pillContainer: { paddingHorizontal: 24, marginBottom: 20 },
  pill: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    gap: 8, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
  },
  pillDot: { width: 8, height: 8, borderRadius: 4 },
  pillText: { color: "rgba(255,255,255,0.9)", fontFamily: "Poppins-Medium", fontSize: 13 },

  // Cards scroll
  cardsScroll: { flexGrow: 0 },
  cardsScrollContent: { paddingHorizontal: 24, gap: 16, paddingBottom: 4 },

  // Plan card
  card: {
    width: CARD_WIDTH, minHeight: 400,
    borderRadius: 24, overflow: "hidden",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.13)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  cardFallbackBg: { backgroundColor: "rgba(255,255,255,0.07)" },
  cardBody: { padding: 20, flex: 1 },
  cardFooter: { paddingHorizontal: 20, paddingBottom: 20 },

  // Card internals
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  iconBubble: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  tierName: { fontFamily: "Poppins-SemiBold", fontSize: 18 },
  price: { color: "#FFFFFF", fontFamily: "Poppins-Bold", fontSize: 30, marginBottom: 4 },
  description: { color: "rgba(255,255,255,0.55)", fontFamily: "Poppins-Regular", fontSize: 13, marginBottom: 6 },
  featureDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 14 },
  featureList: { gap: 9 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  perkText: { color: "rgba(255,255,255,0.82)", fontFamily: "Poppins-Regular", fontSize: 13, flex: 1 },

  // Current plan badge (top-right corner)
  currentBadge: {
    position: "absolute", top: 14, right: 14, zIndex: 10,
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  currentBadgeText: { color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 11 },

  // Card buttons
  subscribeBtn: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  subscribeBtnText: { color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 14 },
  activePlanBtn: { borderRadius: 16, paddingVertical: 13, alignItems: "center", borderWidth: 1.5 },
  activePlanBtnText: { fontFamily: "Poppins-SemiBold", fontSize: 14 },

  // Cancel button — red liquid glass
  cancelContainer: { paddingHorizontal: 24, paddingBottom: 8 },
  cancelBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 16, borderRadius: 20, overflow: "hidden",
    borderWidth: 1.5, borderColor: "rgba(255,77,79,0.38)",
    backgroundColor: "rgba(255,77,79,0.07)",
    position: "relative",
  },
  cancelRedLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,77,79,0.07)",
  },
  cancelText: { color: "#FF4D4F", fontFamily: "Poppins-SemiBold", fontSize: 15 },

  // States
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: { color: "rgba(255,255,255,0.45)", fontFamily: "Poppins-Regular", fontSize: 14 },
  emptyText: { color: "rgba(255,255,255,0.4)", fontFamily: "Poppins-Regular", fontSize: 14, textAlign: "center", lineHeight: 22 },

  // Checkout modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#130228",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  modalHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 },
  modalTitle: { color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 20 },
  modalSubtitle: { color: "rgba(255,255,255,0.5)", fontFamily: "Poppins-Regular", fontSize: 13, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.09)" },
  modalDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 16 },
  cardLabel: { color: "rgba(255,255,255,0.6)", fontFamily: "Poppins-Medium", fontSize: 13, marginBottom: 8 },
  cardField: { height: 52, marginBottom: 20 },
  payBtn: { borderRadius: 18, paddingVertical: 16, alignItems: "center" },
  payBtnText: { color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 16 },
  testCardHint: { color: "rgba(255,255,255,0.3)", fontFamily: "Poppins-Regular", fontSize: 11, textAlign: "center", marginTop: 12 },
});
