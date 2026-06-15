import { Ionicons } from "@expo/vector-icons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";
import { getLanguage } from "../../data/languages";
import { getLessonById } from "../../data/lessons";
import { Pressable, Text, View } from "../../tw";
import { Image } from "../../tw/image";

function getLangCode(unitId: string): string {
  return unitId.split("-")[0] ?? "es";
}

function extractTeacherName(prompt: string): string {
  const match = prompt.match(/named (\w+)/);
  return match?.[1] ?? "Teacher";
}

type FeedbackLevel = { label: string; color: string };
const FEEDBACK: FeedbackLevel[] = [
  { label: "Excellent", color: "#21C16B" },
  { label: "Great", color: "#21C16B" },
  { label: "Good", color: "#6C4EF5" },
];

// ── Control button ────────────────────────────────────────────────────────────
function ControlBtn({
  icon,
  bg,
  size = 24,
  onPress,
  style,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  bg: string;
  size?: number;
  onPress?: () => void;
  style?: object;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.controlBtn, { backgroundColor: bg }, style]}
    >
      <Ionicons name={icon} size={size} color="#FFFFFF" />
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);

  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(false);
  const [subtitlesOn, setSubtitlesOn] = useState(true);

  if (!lesson) {
    return (
      <SafeAreaView
        edges={["top", "bottom"]}
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      >
        <View className="flex-1 items-center justify-center">
          <Text className="font-poppins text-text-secondary">
            Lesson not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const langCode = getLangCode(lesson.unitId);
  const language = getLanguage(langCode);
  const teacherName = extractTeacherName(lesson.aiTeacherPrompt);
  const langColor = language?.color ?? "#6C4EF5";

  // Pick the first phrase as the sample speech bubble, fall back to a greeting
  const samplePhrase =
    lesson.phrases[0]?.phrase ?? lesson.vocabulary[0]?.word ?? "¡Hola!";
  const sampleTranslation =
    lesson.phrases[0]?.translation ?? lesson.vocabulary[0]?.translation ?? "";

  const feedbackLabels = ["Speaking", "Pronunciation", "Grammar"];

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full items-center justify-center mr-2"
        >
          <Ionicons name="chevron-back" size={22} color="#001328" />
        </Pressable>

        <View className="flex-1">
          <Text className="font-poppins-bold text-[17px] text-text-primary">
            AI Teacher
          </Text>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-success" />
            <Text className="font-poppins text-[12px] text-success">
              Online
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <Ionicons name="videocam-outline" size={22} color="#6B7280" />
          <View className="flex-row items-center bg-surface rounded-full px-2.5 py-1 gap-1">
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text className="font-poppins-medium text-[12px] text-text-secondary">
              12
            </Text>
          </View>
          <Ionicons name="notifications-outline" size={22} color="#6B7280" />
        </View>
      </View>

      {/* ── Teacher area — glassmorphism card ───────────────────────────── */}
      <View
        className="mx-4 rounded-3xl overflow-hidden"
        style={[styles.teacherArea, { backgroundColor: langColor }]}
      >
        {/* Decorative blobs: white circles that give depth to the frosted layer */}
        <View style={[styles.blob, { top: -50, right: -30, width: 200, height: 200 }]} />
        <View style={[styles.blob, { bottom: 70, left: -50, width: 160, height: 160, opacity: 0.12 }]} />
        <View style={[styles.blob, { top: 60, left: 30, width: 90, height: 90, opacity: 0.08 }]} />

        {/* Glass frost layer */}
        {Platform.OS === "ios" &&
        isGlassEffectAPIAvailable() &&
        isLiquidGlassAvailable() ? (
          <GlassView
            glassEffectStyle="regular"
            colorScheme="light"
            style={[StyleSheet.absoluteFill, styles.glassView]}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.glassOverlay]} />
        )}

        {/* Subtle inner border sheen (glass highlight) */}
        <View style={[StyleSheet.absoluteFill, styles.glassBorder]} />

        {/* Mascot/teacher */}
        <View className="flex-1 items-center justify-end pb-2">
          <Image
            source={images.mascot}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        {/* Speech bubble */}
        <View style={styles.bubble}>
          <View className="flex-1">
            <Text className="font-poppins-bold text-[17px] text-text-primary">
              {samplePhrase}
            </Text>
            {!!sampleTranslation && (
              <Text className="font-poppins text-[13px] text-text-secondary mt-0.5">
                {sampleTranslation} 👏
              </Text>
            )}
          </View>
          <View
            className="w-9 h-9 rounded-full items-center justify-center ml-3"
            style={{ backgroundColor: langColor + "30" }}
          >
            <Ionicons name="volume-high" size={18} color={langColor} />
          </View>
        </View>
      </View>

      {/* ── Controls card ────────────────────────────────────────────────── */}
      <View className="mx-4 mt-3 rounded-3xl bg-surface px-5 py-4">
        {/* Button row */}
        <View className="flex-row items-center justify-between">
          {/* Camera */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon={camActive ? "videocam" : "videocam-off"}
              bg={camActive ? "#1C1C1E" : "#6B7280"}
              onPress={() => setCamActive((v) => !v)}
            />
            <Text className="font-poppins text-[11px] text-text-secondary">
              Camera
            </Text>
          </View>

          {/* Mic */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon={micActive ? "mic" : "mic-off"}
              bg={micActive ? "#1C1C1E" : "#6B7280"}
              onPress={() => setMicActive((v) => !v)}
            />
            <Text className="font-poppins text-[11px] text-text-secondary">
              Mic
            </Text>
          </View>

          {/* Subtitles */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon="text"
              bg={subtitlesOn ? "#1C1C1E" : "#6B7280"}
              onPress={() => setSubtitlesOn((v) => !v)}
            />
            <Text className="font-poppins text-[11px] text-text-secondary">
              Subtitles
            </Text>
          </View>

          {/* End Call */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon="call"
              bg="#FF3B30"
              style={styles.endCallIcon}
              onPress={() => router.back()}
            />
            <Text className="font-poppins text-[11px] text-text-secondary">
              End Call
            </Text>
          </View>

          {/* Lesson pill */}
          <View className="items-center gap-1.5">
            <Pressable
              className="rounded-2xl px-4 items-center justify-center"
              style={[styles.lessonPill, { backgroundColor: langColor + "18" }]}
            >
              <Ionicons name="book-outline" size={20} color={langColor} />
            </Pressable>
            <Text className="font-poppins text-[11px] text-text-secondary">
              Lesson
            </Text>
          </View>
        </View>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <View className="h-px bg-border mt-4 mb-3" />

        {/* ── Session feedback ─────────────────────────────────────────── */}
        <View className="flex-row justify-between px-1">
          {feedbackLabels.map((label, i) => (
            <View key={label} className="items-center gap-0.5">
              <Text className="font-poppins text-[12px] text-text-secondary">
                {label}
              </Text>
              <Text
                className="font-poppins-semibold text-[13px]"
                style={{ color: FEEDBACK[i]?.color ?? "#21C16B" }}
              >
                {FEEDBACK[i]?.label ?? "—"}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Lesson info strip ────────────────────────────────────────────── */}
      <View className="px-5 pt-3 flex-row items-center gap-2">
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: langColor }}
        />
        <Text className="font-poppins-medium text-[13px] text-text-secondary flex-1">
          {lesson.title}
        </Text>
        <Text
          className="font-poppins-semibold text-[12px]"
          style={{ color: langColor }}
        >
          {teacherName}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  teacherArea: {
    height: 340,
    position: "relative",
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  glassView: {
    borderRadius: 24,
  },
  glassOverlay: {
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  glassBorder: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  mascot: {
    width: 220,
    height: 240,
  },
  bubble: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  endCallIcon: {
    transform: [{ rotate: "135deg" }],
  },
  lessonPill: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
});
