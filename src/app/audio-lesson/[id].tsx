import { Ionicons } from "@expo/vector-icons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { useLocalSearchParams, useRouter } from "expo-router";
// Lazy-require so a missing native module doesn't crash the whole screen
type SpeechModule = typeof import("expo-speech");
let Speech: SpeechModule | null = null;
try { Speech = require("expo-speech"); } catch { /* native module not available in this build */ }
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import type { Call, StreamVideoParticipant } from "@stream-io/video-react-native-sdk";
import {
  CallingState,
  StreamCall,
  VideoRenderer,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "../../lib/stream-video";
import { useAuth, useUser } from "@clerk/expo";
import { images } from "../../constants/images";
import { getLanguage } from "../../data/languages";
import { getLessonById } from "../../data/lessons";
import { Pressable, Text, View } from "../../tw";
import { Image } from "../../tw/image";
import { extractTeacherName, getLangCode } from "../../utils/lesson-helpers";
import type { Lesson } from "../../types/learning";

// ── Types ─────────────────────────────────────────────────────────────────────

type CallStatus = "connecting" | "connected" | "reconnecting" | "error" | "offline";
type AgentStatus = "idle" | "connecting" | "connected" | "failed";

/** A single live-caption line forwarded from the Vision Agent. */
type Caption = { id: string; speaker: "agent" | "user"; text: string };

const STATUS_CONFIG: Record<CallStatus, { dot: string; label: string }> = {
  connecting: { dot: "#F59E0B", label: "Connecting..." },
  connected: { dot: "#21C16B", label: "Live" },
  reconnecting: { dot: "#F97316", label: "Reconnecting..." },
  error: { dot: "#EF4444", label: "Error" },
  offline: { dot: "#9CA3AF", label: "Practice Mode" },
};

const AGENT_STATUS_CONFIG: Record<AgentStatus, { dot: string; label: string }> = {
  idle: { dot: "#9CA3AF", label: "AI Teacher" },
  connecting: { dot: "#F59E0B", label: "AI is joining" },
  connected: { dot: "#21C16B", label: "AI Ready" },
  failed: { dot: "#EF4444", label: "AI Offline" },
};

const FEEDBACK: { label: string; color: string }[] = [
  { label: "Excellent", color: "#21C16B" },
  { label: "Great", color: "#21C16B" },
  { label: "Good", color: "#6C4EF5" },
];

// ── Dev-safe API base URL (mirrors the logic in _layout.tsx) ─────────────────

function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) return `http://${hostUri.split(":")[0]}:8081`;
  }
  return "http://localhost:8081";
}

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

function LessonUI({
  lesson,
  isMuted,
  isCamActive,
  participantCount,
  callStatus,
  callError,
  agentStatus,
  isAgentSpeaking,
  captions = [],
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
  agentStatus: AgentStatus;
  isAgentSpeaking: boolean;
  captions?: Caption[];
  cameraPreview?: React.ReactNode;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onEndCall: () => void;
}) {
  const router = useRouter();
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // When the agent first connects it immediately plays its intro.
  // Stream's isSpeaking flag can lag, so we show "speaking" for the first
  // 12 seconds after the agent joins to cover the full introduction.
  const [introPhase, setIntroPhase] = useState(false);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (agentStatus === "connected") {
      setIntroPhase(true);
      introTimerRef.current = setTimeout(() => setIntroPhase(false), 12_000);
    } else {
      setIntroPhase(false);
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
    }
    return () => { if (introTimerRef.current) clearTimeout(introTimerRef.current); };
  }, [agentStatus]);

  // True whenever the agent is actually speaking OR during the intro window
  const agentIsSpeaking = isAgentSpeaking || introPhase;

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

  const speechLang: Record<string, string> = {
    es: "es-ES",
    fr: "fr-FR",
    ja: "ja-JP",
    pt: "pt-BR",
  };

  const speakPhrase = () => {
    if (!Speech) return;
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    Speech.speak(samplePhrase, {
      language: speechLang[langCode] ?? "en-US",
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const feedbackLabels = ["Speaking", "Pronunciation", "Grammar"];
  const { dot, label } = STATUS_CONFIG[callStatus];
  const agentCfg = AGENT_STATUS_CONFIG[agentStatus];

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

          {/* Call status + agent status on the same row */}
          <View className="flex-row items-center gap-1">
            {callStatus === "connecting" || callStatus === "reconnecting" ? (
              <ActivityIndicator size={10} color={dot} />
            ) : (
              <View style={[styles.statusDot, { backgroundColor: dot }]} />
            )}
            <Text className="font-poppins text-[12px]" style={{ color: dot }}>
              {callError ? "Connection failed" : label}
            </Text>

            <Text className="font-poppins text-[12px] text-text-secondary mx-0.5">·</Text>

            {agentStatus === "connecting" ? (
              <ActivityIndicator size={10} color={agentCfg.dot} />
            ) : (
              <View style={[styles.statusDot, { backgroundColor: agentCfg.dot }]} />
            )}
            <Text className="font-poppins text-[12px]" style={{ color: agentCfg.dot }}>
              {agentCfg.label}
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

        {/* Live captions — rolling subtitles for the teacher and the student */}
        {subtitlesOn && captions.length > 0 && (
          <View style={styles.captionsBand} pointerEvents="none">
            {captions.map((c) => {
              const isTeacher = c.speaker === "agent";
              const accent = isTeacher ? langColor : "#60A5FA";
              return (
                <View key={c.id} style={styles.captionLine}>
                  <Text
                    className="font-poppins-semibold text-[11px]"
                    style={{ color: accent }}
                  >
                    {isTeacher ? teacherName : "You"}
                  </Text>
                  <Text
                    className="font-poppins text-[13px] leading-[18px]"
                    style={styles.captionText}
                  >
                    {c.text}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Speech bubble */}
        <View style={styles.bubble}>
          <View className="flex-1">
            {agentStatus === "connected" && !isMuted ? (
              <>
                <View className="flex-row items-center gap-2 mb-0.5">
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: agentIsSpeaking ? langColor : "#21C16B" },
                    ]}
                  />
                  <Text
                    className="font-poppins-semibold text-[13px]"
                    style={{ color: agentIsSpeaking ? langColor : "#21C16B" }}
                  >
                    {agentIsSpeaking ? "AI Teacher is speaking..." : "Listening to you..."}
                  </Text>
                </View>
                <Text className="font-poppins text-[12px] text-text-secondary">
                  {agentIsSpeaking
                    ? "Listen carefully and get ready to repeat"
                    : `Speak in ${language?.name ?? "the target language"}`}
                </Text>
              </>
            ) : (
              <>
                <Text className="font-poppins-bold text-[17px] text-text-primary">
                  {samplePhrase}
                </Text>
                {!!sampleTranslation && (
                  <Text className="font-poppins text-[13px] text-text-secondary mt-0.5">
                    {sampleTranslation} 👏
                  </Text>
                )}
              </>
            )}
          </View>
          <Pressable
            onPress={speakPhrase}
            className="w-9 h-9 rounded-full items-center justify-center ml-3"
            style={{ backgroundColor: isSpeaking ? langColor : langColor + "30" }}
          >
            <Ionicons
              name={isSpeaking ? "volume-high" : "volume-medium-outline"}
              size={18}
              color={isSpeaking ? "#FFFFFF" : langColor}
            />
          </Pressable>
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

          {/* Mic */}
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

          {/* End Call */}
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
                {callStatus === "connected" && agentStatus === "connected"
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

      {agentStatus === "failed" && (
        <View className="mx-4 mt-2 p-3 rounded-2xl" style={{ backgroundColor: "#FEF2F2" }}>
          <Text className="font-poppins text-[12px]" style={{ color: "#EF4444" }}>
            ⚠ AI teacher could not join. Check that the Vision Agent server is running.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Active call content — inside <StreamCall>, uses Stream hooks ───────────────

function ActiveLessonScreen({
  lesson,
  callError,
  agentStatus,
}: {
  lesson: Lesson;
  callError?: string;
  agentStatus: AgentStatus;
}) {
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

  const agentParticipant = participants.find(
    (p) => p.userId === "lingua-ai-teacher"
  ) as StreamVideoParticipant | undefined;
  const isAgentSpeaking = agentParticipant?.isSpeaking ?? false;
  const hasLeft = callingState === CallingState.LEFT;

  // ── Live captions ────────────────────────────────────────────────────────
  // The Vision Agent forwards each finished transcript (teacher + student) as a
  // "lesson.caption" custom event. We keep the few most recent lines so the
  // screen shows a rolling, subtitle-style caption for whoever just spoke.
  const [captions, setCaptions] = useState<Caption[]>([]);
  useEffect(() => {
    if (!call) return;
    const unsubscribe = call.on("custom", (event) => {
      const data = (event as { custom?: Record<string, unknown> }).custom;
      if (!data || data.type !== "lesson.caption") return;

      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!text) return;

      const speaker = data.speaker === "user" ? "user" : "agent";
      const caption: Caption = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        speaker,
        text,
      };
      // Keep only the last two lines so captions stay readable on screen.
      setCaptions((prev) => [...prev, caption].slice(-2));
    });
    return unsubscribe;
  }, [call]);

  // The server marks the agent "connected" as soon as the session request returns,
  // but the OpenAI agent takes a moment to actually join the call. Until it really
  // shows up as a participant (the call goes from 1 -> 2 people), keep showing
  // "AI is joining" instead of a premature "AI Ready".
  const displayedAgentStatus: AgentStatus =
    agentStatus === "connected" && !agentParticipant ? "connecting" : agentStatus;

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
      agentStatus={displayedAgentStatus}
      isAgentSpeaking={isAgentSpeaking}
      captions={captions}
      cameraPreview={cameraPreview}
      onToggleMic={toggleMic}
      onToggleCam={toggleCam}
      onEndCall={endCall}
    />
  );
}

// ── Main exported screen ──────────────────────────────────────────────────────

export default function AudioLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const { user } = useUser();
  const studentName = user?.firstName ?? "";
  const lesson = getLessonById(id);
  const client = useStreamVideoClient();

  const [call, setCall] = useState<Call | undefined>();
  const [callError, setCallError] = useState<string | undefined>();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");

  // Local mic/cam state for the offline/connecting fallback only
  const [localMuted, setLocalMuted] = useState(false);
  const [localCamActive, setLocalCamActive] = useState(false);

  // Refs — survive re-renders without triggering them
  const agentSessionIdRef = useRef<string | null>(null);
  const agentCallIdRef = useRef<string | null>(null);

  const lessonId = lesson?.id;

  useEffect(() => {
    if (!client || !lessonId || !userId || !lesson) return;

    const callId = `lesson-${lessonId}-${userId}`;
    agentCallIdRef.current = callId;

    const c = client.call("default", callId, { reuseInstance: true });
    void Promise.resolve().then(() => setCall(c));

    const apiUrl = getApiUrl();

    const stopAgent = async (cid: string, sessionId: string) => {
      try {
        await fetch(`${apiUrl}/api/agent/stop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callId: cid, sessionId }),
        });
      } catch (err) {
        console.warn("[agent] stop request failed:", err);
      }
    };

    const run = async () => {
      // Join the call (creates it if this is the first join for this lesson/user pair)
      await c.join({ create: true });
      // Enable mic immediately so the agent can hear the user
      try { await c.microphone.enable(); } catch { /* permissions may not be granted yet */ }

      // Pack lesson context into the call's custom data so the agent can read it on join
      await c.update({
        custom: {
          lessonId: lesson.id,
          studentName,
          language: getLangCode(lesson.unitId),
          goals: lesson.goals,
          vocabulary: lesson.vocabulary.map((v) => ({
            word: v.word,
            translation: v.translation,
          })),
          phrases: lesson.phrases.map((p) => ({
            phrase: p.phrase,
            translation: p.translation,
          })),
          aiTeacherPrompt: lesson.aiTeacherPrompt,
        },
      });

      // Start the Vision Agent — server route handles admin role + goLive
      setAgentStatus("connecting");
      const res = await fetch(`${apiUrl}/api/agent/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, callType: "default" }),
      });

      const data = (await res.json()) as { sessionId?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? `Agent start failed (${res.status})`);
      }

      agentSessionIdRef.current = data.sessionId ?? null;
      setAgentStatus("connected");
    };

    run().catch((err: Error) => {
      const msg = err.message ?? "Failed to connect to the lesson";

      // The AI teacher (Vision Agent server) may be offline. That's an expected,
      // handled condition — the call still joined, so surface it as a status, not
      // a hard error/redbox. Use the ref (not the stale `agentStatus` closure value)
      // to know whether the agent ever connected.
      const isAgentError =
        agentSessionIdRef.current === null &&
        (msg.includes("agent") || msg.includes("Agent") || msg.includes("Vision"));

      if (isAgentError) {
        console.warn("[lesson] AI teacher unavailable:", msg);
        setAgentStatus("failed");
      } else {
        console.error("[lesson] run failed:", msg);
        setCallError(msg);
      }
    });

    return () => {
      setCallError(undefined);
      setAgentStatus("idle");

      // Stop the agent session — best-effort
      const sessionId = agentSessionIdRef.current;
      agentSessionIdRef.current = null;
      if (sessionId) {
        void stopAgent(callId, sessionId);
      }

      if (c.state.callingState !== CallingState.LEFT) {
        c.leave().catch(console.error);
      }
      setCall(undefined);
    };
  // `lesson` is excluded because it's stable when `lessonId` is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (call) {
    return (
      <StreamCall call={call}>
        <ActiveLessonScreen
          lesson={lesson}
          callError={callError}
          agentStatus={agentStatus}
        />
      </StreamCall>
    );
  }

  // Offline / connecting fallback
  const isConnecting = !!client && !callError;

  return (
    <LessonUI
      lesson={lesson}
      isMuted={localMuted}
      isCamActive={localCamActive}
      participantCount={1}
      callStatus={callError ? "error" : isConnecting ? "connecting" : "offline"}
      callError={callError}
      agentStatus={agentStatus}
      isAgentSpeaking={false}
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
  captionsBand: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 92,
    gap: 6,
  },
  captionLine: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  captionText: {
    color: "#FFFFFF",
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
