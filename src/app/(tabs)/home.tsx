import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLanguage } from "../../data/languages";
import { useLanguageStore } from "../../store/languageStore";
import { Pressable, Text, View } from "../../tw";
import { Image } from "../../tw/image";

export default function Home() {
  const router = useRouter();
  const clearLanguage = useLanguageStore((s) => s.clearLanguage);
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const language = selectedLanguage ? getLanguage(selectedLanguage) : null;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
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

        {language && (
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: language.flag }}
              className="w-14 h-9 rounded-md"
              style={{ objectFit: "cover" } as any}
            />
            <View>
              <Text className="h3" style={{ fontFamily: "Poppins-SemiBold", color: language.color }}>
                {language.name}
              </Text>
              <Text className="caption text-text-secondary" style={{ fontFamily: "Poppins-Regular" }}>
                {language.nativeName}
              </Text>
            </View>
          </View>
        )}
        <Pressable
          onPress={() => router.push("/language-select" as any)}
          className="btn btn--lg btn--primary rounded-4xl px-4 py-2"
        >
          <Text className="text-white text-md" style={{ fontFamily: "Poppins-SemiBold" }}>
            Let&apos;s begin our journey!
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
