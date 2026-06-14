import type { Unit } from "../types/learning";

export const UNITS: Unit[] = [
  // Spanish
  {
    id: "es-unit-1",
    languageCode: "es",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, introduce yourself, and ask basic questions.",
    order: 1,
    lessons: ["es-lesson-1", "es-lesson-2"],
  },
  {
    id: "es-unit-2",
    languageCode: "es",
    title: "Numbers & Colors",
    description: "Count from 1 to 20 and name common colors.",
    order: 2,
    lessons: ["es-lesson-3"],
  },

  // French
  {
    id: "fr-unit-1",
    languageCode: "fr",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, introduce yourself, and ask basic questions.",
    order: 1,
    lessons: ["fr-lesson-1", "fr-lesson-2"],
  },
  {
    id: "fr-unit-2",
    languageCode: "fr",
    title: "Numbers & Colors",
    description: "Count from 1 to 10 and name common colors in French.",
    order: 2,
    lessons: ["fr-lesson-3", "fr-lesson-4"],
  },
  {
    id: "fr-unit-3",
    languageCode: "fr",
    title: "Food & Daily Life",
    description: "Order food, drinks, and talk about the days of the week.",
    order: 3,
    lessons: ["fr-lesson-5", "fr-lesson-6"],
  },

  // Japanese
  {
    id: "ja-unit-1",
    languageCode: "ja",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, introduce yourself, and ask basic questions.",
    order: 1,
    lessons: ["ja-lesson-1", "ja-lesson-2"],
  },
  {
    id: "ja-unit-2",
    languageCode: "ja",
    title: "Numbers & Writing",
    description: "Count from 1 to 10 and learn your first hiragana characters.",
    order: 2,
    lessons: ["ja-lesson-3", "ja-lesson-4"],
  },
  {
    id: "ja-unit-3",
    languageCode: "ja",
    title: "Food & Colors",
    description: "Order food and drinks and name common colors in Japanese.",
    order: 3,
    lessons: ["ja-lesson-5", "ja-lesson-6"],
  },

  // Portuguese
  {
    id: "pt-unit-1",
    languageCode: "pt",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, introduce yourself, and ask basic questions.",
    order: 1,
    lessons: ["pt-lesson-1", "pt-lesson-2"],
  },
  {
    id: "pt-unit-2",
    languageCode: "pt",
    title: "Numbers & Colors",
    description: "Count from 1 to 10 and name common colors in Portuguese.",
    order: 2,
    lessons: ["pt-lesson-3", "pt-lesson-4"],
  },
  {
    id: "pt-unit-3",
    languageCode: "pt",
    title: "Food & Daily Life",
    description: "Order food, drinks, and talk about the days of the week.",
    order: 3,
    lessons: ["pt-lesson-5", "pt-lesson-6"],
  },
];

export const getUnitsForLanguage = (languageCode: string) =>
  UNITS.filter((u) => u.languageCode === languageCode).sort(
    (a, b) => a.order - b.order
  );
