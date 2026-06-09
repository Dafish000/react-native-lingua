export type LanguageCode = "es" | "fr" | "ja" | "pt";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export type ActivityType =
  | "vocabulary"
  | "phrase"
  | "multiple_choice"
  | "listen_and_repeat"
  | "fill_in_blank";

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

export interface PhraseItem {
  phrase: string;
  translation: string;
  pronunciation?: string;
  context?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  estimatedMinutes: number;
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  activities: Activity[];
  goals: string[];
  // Prompt passed to the AI teacher (Stream Vision Agent) for audio/video lessons
  aiTeacherPrompt: string;
}

export interface Unit {
  id: string;
  languageCode: LanguageCode;
  title: string;
  description: string;
  order: number;
  lessons: string[]; // lesson ids
}
