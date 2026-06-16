import { useAuth, useSignIn, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VerificationModal } from "../components/VerificationModal";
import { images } from "../constants/images";
import { Pressable, ScrollView, Text, TextInput, View } from "../tw";
import { Image } from "../tw/image";

WebBrowser.maybeCompleteAuthSession();

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function SocialButton({
  iconName,
  iconColor,
  label,
  onPress,
}: {
  iconName: IoniconName;
  iconColor: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 px-5 rounded-2xl mb-3 py-4 border border-border bg-white"
    >
      <Ionicons name={iconName} size={22} color={iconColor} />
      <Text className="body-lg" style={{ fontFamily: "Poppins-Medium" }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SignIn() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const posthog = usePostHog();

  if (!authLoaded) return null;
  if (isSignedIn) return <Redirect href="/home" />;

  async function handleSignIn() {
    setError("");
    if (!email.trim()) return;
    try {
      const { error: createError } = await signIn.create({ identifier: email.trim() });
      if (createError) {
        setError(createError.longMessage || createError.message || "Sign in failed");
        return;
      }
      const { error: sendError } = await signIn.emailCode.sendCode({ emailAddress: email.trim() });
      if (sendError) {
        setError(sendError.longMessage || sendError.message || "Failed to send code");
        return;
      }
      setModalVisible(true);
    } catch (err: any) {
      posthog.captureException(err, { step: "sign_in_request" });
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? "Sign in failed");
    }
  }

  async function handleVerify(code: string) {
    try {
      const { error: verifyError } = await signIn.emailCode.verifyCode({ code });
      if (verifyError) {
        Alert.alert("Invalid code", verifyError.longMessage || verifyError.message || "Verification failed");
        return;
      }
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        Alert.alert("Error", finalizeError.longMessage || finalizeError.message || "Could not complete sign in");
        return;
      }
      posthog.identify(email.trim(), {
        $set: { email: email.trim() },
      });
      posthog.capture("sign_in_completed", { method: "email" });
      setModalVisible(false);
      router.replace("/home");
    } catch (err: any) {
      posthog.captureException(err, { step: "sign_in_verify" });
      Alert.alert("Error", err?.errors?.[0]?.longMessage ?? err?.message ?? "Verification failed");
    }
  }

  async function handleResend() {
    try {
      const { error } = await signIn.emailCode.sendCode({ emailAddress: email.trim() });
      if (error) {
        Alert.alert("Error", error.longMessage || error.message || "Failed to resend");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.errors?.[0]?.longMessage ?? err?.message ?? "Failed to resend");
    }
  }

  async function handleSocialSignIn(strategy: "oauth_google" | "oauth_apple" | "oauth_facebook") {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: "fleamarket://oauth-callback",
      });
      if (createdSessionId) {
        if (typeof setActive === "function") {
          await setActive({ session: createdSessionId });
        } else {
          console.warn("Clerk SSO flow returned no setActive function; proceeding to redirect.");
        }
        posthog.capture("sign_in_social_completed", { provider: strategy });
        router.replace("/home");
      }
    } catch (err: any) {
      posthog.captureException(err, { step: "sign_in_social", strategy });
      Alert.alert("Error", err?.message ?? "Social sign-in failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <Pressable onPress={() => router.replace("/onboarding")} className="pt-4 pb-2 self-start">
          <Text className="text-2xl text-text-primary">‹</Text>
        </Pressable>

        {/* Headline */}
        <Text className="h2 mt-2">Welcome back</Text>
        <Text className="body-md text-text-secondary mt-1">
          Continue your language journey 🌟
        </Text>

        {/* Mascot */}
        <View className="items-center my-6">
          <Image
            source={images.mascotAuth}
            className="w-40 h-40"
            style={{ objectFit: "contain" } as any}
          />
        </View>

        {/* Email input */}
        <View className="mb-4">
          <Text className="body-sm text-text-secondary mb-1" style={{ fontFamily: "Poppins-Medium" }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-surface rounded-xl border border-border px-4 py-3.5 font-poppins text-[15px] text-text-primary"
          />
        </View>

        {/* Inline error — visible on web and native */}
        {error ? (
          <Text className="body-sm text-error text-center mb-2">{error}</Text>
        ) : null}

        {/* Sign In button */}
        <Pressable
          onPress={handleSignIn}
          className="btn btn--primary rounded-2xl mt-2 py-5"
        >
          <Text className="text-white text-base" style={{ fontFamily: "Poppins-SemiBold" }}>
            Sign In
          </Text>
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center gap-3 my-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="body-sm text-text-secondary">or continue with</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Social buttons */}
        <SocialButton
          iconName="logo-google"
          iconColor="#4285F4"
          label="Continue with Google"
          onPress={() => handleSocialSignIn("oauth_google")}
        />
        <SocialButton
          iconName="logo-facebook"
          iconColor="#1877F2"
          label="Continue with Facebook"
          onPress={() => handleSocialSignIn("oauth_facebook")}
        />
        <SocialButton
          iconName="logo-apple"
          iconColor="#000000"
          label="Continue with Apple"
          onPress={() => handleSocialSignIn("oauth_apple")}
        />

        {/* Sign Up link */}
        <Pressable
          onPress={() => router.push("/sign-up")}
          className="items-center mt-6"
        >
          <Text className="body-md text-text-secondary">
            {"Don't have an account?"}{" "}
            <Text className="body-md text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
              Sign up
            </Text>
          </Text>
        </Pressable>
      </ScrollView>

      <VerificationModal
        visible={modalVisible}
        email={email}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </SafeAreaView>
  );
}
