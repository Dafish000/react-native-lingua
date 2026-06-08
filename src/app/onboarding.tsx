import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "../tw";
import { Image } from "../tw/image";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      {/* Header: mascot logo + app name */}
      <View className="flex-row items-center justify-center px-6 pt-2 gap-2">
        <Image
          source={require("../../assets/images/mascot-logo.png")}
          className="w-9 h-9"
        />
        <Text className="text-xl text-text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
          lingua
        </Text>
      </View>

      {/* Headline + subtitle */}
      <View className="px-6 pt-6">
        <Text className="h1">Your AI language</Text>
        <Text className="h1 text-primary">teacher.</Text>
        <Text className="body-md text-text-secondary mt-3">
          Real conversations, personalized{"\n"}lessons, anytime, anywhere.
        </Text>
      </View>

      {/* Mascot + speech bubbles */}
      <View className="flex-1 items-center justify-center relative">
        {/* Hello bubble — left */}
        <View
          className="absolute bg-white rounded-2xl px-4 py-2 z-10"
          style={{
            left: 28,
            top: "35%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="body-md" style={{ fontFamily: "Poppins-Medium" }}>
            Hello!
          </Text>
        </View>

        {/* ¡Hola! bubble — top right */}
        <View
          className="absolute bg-white rounded-2xl px-4 py-2 z-10"
          style={{
            right: 28,
            top: "8%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="body-md" style={{ fontFamily: "Poppins-Medium" }}>
            ¡Hola!
          </Text>
        </View>

        {/* 你好！bubble — bottom right */}
        <View
          className="absolute bg-white rounded-2xl px-4 py-2 z-10"
          style={{
            right: 20,
            bottom: "18%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="body-md text-error" style={{ fontFamily: "Poppins-Medium" }}>
            你好！
          </Text>
        </View>

        <Image
          source={require("../../assets/images/mascot-welcome.png")}
          className="w-72 h-72"
          style={{ objectFit: "contain" } as any}
        />
      </View>

      {/* Get Started button */}
      <View className="px-6 pb-8">
        <Pressable
          onPress={() => router.push("/sign-up" as any)}
          className="btn btn--primary flex-row items-center justify-center rounded-2xl"
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Get Started
          </Text>
          <Text className="text-white text-xl ml-1">›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
