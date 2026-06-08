import { useAuth, useSignUp, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VerificationModal } from "../components/VerificationModal";
import { images } from "../constants/images";
import { Pressable, ScrollView, Text, View } from "../tw";
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
      className="flex-row items-center gap-4 px-5 rounded-2xl mb-3"
      style={styles.socialBtn}
    >
      <Ionicons name={iconName} size={22} color={iconColor} />
      <Text className="body-lg" style={{ fontFamily: "Poppins-Medium" }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function SignUp() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!authLoaded) return null;
  if (isSignedIn) return <Redirect href="/home" />;

  async function handleSignUp() {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const { error: createError } = await signUp.create({ emailAddress: email.trim() });
      if (createError) {
        setError(createError.longMessage || createError.message || "Sign up failed");
        return;
      }
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.longMessage || sendError.message || "Failed to send code");
        return;
      }
      setModalVisible(true);
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage ?? err?.message ?? "Sign up failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(code: string) {
    try {
      const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
      if (verifyError) {
        Alert.alert("Invalid code", verifyError.longMessage || verifyError.message || "Verification failed");
        return;
      }
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        Alert.alert("Error", finalizeError.longMessage || finalizeError.message || "Could not complete sign up");
        return;
      }
      setModalVisible(false);
      router.replace("/home" as any);
    } catch (err: any) {
      Alert.alert("Error", err?.errors?.[0]?.longMessage ?? err?.message ?? "Verification failed");
    }
  }

  async function handleResend() {
    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        Alert.alert("Error", error.longMessage || error.message || "Failed to resend");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.errors?.[0]?.longMessage ?? err?.message ?? "Failed to resend");
    }
  }

  async function handleSocialSignUp(strategy: "oauth_google" | "oauth_apple" | "oauth_facebook") {
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
        router.replace("/home" as any);
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Social sign-in failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerClassName="px-6 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <Pressable onPress={() => router.back()} className="pt-4 pb-2 self-start">
          <Text className="text-2xl text-text-primary">‹</Text>
        </Pressable>

        {/* Headline */}
        <Text className="h2 mt-2">Create your account</Text>
        <Text className="body-md text-text-secondary mt-1">
          Start your language journey today ✨
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
            style={styles.input}
          />
        </View>

        {/* Inline error — visible on web and native */}
        {error ? (
          <Text className="body-sm text-error text-center mb-2">{error}</Text>
        ) : null}

        {/* Sign Up button */}
        <Pressable
          onPress={handleSignUp}
          disabled={loading}
          className="btn btn--primary rounded-2xl mt-2"
          style={[styles.mainBtn, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base" style={{ fontFamily: "Poppins-SemiBold" }}>
              Sign Up
            </Text>
          )}
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
          onPress={() => handleSocialSignUp("oauth_google")}
        />
        <SocialButton
          iconName="logo-facebook"
          iconColor="#1877F2"
          label="Continue with Facebook"
          onPress={() => handleSocialSignUp("oauth_facebook")}
        />
        <SocialButton
          iconName="logo-apple"
          iconColor="#000000"
          label="Continue with Apple"
          onPress={() => handleSocialSignUp("oauth_apple")}
        />

        {/* Sign In link */}
        <Pressable
          onPress={() => router.push("/sign-in" as any)}
          className="items-center mt-6"
        >
          <Text className="body-md text-text-secondary">
            Already have an account?{" "}
            <Text className="body-md text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
              Log in
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

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F6F7FB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#001328",
  },
  mainBtn: {
    paddingVertical: 20,
  },
  socialBtn: {
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
});
