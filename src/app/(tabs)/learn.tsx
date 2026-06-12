import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "../../tw";

export default function Learn() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="flex-1 items-center justify-center gap-1">
        <Text className="h2">Learn</Text>
        <Text className="body-md text-text-secondary">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
