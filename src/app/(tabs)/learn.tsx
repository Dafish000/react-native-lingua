import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";
import { getLanguage } from "../../data/languages";
import { getLessonsForUnit } from "../../data/lessons";
import { getUnitsForLanguage } from "../../data/units";
import { useLanguageStore } from "../../store/languageStore";
import { Pressable, ScrollView, Text, View } from "../../tw";
import { Image } from "../../tw/image";
import { getLessonStatus, type LessonStatus } from "../../data/progress";
import type { Lesson, Unit } from "../../types/learning";

type ActiveTab = "lessons" | "practice";

// ── Status icon (right side of each lesson row) ───────────────────────────────
function StatusIcon({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return (
      <View className="w-8 h-8 rounded-full bg-success items-center justify-center">
        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
      </View>
    );
  }
  if (status === "inProgress") {
    return (
      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
        <Ionicons name="play" size={10} color="#FFFFFF" />
      </View>
    );
  }
  return (
    <View className="w-8 h-8 rounded-full border-2 border-border bg-white items-center justify-center">
      <Ionicons name="lock-closed" size={14} color="#D1D5DB" />
    </View>
  );
}

// ── Single lesson row ─────────────────────────────────────────────────────────
function LessonRow({
  lesson,
  lessonNumber,
  status,
  onPress,
}: {
  lesson: Lesson;
  lessonNumber: number;
  status: LessonStatus;
  onPress: () => void;
}) {
  const isInProgress = status === "inProgress";

  return (
    <Pressable onPress={onPress}>
      <View
        className="flex-row items-center px-5 py-4"
        style={isInProgress ? { backgroundColor: "#EDE9FF" } : undefined}
      >
        <View className="flex-1">
          <Text className="font-poppins text-[11px] text-text-secondary mb-0.5">
            Lesson {lessonNumber}
          </Text>
          <Text className="font-poppins-semibold text-[15px] text-text-primary">
            {lesson.title}
          </Text>
          {isInProgress && (
            <View className="flex-row items-center mt-1 gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-primary" />
              <Text className="font-poppins-medium text-[12px] text-primary">
                In progress
              </Text>
            </View>
          )}
        </View>
        <StatusIcon status={status} />
      </View>
      <View className="h-px bg-border mx-5" />
    </Pressable>
  );
}

// ── Unit section ──────────────────────────────────────────────────────────────
function UnitSection({
  unit,
  unitIndex,
  color,
  router,
}: {
  unit: Unit;
  unitIndex: number;
  color: string;
  router: ReturnType<typeof useRouter>;
}) {
  const lessons = getLessonsForUnit(unit.id);
  const completedCount = lessons.filter(
    (l) => getLessonStatus(l.id) === "completed"
  ).length;

  return (
    <View className="mb-2">
      {/* Unit label row */}
      <View
        className="px-5 py-3"
        style={{ backgroundColor: color + "12" }}
      >
        <Text
          className="font-poppins-bold text-[13px] uppercase tracking-wide"
          style={{ color }}
        >
          Unit {unitIndex + 1} · {unit.title}
        </Text>
        <Text className="font-poppins text-[12px] text-text-secondary mt-0.5">
          {completedCount} / {lessons.length} lessons completed
        </Text>
      </View>

      {lessons.map((lesson, lessonIndex) => (
        <LessonRow
          key={lesson.id}
          lesson={lesson}
          lessonNumber={lessonIndex + 1}
          status={getLessonStatus(lesson.id)}
          onPress={() => router.push(`/lesson/${lesson.id}`)}
        />
      ))}
    </View>
  );
}

// ── Practice tab ──────────────────────────────────────────────────────────────
function PracticeTab({
  language,
  color,
  router,
}: {
  language: ReturnType<typeof getLanguage>;
  color: string;
  router: ReturnType<typeof useRouter>;
}) {
  const selectedLanguage = language?.code ?? "";
  const units = getUnitsForLanguage(selectedLanguage);

  const practiceable = units.flatMap((unit) =>
    getLessonsForUnit(unit.id).filter((l) => {
      const s = getLessonStatus(l.id);
      return s === "completed" || s === "inProgress";
    })
  );

  if (practiceable.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Image source={images.mascot} className="w-28 h-28 mb-4" />
        <Text className="font-poppins-semibold text-[18px] text-text-primary text-center mb-2">
          Complete a lesson first
        </Text>
        <Text className="font-poppins text-[14px] text-text-secondary text-center">
          Finish at least one lesson to unlock practice mode.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
      <View className="px-5 pt-5 pb-3">
        <Text className="font-poppins-semibold text-[17px] text-text-primary">
          Practice what you've learned
        </Text>
        <Text className="font-poppins text-[13px] text-text-secondary mt-1">
          Tap any lesson to review vocabulary and activities.
        </Text>
      </View>

      {practiceable.map((lesson) => {
        const status = getLessonStatus(lesson.id);
        return (
          <Pressable
            key={lesson.id}
            onPress={() => router.push(`/lesson/${lesson.id}?tab=activities`)}
            className="flex-row items-center mx-5 mb-3 p-4 rounded-2xl border border-border bg-white"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: color + "20" }}
            >
              <Ionicons
                name={status === "completed" ? "checkmark-circle" : "play-circle"}
                size={22}
                color={status === "completed" ? "#21C16B" : color}
              />
            </View>
            <View className="flex-1">
              <Text className="font-poppins-semibold text-[14px] text-text-primary">
                {lesson.title}
              </Text>
              <Text className="font-poppins text-[12px] text-text-secondary mt-0.5">
                {lesson.vocabulary.length} words · {lesson.activities.length} activities
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function NoLanguageSelected() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Image source={images.earth} className="w-24 h-24 mb-4" />
      <Text className="font-poppins-semibold text-[20px] text-text-primary text-center mb-2">
        No language selected
      </Text>
      <Text className="font-poppins text-[14px] text-text-secondary text-center">
        Go to the Languages tab to pick a language to learn.
      </Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Learn() {
  const router = useRouter();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const [activeTab, setActiveTab] = useState<ActiveTab>("lessons");

  if (!selectedLanguage) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <NoLanguageSelected />
      </SafeAreaView>
    );
  }

  const language = getLanguage(selectedLanguage);
  const color = language?.color ?? "#6C4EF5";
  const units = getUnitsForLanguage(selectedLanguage);

  // Find the current active unit (first with an in-progress or not-started lesson)
  const activeUnit = units.find((unit) =>
    getLessonsForUnit(unit.id).some(
      (l) => getLessonStatus(l.id) !== "completed"
    )
  ) ?? units[0];

  const activeUnitIndex = units.findIndex((u) => u.id === activeUnit?.id);
  const activeUnitLessons = activeUnit ? getLessonsForUnit(activeUnit.id) : [];
  const completedInUnit = activeUnitLessons.filter(
    (l) => getLessonStatus(l.id) === "completed"
  ).length;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

      {/* ── Illustrated header ─────────────────────────────────────── */}
      <View className="overflow-hidden" style={{ backgroundColor: color + "18" }}>
        <View className="px-5 pt-4 pb-0 flex-row items-end">
          <View className="flex-1 pb-4">
            <Text className="font-poppins text-[13px]" style={{ color }}>
              Unit {activeUnitIndex + 1}  ·  {completedInUnit} / {activeUnitLessons.length} lessons
            </Text>
            <Text className="font-poppins-bold text-[24px] text-text-primary mt-0.5">
              {activeUnit?.title ?? language?.name}
            </Text>
          </View>
          {/* Palace + mascot stacked illustration */}
          <View className="w-[110px] h-[90px] relative">
            <Image
              source={images.palace}
              className="absolute bottom-0 right-0 w-[90px] h-[90px]"
              style={{ objectFit: "contain" } as any}
            />
            <Image
              source={images.mascot}
              className="absolute bottom-0 left-0 w-[52px] h-[52px]"
              style={{ objectFit: "contain" } as any}
            />
          </View>
        </View>

        {/* ── Lessons / Practice tab bar ────────────────────────────── */}
        <View className="flex-row border-b border-border bg-white">
          {(["lessons", "practice"] as ActiveTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className="flex-1 items-center py-3"
              >
                <Text
                  className="font-poppins-semibold text-[15px]"
                  style={{ color: isActive ? color : "#6B7280" }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
                {isActive && (
                  <View
                    className="absolute bottom-0 left-6 right-6 h-[2.5px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Tab content ───────────────────────────────────────────────── */}
      {activeTab === "lessons" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
          {units.map((unit, unitIndex) => (
            <UnitSection
              key={unit.id}
              unit={unit}
              unitIndex={unitIndex}
              color={color}
              router={router}
            />
          ))}
        </ScrollView>
      ) : (
        <PracticeTab language={language} color={color} router={router} />
      )}
    </SafeAreaView>
  );
}
