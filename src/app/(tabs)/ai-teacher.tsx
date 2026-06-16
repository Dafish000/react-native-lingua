import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";
import { getLanguage } from "../../data/languages";
import { getLessonsForUnit } from "../../data/lessons";
import { getLessonStatus } from "../../data/progress";
import { getUnitsForLanguage } from "../../data/units";
import { useLanguageStore } from "../../store/languageStore";
import { Pressable, ScrollView, Text, View } from "../../tw";
import { Image } from "../../tw/image";
import type { Lesson } from "../../types/learning";
import { extractTeacherName, getLangCode } from "../../utils/lesson-helpers";

// ── Lesson card ───────────────────────────────────────────────────────────────
function LessonCard({
  lesson,
  color,
  isActive,
  onPress,
}: {
  lesson: Lesson;
  color: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const status = getLessonStatus(lesson.id);
  const teacherName = extractTeacherName(lesson.aiTeacherPrompt);
  const locked = status === "notStarted";

  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      className="flex-row items-center mx-5 mb-3 p-4 rounded-2xl border bg-white"
      style={{
        borderColor: isActive ? color : "#E5E7EB",
        opacity: locked ? 0.5 : 1,
      }}
    >
      {/* Status icon */}
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: color + "18" }}
      >
        {status === "completed" ? (
          <Ionicons name="checkmark-circle" size={24} color="#21C16B" />
        ) : status === "inProgress" ? (
          <Ionicons name="play-circle" size={24} color={color} />
        ) : (
          <Ionicons name="lock-closed" size={20} color="#D1D5DB" />
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="font-poppins-semibold text-[14px] text-text-primary">
          {lesson.title}
        </Text>
        <Text className="font-poppins text-[12px] text-text-secondary mt-0.5">
          {teacherName} · {lesson.estimatedMinutes} min
        </Text>
      </View>

      {/* Start button */}
      {!locked && (
        <View
          className="rounded-xl px-3 py-1.5 items-center justify-center ml-2"
          style={{ backgroundColor: color + "18" }}
        >
          <Text
            className="font-poppins-semibold text-[12px]"
            style={{ color }}
          >
            {status === "completed" ? "Review" : "Start"}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ── No language empty state ───────────────────────────────────────────────────
function NoLanguage() {
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
export default function AiTeacher() {
  const router = useRouter();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);

  if (!selectedLanguage) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <NoLanguage />
      </SafeAreaView>
    );
  }

  const language = getLanguage(selectedLanguage);
  const color = language?.color ?? "#6C4EF5";
  const units = getUnitsForLanguage(selectedLanguage);

  // Find the first in-progress lesson across all units
  const inProgressLesson = units
    .flatMap((u) => getLessonsForUnit(u.id))
    .find((l) => getLessonStatus(l.id) === "inProgress");

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <View
        className="mx-4 mt-2 mb-4 rounded-3xl overflow-hidden px-5 pt-5 pb-0"
        style={{ backgroundColor: color + "18" }}
      >
        <Text className="font-poppins-bold text-[22px] text-text-primary">
          AI Teacher
        </Text>
        <Text className="font-poppins text-[13px] text-text-secondary mt-0.5">
          {language?.name} · Audio lessons
        </Text>

        {/* CTA for the current in-progress lesson */}
        {inProgressLesson && (
          <Pressable
            onPress={() => router.push(`/audio-lesson/${inProgressLesson.id}`)}
            className="flex-row items-center mt-4 mb-0 p-3 rounded-2xl"
            style={{ backgroundColor: color }}
          >
            <View className="flex-1">
              <Text className="font-poppins text-[11px] text-white/80">
                Continue lesson
              </Text>
              <Text className="font-poppins-bold text-[15px] text-white mt-0.5">
                {inProgressLesson.title}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="mic" size={20} color="#FFFFFF" />
            </View>
          </Pressable>
        )}

        {/* Mascot */}
        <View className="items-end mt-2">
          <Image
            source={images.mascot}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* ── Lesson list ─────────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
      >
        {units.map((unit) => {
          const lessons = getLessonsForUnit(unit.id);
          const langCode = getLangCode(unit.id);
          const lang = getLanguage(langCode);
          const unitColor = lang?.color ?? color;

          return (
            <View key={unit.id} className="mb-1">
              <View className="px-5 pt-4 pb-2">
                <Text
                  className="font-poppins-semibold text-[13px] uppercase tracking-wide"
                  style={{ color: unitColor }}
                >
                  {unit.title}
                </Text>
              </View>

              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  color={unitColor}
                  isActive={lesson.id === inProgressLesson?.id}
                  onPress={() => router.push(`/audio-lesson/${lesson.id}`)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
