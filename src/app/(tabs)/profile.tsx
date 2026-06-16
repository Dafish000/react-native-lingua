import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "../../tw";

export default function Profile() {
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/sign-in");
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center gap-1">
        <Text className="h2">Profile</Text>
        <Text className="body-md text-text-secondary">Coming soon</Text>
      </View>

      <View className="px-6 pb-4 gap-3">
        <Pressable
          onPress={() => router.push("/language-select")}
          className="btn rounded-full py-4 items-center"
          style={{
            backgroundColor: "rgba(108, 78, 245, 0.08)",
            borderWidth: 1.5,
            borderColor: "rgba(108, 78, 245, 0.35)",
          }}
        >
          <Text className="text-base" style={{ fontFamily: "Poppins-SemiBold", color: "#6C4EF5" }}>
            Language Selection
          </Text>
        </Pressable>
        <Pressable
          onPress={handleSignOut}
          className="btn btn--primary rounded-full py-5 items-center"
        >
          <Text className="text-white text-base" style={{ fontFamily: "Poppins-SemiBold" }}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
