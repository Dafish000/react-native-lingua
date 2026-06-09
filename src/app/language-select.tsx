import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ScrollView, Text, View } from "../tw";
import { Image } from "../tw/image";
import { LANGUAGES } from "../data/languages";

export default function LanguageSelect() {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const selectedLanguage = LANGUAGES.find((l) => l.code === selectedCode);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      {/* Back button */}
      <View className="px-6 pt-2">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface"
        >
          <Text className="text-text-primary text-xl">←</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="pb-36 px-6">
        {/* Earth image */}
        <View className="items-center pt-6 pb-4">
          <Image
            source={require("../../assets/images/earth.png")}
            className="w-40 h-40"
            style={{ objectFit: "contain" } as any}
          />
        </View>

        {/* Title */}
        <View className="pb-8">
          <Text className="h2 text-center">
            What do you want{"\n"}to learn?
          </Text>
          <Text className="body-md text-text-secondary text-center mt-2">
            Choose a language to get started
          </Text>
        </View>

        {/* Language list — vertical */}
        <View className="gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedCode === lang.code;
            return (
              <Pressable
                key={lang.code}
                onPress={() => setSelectedCode(lang.code)}
                style={{
                  borderColor: isSelected ? lang.color : "#E5E7EB",
                  borderWidth: isSelected ? 2 : 1.5,
                  backgroundColor: isSelected ? `${lang.color}18` : "#FFFFFF",
                }}
                className="rounded-2xl px-4 py-3 flex-row items-center"
              >
                <Image
                  source={{ uri: lang.flag }}
                  className="w-14 h-9 rounded-md"
                  style={{ objectFit: "cover" } as any}
                />
                <View className="ml-4 flex-1">
                  <Text
                    className="body-md text-text-primary"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    {lang.name}
                  </Text>
                  <Text className="caption text-text-secondary mt-0.5">
                    {lang.nativeName}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: lang.color }}
                  >
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Confirmation button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-background"
        style={{ paddingBottom: 36 }}
      >
        <Pressable
          onPress={() => {
            if (selectedCode) router.push("/home" as any);
          }}
          disabled={!selectedCode}
          className="btn btn--lg btn--primary rounded-2xl"
          style={{ opacity: selectedCode ? 1 : 0.4 }}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            {selectedLanguage
              ? `Start Learning ${selectedLanguage.name}`
              : "Select a Language"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
