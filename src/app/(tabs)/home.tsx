import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { images } from "../../constants/images";
import { getLanguage } from "../../data/languages";
import { getLessonsForUnit } from "../../data/lessons";
import { getUnitsForLanguage } from "../../data/units";
import { useLanguageStore } from "../../store/languageStore";
import { Pressable, ScrollView, Text, View } from "../../tw";
import { Image } from "../../tw/image";

const GREETINGS: Record<string, string> = {
  es: "Hola",
  fr: "Bonjour",
  ja: "こんにちは",
  pt: "Olá",
};

const STREAK = 12;
const CURRENT_XP = 15;
const DAILY_GOAL_XP = 20;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface PlanItem {
  id: string;
  iconName: IoniconName;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

export default function Home() {
  const { user } = useUser();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const language = selectedLanguage ? getLanguage(selectedLanguage) : null;

  const firstName = user?.firstName ?? "there";
  const greeting = selectedLanguage ? (GREETINGS[selectedLanguage] ?? "Hello") : "Hello";

  const units = selectedLanguage ? getUnitsForLanguage(selectedLanguage) : [];
  const currentUnit = units[0] ?? null;
  const lessons = currentUnit ? getLessonsForUnit(currentUnit.id) : [];
  const currentLesson = lessons[0] ?? null;

  const progressPercent = (CURRENT_XP / DAILY_GOAL_XP) * 100;

  const todayPlan: PlanItem[] = [
    {
      id: "lesson",
      iconName: "book-outline",
      iconColor: "#6C4EF5",
      iconBg: "#EDE9FF",
      title: "Lesson",
      subtitle: currentLesson?.title ?? "At the café",
      completed: true,
    },
    {
      id: "conversation",
      iconName: "headset-outline",
      iconColor: "#4D88FF",
      iconBg: "#EBF2FF",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      completed: false,
    },
    {
      id: "words",
      iconName: "chatbubble-ellipses-outline",
      iconColor: "#FF4D4F",
      iconBg: "#FFEBEC",
      title: "New words",
      subtitle: `${currentLesson?.vocabulary?.length ?? 10} words`,
      completed: false,
    },
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      className="bg-background"
      contentContainerClassName="pb-8 bg-background"
    >
      {/* ── Header ───────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-5">
        <View className="flex-row items-center gap-2">
          {language && (
            <Image
              source={{ uri: language.flag }}
              className="w-[34px] h-[22px] rounded-[3px]"
            />
          )}
          <Text className="font-poppins-semibold text-[17px] text-text-primary">
            {greeting}, {firstName}! 👋
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Image source={images.streakFire} className="w-[22px] h-[22px]" />
            <Text className="font-poppins-semibold text-[15px] text-streak">
              {STREAK}
            </Text>
          </View>
          <Pressable>
            <Ionicons name="notifications-outline" size={24} color="#001328" />
          </Pressable>
        </View>
      </View>

      {/* ── Daily Goal Card ──────────────────────────── */}
      <View className="mx-5 mb-4">
        <View className="flex-row items-center overflow-hidden rounded-[20px] p-5 bg-[#FFF8F0]">
          <View className="flex-1">
            <Text className="font-poppins-medium text-[13px] text-text-secondary mb-1">
              Daily goal
            </Text>
            <Text className="font-poppins-bold text-[22px] text-text-primary mb-3">
              {CURRENT_XP} / {DAILY_GOAL_XP} XP
            </Text>
            <View className="h-2 rounded-full overflow-hidden bg-[#FFE0CC]">
              <View
                className="h-2 rounded-full bg-streak"
                style={{ width: `${progressPercent}%` as any }}
              />
            </View>
          </View>
          <Image source={images.treasure} className="w-20 h-20 ml-4" />
        </View>
      </View>

      {/* ── Continue Learning Card ───────────────────── */}
      <View className="mx-5 mb-6">
        <View className="bg-primary rounded-[20px] overflow-hidden min-h-[148px] p-[22px]">
          <Text className="font-poppins text-[13px] text-white/75 mb-0.5">
            Continue learning
          </Text>
          <Text className="font-poppins-bold text-2xl text-white mb-0.5">
            {language?.name ?? "Spanish"}
          </Text>
          <Text className="font-poppins text-[13px] text-white/70 mb-4">
            A1 · {currentUnit ? `Unit ${currentUnit.order}` : "Unit 1"}
          </Text>
          <Pressable className="bg-white rounded-xl self-start px-5 py-2.5">
            <Text className="font-poppins-semibold text-[14px] text-primary">
              Continue
            </Text>
          </Pressable>
          <Image
            source={images.palace}
            className="absolute right-0 bottom-0 w-[148px] h-[148px]"
          />
        </View>
      </View>

      {/* ── Today's Plan ─────────────────────────────── */}
      <View className="mx-5 mb-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-poppins-semibold text-[17px] text-text-primary">
            Today's plan
          </Text>
          <Pressable>
            <Text className="font-poppins-medium text-[14px] text-primary">
              View all
            </Text>
          </Pressable>
        </View>

        <View className="bg-white rounded-2xl border border-border overflow-hidden">
          {todayPlan.map((item, index) => (
            <View
              key={item.id}
              className="flex-row items-center px-4 py-3.5"
              style={{
                borderBottomWidth: index < todayPlan.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View
                className="w-11 h-11 rounded-xl items-center justify-center mr-[14px]"
                style={{ backgroundColor: item.iconBg }}
              >
                <Ionicons name={item.iconName} size={20} color={item.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="font-poppins-semibold text-sm text-text-primary">
                  {item.title}
                </Text>
                <Text className="font-poppins text-xs text-text-secondary mt-0.5">
                  {item.subtitle}
                </Text>
              </View>
              {item.completed ? (
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-border" />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
