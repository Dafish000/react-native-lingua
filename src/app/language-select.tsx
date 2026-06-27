import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";
import { LANGUAGES } from "../data/languages";
import {
  canAccessLanguageTier,
  getActiveUserTier,
} from "../lib/subscription";
import { useLanguageStore } from "../store/languageStore";
import { Pressable, ScrollView, Text, TextInput, View } from "../tw";
import { Image } from "../tw/image";

// These are experimental Clerk billing hooks.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useSubscription } = require("@clerk/react/experimental");

const TIER_UPGRADE_LABEL: Record<string, string> = {
  silver: "Silver",
  gold: "Gold",
};

export default function LanguageSelect() {
  const router = useRouter();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const posthog = usePostHog();

  const { data: subscription } = useSubscription({ for: "user" });
  const userTier = getActiveUserTier(subscription);

  const selectedLanguage = LANGUAGES.find((l) => l.code === selectedCode);
  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleLanguagePress(code: string, tier: string) {
    if (!canAccessLanguageTier(tier as any, userTier)) {
      // Nudge user to upgrade
      router.push("/subscription");
      return;
    }
    setSelectedCode(code);
  }

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

        {/* Language list */}
        <View className="gap-3">
          {filteredLanguages.length === 0 ? (
            <View className="items-center py-10">
              <Text className="body-md text-text-secondary">No languages found</Text>
            </View>
          ) : null}

          {filteredLanguages.map((lang) => {
            const isSelected = selectedCode === lang.code;
            const isLocked = !canAccessLanguageTier(lang.tier, userTier);

            return (
              <Pressable
                key={lang.code}
                onPress={() => handleLanguagePress(lang.code, lang.tier)}
                style={{
                  borderColor: isLocked
                    ? "#E5E7EB"
                    : isSelected
                    ? lang.color
                    : "#E5E7EB",
                  borderWidth: isSelected ? 2 : 1.5,
                  backgroundColor: isLocked
                    ? "#F9FAFB"
                    : isSelected
                    ? `${lang.color}18`
                    : "#FFFFFF",
                  opacity: isLocked ? 0.75 : 1,
                }}
                className="rounded-2xl px-4 py-3 flex-row items-center"
              >
                <Image
                  source={{ uri: lang.flag }}
                  className="w-14 h-9 rounded-md"
                  style={{ resizeMode: "cover", opacity: isLocked ? 0.5 : 1 }}
                />
                <View className="ml-4 flex-1">
                  <Text
                    className="body-md text-text-primary"
                    style={{ fontFamily: "Poppins-SemiBold" }}
                  >
                    {lang.name}
                  </Text>
                  {isLocked ? (
                    <Text
                      className="caption mt-0.5"
                      style={{ color: "#6C4EF5", fontFamily: "Poppins-Medium" }}
                    >
                      {TIER_UPGRADE_LABEL[lang.tier] ?? lang.tier} plan required
                    </Text>
                  ) : (
                    <Text className="caption text-text-secondary mt-0.5">
                      {lang.nativeName}
                    </Text>
                  )}
                </View>

                {isLocked ? (
                  <View
                    className="w-7 h-7 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(108,78,245,0.1)" }}
                  >
                    <Ionicons name="lock-closed" size={13} color="#6C4EF5" />
                  </View>
                ) : isSelected ? (
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: lang.color }}
                  >
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Earth image */}
      <View className="bg-surface">
        <Image
          source={images.earth}
          className="w-full h-48"
          style={{ resizeMode: "contain", backgroundColor: "transparent" }}
        />
      </View>

      {/* Confirmation button */}
      <View className="px-6 pt-2 pb-9 bg-transparent">
        <Pressable
          onPress={() => {
            if (selectedCode && selectedLanguage) {
              posthog.capture("language_selected", {
                language_code: selectedCode,
                language_name: selectedLanguage.name,
              });
              setLanguage(selectedCode);
              router.push("/home");
            }
          }}
          disabled={!selectedCode}
          className="btn btn--lg rounded-full py-3"
          style={{
            opacity: selectedCode ? 1 : 0.4,
            backgroundColor: "rgba(108, 78, 245, 0.08)",
            borderWidth: 1.5,
            borderColor: "rgba(108, 78, 245, 0.35)",
          }}
        >
          <Text
            className="text-base"
            style={{ fontFamily: "Poppins-SemiBold", color: "#6C4EF5" }}
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
