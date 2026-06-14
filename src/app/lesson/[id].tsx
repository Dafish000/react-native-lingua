import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLessonById } from "../../data/lessons";
import type { Activity } from "../../types/learning";
import { Pressable, ScrollView, Text, View } from "../../tw";

type PracticeTab = "vocabulary" | "activities";

// ── Vocabulary card ───────────────────────────────────────────────────────────
function VocabCard({
  word,
  translation,
  pronunciation,
  exampleSentence,
  exampleTranslation,
}: {
  word: string;
  translation: string;
  pronunciation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}) {
  return (
    <View className="bg-white border border-border rounded-2xl p-4 mb-3 mx-5">
      <View className="flex-row items-start justify-between mb-1">
        <Text className="font-poppins-bold text-[18px] text-text-primary flex-1">
          {word}
        </Text>
        <Text className="font-poppins-semibold text-[14px] text-primary ml-2">
          {translation}
        </Text>
      </View>
      {pronunciation && (
        <Text className="font-poppins text-[12px] text-text-secondary mb-2">
          /{pronunciation}/
        </Text>
      )}
      {exampleSentence && (
        <View className="bg-surface rounded-xl p-3 mt-1">
          <Text className="font-poppins-medium text-[13px] text-text-primary">
            {exampleSentence}
          </Text>
          {exampleTranslation && (
            <Text className="font-poppins text-[12px] text-text-secondary mt-0.5">
              {exampleTranslation}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

// ── Multiple choice activity ──────────────────────────────────────────────────
function MultipleChoiceActivity({
  activity,
  onAnswer,
}: {
  activity: Activity;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    onAnswer(option === activity.answer);
  };

  return (
    <View className="mb-6">
      <Text className="font-poppins-semibold text-[16px] text-text-primary mb-4 mx-5">
        {activity.question}
      </Text>
      <View className="mx-5 gap-3">
        {(activity.options ?? []).map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === activity.answer;
          let bgColor = "bg-white";
          let borderColor = "border-border";
          let textColor = "text-text-primary";

          if (isSelected && isCorrect) {
            bgColor = "bg-success/10";
            borderColor = "border-success";
            textColor = "text-success";
          } else if (isSelected && !isCorrect) {
            bgColor = "bg-error/10";
            borderColor = "border-error";
            textColor = "text-error";
          } else if (selected && isCorrect) {
            bgColor = "bg-success/10";
            borderColor = "border-success";
            textColor = "text-success";
          }

          return (
            <Pressable
              key={option}
              onPress={() => handleSelect(option)}
              className={`p-4 rounded-2xl border ${bgColor} ${borderColor}`}
            >
              <Text className={`font-poppins-medium text-[14px] ${textColor}`}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ── Fill in the blank activity ────────────────────────────────────────────────
function FillInBlankActivity({
  activity,
  onAnswer,
}: {
  activity: Activity;
  onAnswer: (correct: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const reveal = () => {
    setRevealed(true);
    onAnswer(true);
  };

  return (
    <View className="mb-6 mx-5">
      <Text className="font-poppins-semibold text-[16px] text-text-primary mb-3">
        {activity.question}
      </Text>
      {activity.hint && (
        <Text className="font-poppins text-[13px] text-text-secondary mb-3">
          Hint: {activity.hint}
        </Text>
      )}
      {revealed ? (
        <View className="bg-success/10 border border-success rounded-2xl p-4">
          <Text className="font-poppins-bold text-[16px] text-success">
            ✓ {activity.answer}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={reveal}
          className="bg-primary rounded-2xl p-4 items-center"
        >
          <Text className="font-poppins-semibold text-[14px] text-white">
            Reveal Answer
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLessonById(id);

  const [activeTab, setActiveTab] = useState<PracticeTab>("vocabulary");
  const [score, setScore] = useState({ correct: 0, total: 0 });

  if (!lesson) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 items-center justify-center">
          <Text className="font-poppins text-text-secondary">Lesson not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAnswer = (correct: boolean) => {
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleComplete = () => {
    Alert.alert(
      "🎉 Lesson Complete!",
      `You scored ${score.correct} / ${score.total} on activities.\n\n+${lesson.xpReward} XP earned!`,
      [{ text: "Continue", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3"
        >
          <Ionicons name="arrow-back" size={20} color="#001328" />
        </Pressable>
        <View className="flex-1">
          <Text className="font-poppins-bold text-[18px] text-text-primary" numberOfLines={1}>
            {lesson.title}
          </Text>
          <Text className="font-poppins text-[12px] text-text-secondary">
            {lesson.estimatedMinutes} min · {lesson.xpReward} XP
          </Text>
        </View>
        {score.total > 0 && (
          <View className="bg-success/10 rounded-xl px-3 py-1.5">
            <Text className="font-poppins-semibold text-[13px] text-success">
              {score.correct}/{score.total}
            </Text>
          </View>
        )}
      </View>

      {/* ── Vocabulary / Activities tabs ─────────────────────────────── */}
      <View className="flex-row border-b border-border">
        {(["vocabulary", "activities"] as PracticeTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 items-center py-3"
            >
              <Text
                className="font-poppins-semibold text-[14px]"
                style={{ color: isActive ? "#6C4EF5" : "#6B7280" }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-6 right-6 h-[2.5px] rounded-full bg-primary" />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* ── Tab content ─────────────────────────────────────────────── */}
      {activeTab === "vocabulary" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-4 pb-8">
          {lesson.description && (
            <Text className="font-poppins text-[14px] text-text-secondary mx-5 mb-4">
              {lesson.description}
            </Text>
          )}
          {lesson.goals.length > 0 && (
            <View className="mx-5 mb-4 bg-primary/5 rounded-2xl p-4">
              <Text className="font-poppins-semibold text-[13px] text-primary mb-2">
                Goals
              </Text>
              {lesson.goals.map((goal, i) => (
                <View key={i} className="flex-row gap-2 mb-1">
                  <Text className="text-primary text-[13px]">•</Text>
                  <Text className="font-poppins text-[13px] text-text-primary flex-1">
                    {goal}
                  </Text>
                </View>
              ))}
            </View>
          )}
          {lesson.vocabulary.map((item, i) => (
            <VocabCard
              key={i}
              word={item.word}
              translation={item.translation}
              pronunciation={item.pronunciation}
              exampleSentence={item.exampleSentence}
              exampleTranslation={item.exampleTranslation}
            />
          ))}
          {lesson.phrases.length > 0 && (
            <>
              <Text className="font-poppins-bold text-[15px] text-text-primary mx-5 mt-4 mb-3">
                Key Phrases
              </Text>
              {lesson.phrases.map((phrase, i) => (
                <View key={i} className="bg-white border border-border rounded-2xl p-4 mb-3 mx-5">
                  <Text className="font-poppins-bold text-[15px] text-text-primary mb-0.5">
                    {phrase.phrase}
                  </Text>
                  <Text className="font-poppins-medium text-[13px] text-primary mb-1">
                    {phrase.translation}
                  </Text>
                  {phrase.pronunciation && (
                    <Text className="font-poppins text-[12px] text-text-secondary">
                      /{phrase.pronunciation}/
                    </Text>
                  )}
                  {phrase.context && (
                    <Text className="font-poppins text-[12px] text-text-secondary mt-1 italic">
                      {phrase.context}
                    </Text>
                  )}
                </View>
              ))}
            </>
          )}
          <Pressable
            onPress={() => setActiveTab("activities")}
            className="mx-5 mt-2 bg-primary rounded-2xl py-4 items-center"
          >
            <Text className="font-poppins-semibold text-[15px] text-white">
              Start Practice →
            </Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pt-5 pb-8">
          {lesson.activities.length === 0 ? (
            <View className="flex-1 items-center justify-center py-16 px-8">
              <Text className="font-poppins text-text-secondary text-center">
                No activities for this lesson yet.
              </Text>
            </View>
          ) : (
            <>
              {lesson.activities.map((activity) =>
                activity.type === "multiple_choice" ? (
                  <MultipleChoiceActivity
                    key={activity.id}
                    activity={activity}
                    onAnswer={handleAnswer}
                  />
                ) : activity.type === "fill_in_blank" ? (
                  <FillInBlankActivity
                    key={activity.id}
                    activity={activity}
                    onAnswer={handleAnswer}
                  />
                ) : null
              )}
              <Pressable
                onPress={handleComplete}
                className="mx-5 mt-2 bg-success rounded-2xl py-4 items-center"
              >
                <Text className="font-poppins-semibold text-[15px] text-white">
                  Complete Lesson
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
