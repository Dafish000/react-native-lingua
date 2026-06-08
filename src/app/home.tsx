import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "../tw";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

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

      <View className="flex-1 justify-center items-center">
        <Text className="h1 text-primary">Lingua</Text>
      </View>
    </SafeAreaView>
  );
}
