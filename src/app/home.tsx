import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "../store/languageStore";
import { Pressable, Text, View } from "../tw";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const clearLanguage = useLanguageStore((s) => s.clearLanguage);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/onboarding" />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Temporary — remove once onboarding flow is complete */}
      <View className="px-4 pt-2">
        <Pressable
          onPress={() => router.push("/onboarding")}
          className="self-start px-4 py-2 bg-surface rounded-xl border border-border"
        >
          <Text className="body-dm text-text-secondary">←</Text>
        </Pressable>
      </View>

      <View className="flex-1 justify-center items-center gap-4">
        <Text className="h1 text-primary">Lingua</Text>
        <Pressable
          onPress={() => router.push("/language-select" as any)}
          className="btn btn--lg btn--primary rounded-4xl px-4 py-2"
        >
          <Text className="text-white text-md" style={{ fontFamily: "Poppins-SemiBold" }}>
            Let's begin our journey!
          </Text>
        </Pressable>
        <Pressable
          onPress={clearLanguage}
          className="btn btn--lg rounded-2xl bg-surface border border-border"
        >
          <Text className="body-md text-text-secondary" style={{ fontFamily: "Poppins-Medium" }}>
            Clear Language (Test)
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
