import { Ionicons } from "@expo/vector-icons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Call, StreamVideoParticipant } from "@stream-io/video-react-native-sdk";
import {
  CallingState,
  StreamCall,
  VideoRenderer,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "../../lib/stream-video";
import { useAuth } from "@clerk/expo";
import { images } from "../../constants/images";
import { getLanguage } from "../../data/languages";
import { getLessonById } from "../../data/lessons";
import { Pressable, Text, View } from "../../tw";
import { Image } from "../../tw/image";
import { extractTeacherName, getLangCode } from "../../utils/lesson-helpers";
import type { Lesson } from "../../types/learning";

// ── Types ─────────────────────────────────────────────────────────────────────

type CallStatus = "connecting" | "connected" | "reconnecting" | "error" | "offline";

const STATUS_CONFIG: Record<CallStatus, { dot: string; label: string }> = {
  connecting: { dot: "#F59E0B", label: "Connecting..." },
  connected: { dot: "#21C16B", label: "Live" },
  reconnecting: { dot: "#F97316", label: "Reconnecting..." },
  error: { dot: "#EF4444", label: "Error" },
  offline: { dot: "#9CA3AF", label: "Practice Mode" },
};

const FEEDBACK: { label: string; color: string }[] = [
  { label: "Excellent", color: "#21C16B" },
  { label: "Great", color: "#21C16B" },
  { label: "Good", color: "#6C4EF5" },
];

// ── Control button ─────────────────────────────────────────────────────────────

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

// ── Shared lesson UI ──────────────────────────────────────────────────────────
// Receives all call state as plain props so it can render inside or outside StreamCall.

function LessonUI({
  lesson,
  isMuted,
  isCamActive,
  participantCount,
  callStatus,
  callError,
  cameraPreview,
  onToggleMic,
  onToggleCam,
  onEndCall,
}: {
  lesson: Lesson;
  isMuted: boolean;
  isCamActive: boolean;
  participantCount: number;
  callStatus: CallStatus;
  callError?: string;
  cameraPreview?: React.ReactNode;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onEndCall: () => void;
}) {
  const router = useRouter();
  const [subtitlesOn, setSubtitlesOn] = useState(true);

  const langCode = getLangCode(lesson.unitId);
  const language = getLanguage(langCode);
  const teacherName = extractTeacherName(lesson.aiTeacherPrompt);
  const langColor = language?.color ?? "#6C4EF5";

  const greetingsByLanguage: Record<string, string> = {
    es: "¡Hola!",
    fr: "Bonjour",
    ja: "こんにちは",
    pt: "Olá",
  };

  const samplePhrase =
    lesson.phrases[0]?.phrase ?? lesson.vocabulary[0]?.word ?? (greetingsByLanguage[langCode] || "Hello");
  const sampleTranslation =
    lesson.phrases[0]?.translation ?? lesson.vocabulary[0]?.translation ?? "";

  const feedbackLabels = ["Speaking", "Pronunciation", "Grammar"];
  const { dot, label } = STATUS_CONFIG[callStatus];

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
            {callStatus === "connecting" || callStatus === "reconnecting" ? (
              <ActivityIndicator size={10} color={dot} />
            ) : (
              <View style={[styles.statusDot, { backgroundColor: dot }]} />
            )}
            <Text className="font-poppins text-[12px]" style={{ color: dot }}>
              {callError ? "Connection failed" : label}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <Ionicons name="videocam-outline" size={22} color="#6B7280" />
          <View className="flex-row items-center bg-surface rounded-full px-2.5 py-1 gap-1">
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text className="font-poppins-medium text-[12px] text-text-secondary">
              {participantCount}
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
        <View style={[styles.blob, { top: -50, right: -30, width: 200, height: 200 }]} />
        <View style={[styles.blob, { bottom: 70, left: -50, width: 160, height: 160, opacity: 0.12 }]} />
        <View style={[styles.blob, { top: 60, left: 30, width: 90, height: 90, opacity: 0.08 }]} />

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

        <View style={[StyleSheet.absoluteFill, styles.glassBorder]} />

        {/* Mascot */}
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

        {/* Front camera PIP — top-right corner of the teacher card */}
        {isCamActive && cameraPreview && (
          <View style={styles.cameraPip}>
            {cameraPreview}
          </View>
        )}
      </View>

      {/* ── Controls card ────────────────────────────────────────────────── */}
      <View className="mx-4 mt-3 rounded-3xl bg-surface px-5 py-4">
        <View className="flex-row items-center justify-between">
          {/* Camera */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon={isCamActive ? "videocam" : "videocam-off"}
              bg={isCamActive ? "#1C1C1E" : "#6B7280"}
              onPress={onToggleCam}
            />
            <Text className="font-poppins text-[11px] text-text-secondary">
              Camera
            </Text>
          </View>

          {/* Mic — wired to real Stream mute state when in a call */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon={isMuted ? "mic-off" : "mic"}
              bg={isMuted ? "#6B7280" : "#1C1C1E"}
              onPress={onToggleMic}
            />
            <Text className="font-poppins text-[11px] text-text-secondary">
              {isMuted ? "Unmute" : "Mic"}
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

          {/* End Call — calls call.leave() then navigates back */}
          <View className="items-center gap-1.5">
            <ControlBtn
              icon="call"
              bg="#FF3B30"
              style={styles.endCallIcon}
              onPress={onEndCall}
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

        <View className="h-px bg-border mt-4 mb-3" />

        {/* Session feedback */}
        <View className="flex-row justify-between px-1">
          {feedbackLabels.map((feedLabel, i) => (
            <View key={feedLabel} className="items-center gap-0.5">
              <Text className="font-poppins text-[12px] text-text-secondary">
                {feedLabel}
              </Text>
              <Text
                className="font-poppins-semibold text-[13px]"
                style={{ color: FEEDBACK[i]?.color ?? "#21C16B" }}
              >
                {callStatus === "connected"
                  ? FEEDBACK[i]?.label ?? "—"
                  : "—"}
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

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {callError && (
        <View className="mx-4 mt-2 p-3 rounded-2xl" style={{ backgroundColor: "#FEF2F2" }}>
          <Text className="font-poppins text-[12px]" style={{ color: "#EF4444" }}>
            ⚠ {callError}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Active call content — inside <StreamCall>, uses Stream hooks ───────────────

function ActiveLessonScreen({ lesson, callError }: { lesson: Lesson; callError?: string }) {
  const router = useRouter();
  const call = useCall();
  const {
    useCallCallingState,
    useMicrophoneState,
    useCameraState,
    useParticipants,
    useLocalParticipant,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const { status: micStatus } = useMicrophoneState();
  const { status: cameraStatus } = useCameraState();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant() as StreamVideoParticipant | undefined;

  const isMuted = micStatus === "disabled";
  const isCamActive = cameraStatus === "enabled";
  const hasLeft = callingState === CallingState.LEFT;

  // Navigate back when the call ends (e.g. host ends for everyone)
  useEffect(() => {
    if (hasLeft) router.back();
  }, [hasLeft, router]);

  const callStatus: CallStatus = (() => {
    if (callError) return "error";
    switch (callingState) {
      case CallingState.JOINING:
        return "connecting";
      case CallingState.RECONNECTING:
        return "reconnecting";
      case CallingState.JOINED:
        return "connected";
      case CallingState.RECONNECTING_FAILED:
      case CallingState.OFFLINE:
        return "error";
      default:
        return "connecting";
    }
  })();

  const toggleMic = async () => {
    try {
      await call?.microphone.toggle();
    } catch (err) {
      console.error("[mic] toggle failed", err);
    }
  };

  const toggleCam = async () => {
    try {
      await call?.camera.toggle();
    } catch (err) {
      console.error("[camera] toggle failed", err);
    }
  };

  const endCall = async () => {
    try {
      if (call && call.state.callingState !== CallingState.LEFT) {
        await call.leave();
      }
    } catch (err) {
      console.error("[call] leave failed", err);
    }
    router.back();
  };

  // Live front-camera preview rendered inside the teacher card PIP slot
  const cameraPreview =
    localParticipant ? (
      <VideoRenderer
        participant={localParticipant}
        trackType="videoTrack"
        isVisible={isCamActive}
        objectFit="cover"
        mirror
      />
    ) : null;

  return (
    <LessonUI
      lesson={lesson}
      isMuted={isMuted}
      isCamActive={isCamActive}
      participantCount={participants.length}
      callStatus={callStatus}
      callError={callError}
      cameraPreview={cameraPreview}
      onToggleMic={toggleMic}
      onToggleCam={toggleCam}
      onEndCall={endCall}
    />
  );
}

// ── Main exported screen ──────────────────────────────────────────────────────
// Creates the Stream call, wraps the inner screen in <StreamCall>, and falls
// back to a static offline view when no Stream client is available.

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const lesson = getLessonById(id);
  const client = useStreamVideoClient();

  const [call, setCall] = useState<Call | undefined>();
  const [callError, setCallError] = useState<string | undefined>();
  // Local mic/cam state used in the offline/connecting fallback only
  const [localMuted, setLocalMuted] = useState(false);
  const [localCamActive, setLocalCamActive] = useState(false);

  // Stable primitive — prevents the effect from re-running when the lesson
  // object reference changes but the id stays the same.
  const lessonId = lesson?.id;

  useEffect(() => {
    if (!client || !lessonId || !userId) return;

    // One call per user per lesson — ensures private practice sessions
    const c = client.call("default", `lesson-${lessonId}-${userId}`, {
      reuseInstance: true,
    });

    // Defer setState to avoid synchronous state update inside the effect body
    void Promise.resolve().then(() => setCall(c));

    c.join({ create: true }).catch((err: Error) => {
      setCallError(err.message ?? "Failed to connect to the lesson");
    });

    return () => {
      setCallError(undefined);
      if (c.state.callingState !== CallingState.LEFT) {
        c.leave().catch(console.error);
      }
      setCall(undefined);
    };
  }, [client, lessonId, userId]);

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

  // Stream call is active — render with live call state
  if (call) {
    return (
      <StreamCall call={call}>
        <ActiveLessonScreen lesson={lesson} callError={callError} />
      </StreamCall>
    );
  }

  // Offline / connecting fallback — static UI with local state
  const isConnecting = !!client && !callError;

  return (
    <LessonUI
      lesson={lesson}
      isMuted={localMuted}
      isCamActive={localCamActive}
      participantCount={1}
      callStatus={callError ? "error" : isConnecting ? "connecting" : "offline"}
      callError={callError}
      onToggleMic={() => setLocalMuted((v) => !v)}
      onToggleCam={() => setLocalCamActive((v) => !v)}
      onEndCall={() => router.back()}
    />
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
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
  cameraPip: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 84,
    height: 116,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.65)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
