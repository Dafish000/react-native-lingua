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
    lessons: ["fr-lesson-1"],
  },

  // Japanese
  {
    id: "ja-unit-1",
    languageCode: "ja",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, introduce yourself, and ask basic questions.",
    order: 1,
    lessons: ["ja-lesson-1"],
  },

  // Portuguese
  {
    id: "pt-unit-1",
    languageCode: "pt",
    title: "Greetings & Introductions",
    description: "Learn how to say hello, introduce yourself, and ask basic questions.",
    order: 1,
    lessons: ["pt-lesson-1"],
  },
];

export const getUnitsForLanguage = (languageCode: string) =>
  UNITS.filter((u) => u.languageCode === languageCode).sort(
    (a, b) => a.order - b.order
  );
