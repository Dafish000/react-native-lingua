// Placeholder progress data – replace with persistent user progress before shipping.
export type LessonStatus = "completed" | "inProgress" | "notStarted";

const LESSON_STATUS: Record<string, LessonStatus> = {
  "es-lesson-1": "completed",
  "es-lesson-2": "inProgress",
  "fr-lesson-1": "completed",
  "fr-lesson-2": "inProgress",
  "ja-lesson-1": "completed",
  "ja-lesson-2": "inProgress",
  "pt-lesson-1": "completed",
  "pt-lesson-2": "inProgress",
};

export function getLessonStatus(lessonId: string): LessonStatus {
  return LESSON_STATUS[lessonId] ?? "notStarted";
}
