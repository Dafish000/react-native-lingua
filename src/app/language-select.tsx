import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LANGUAGES } from "../data/languages";
import { useLanguageStore } from "../store/languageStore";
import { Pressable, ScrollView, Text, TextInput, View } from "../tw";
import { Image } from "../tw/image";

export default function LanguageSelect() {
  const router = useRouter();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedLanguage = LANGUAGES.find((l) => l.code === selectedCode);
  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <ScrollView className="flex-1" contentContainerClassName="pb-4 px-6">
        {/* Title */}
        <View className="pt-6 pb-6">
          <Text className="h2 text-center">
            What do you want{"\n"}to learn?
          </Text>
          <Text className="body-md text-text-secondary text-center mt-2">
            Choose a language to get started
          </Text>
        </View>

        {/* Search bar */}
        <View className="flex-row items-center bg-surface rounded-2xl px-4 mb-6 border border-border">
          <Text className="text-text-secondary text-base mr-2">🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Language"
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-3.5 body-md text-text-primary"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} className="p-1">
              <Text className="text-text-secondary text-base">✕</Text>
            </Pressable>
          )}
        </View>

        {/* Language list — vertical */}
        <View className="gap-3">
          {filteredLanguages.length === 0 ? (
            <View className="items-center py-10">
              <Text className="body-md text-text-secondary">No languages found</Text>
            </View>
          ) : null}
          {filteredLanguages.map((lang) => {
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

      {/* Earth image — anchored between language list and button */}
      <View className="bg-surface">
        <Image
          source={require("../../assets/images/earth.png")}
          className="w-full h-48"
          style={{ objectFit: "contain", backgroundColor: "transparent" } as any}
        />
      </View>

      {/* Confirmation button */}
      <View className="px-6 pt-2 pb-9 bg-transparent">
        <Pressable
          onPress={() => {
            if (selectedCode) {
              setLanguage(selectedCode);
              router.push("/home" as any);
            }
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
