import type { Lesson } from "../types/learning";

export const LESSONS: Lesson[] = [
  // ─── Spanish ────────────────────────────────────────────────────────────────
  {
    id: "es-lesson-1",
    unitId: "es-unit-1",
    title: "Hello & Goodbye",
    description: "Master the most common Spanish greetings.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye in Spanish",
      "Understand when to use formal vs informal greetings",
    ],
    vocabulary: [
      {
        word: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        exampleSentence: "¡Hola! ¿Cómo estás?",
        exampleTranslation: "Hello! How are you?",
      },
      {
        word: "adiós",
        translation: "goodbye",
        pronunciation: "ah-DYOS",
        exampleSentence: "Adiós, hasta luego.",
        exampleTranslation: "Goodbye, see you later.",
      },
      {
        word: "hasta luego",
        translation: "see you later",
        pronunciation: "AHS-tah LWEH-goh",
      },
      {
        word: "buenos días",
        translation: "good morning",
        pronunciation: "BWEH-nohs DEE-ahs",
      },
      {
        word: "buenas noches",
        translation: "good night",
        pronunciation: "BWEH-nahs NOH-chays",
      },
    ],
    phrases: [
      {
        phrase: "¿Cómo estás?",
        translation: "How are you? (informal)",
        pronunciation: "KOH-moh ehs-TAHS",
        context: "Use with friends and people your age.",
      },
      {
        phrase: "¿Cómo está usted?",
        translation: "How are you? (formal)",
        pronunciation: "KOH-moh ehs-TAH oos-TEHD",
        context: "Use with elders, bosses, or strangers.",
      },
      {
        phrase: "Muy bien, gracias.",
        translation: "Very well, thank you.",
        pronunciation: "MWEE byehn, GRAH-syahs",
      },
    ],
    activities: [
      {
        id: "es-l1-a1",
        type: "multiple_choice",
        question: "How do you say 'hello' in Spanish?",
        answer: "hola",
        options: ["hola", "adiós", "gracias", "por favor"],
      },
      {
        id: "es-l1-a2",
        type: "fill_in_blank",
        question: "Complete: '¡___! ¿Cómo estás?'",
        answer: "Hola",
        hint: "The most common Spanish greeting.",
      },
      {
        id: "es-l1-a3",
        type: "multiple_choice",
        question: "Which greeting is formal?",
        answer: "¿Cómo está usted?",
        options: [
          "¿Cómo estás?",
          "¿Cómo está usted?",
          "¿Qué tal?",
          "¿Qué pasa?",
        ],
      },
    ],
    aiTeacherPrompt: `You are a friendly Spanish teacher named Sofia.
Your student is an absolute beginner learning Spanish greetings for the first time.
Speak warmly and encouragingly. Keep sentences short.
Teach: hola, adiós, buenos días, buenas noches, ¿Cómo estás?, Muy bien gracias.
Pronounce each word slowly and clearly, then use it in a simple sentence.
After each word, pause and invite the student to repeat.
End the lesson by roleplaying a short greeting conversation with the student.`,
  },

  {
    id: "es-lesson-2",
    unitId: "es-unit-1",
    title: "Introducing Yourself",
    description: "Learn to share your name and where you're from.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Introduce yourself in Spanish",
      "Ask and answer 'What is your name?' and 'Where are you from?'",
    ],
    vocabulary: [
      {
        word: "me llamo",
        translation: "my name is",
        pronunciation: "meh YAH-moh",
        exampleSentence: "Me llamo Ana.",
        exampleTranslation: "My name is Ana.",
      },
      {
        word: "soy de",
        translation: "I am from",
        pronunciation: "soy deh",
        exampleSentence: "Soy de México.",
        exampleTranslation: "I am from Mexico.",
      },
      {
        word: "encantado / encantada",
        translation: "nice to meet you",
        pronunciation: "en-kahn-TAH-doh / en-kahn-TAH-dah",
      },
    ],
    phrases: [
      {
        phrase: "¿Cómo te llamas?",
        translation: "What is your name?",
        pronunciation: "KOH-moh teh YAH-mahs",
      },
      {
        phrase: "¿De dónde eres?",
        translation: "Where are you from?",
        pronunciation: "deh DON-deh EH-rehs",
      },
    ],
    activities: [
      {
        id: "es-l2-a1",
        type: "multiple_choice",
        question: "How do you say 'My name is Carlos'?",
        answer: "Me llamo Carlos.",
        options: [
          "Me llamo Carlos.",
          "Soy Carlos llamo.",
          "Carlos me soy.",
          "Llamo Carlos me.",
        ],
      },
      {
        id: "es-l2-a2",
        type: "fill_in_blank",
        question: "Complete: 'Soy ___ México.' (I am from Mexico)",
        answer: "de",
        hint: "A small preposition meaning 'from'.",
      },
    ],
    aiTeacherPrompt: `You are a friendly Spanish teacher named Sofia.
Your student has just learned basic greetings and is now learning to introduce themselves.
Teach: me llamo, soy de, ¿Cómo te llamas?, ¿De dónde eres?, encantado/encantada.
Ask the student their name and where they are from.
Respond naturally as if having a real conversation.
Correct mistakes gently and keep the energy positive and fun.`,
  },

  {
    id: "es-lesson-3",
    unitId: "es-unit-2",
    title: "Numbers 1–10",
    description: "Count from one to ten in Spanish.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Count from 1 to 10 in Spanish"],
    vocabulary: [
      { word: "uno", translation: "one", pronunciation: "OO-noh" },
      { word: "dos", translation: "two", pronunciation: "dohs" },
      { word: "tres", translation: "three", pronunciation: "trehs" },
      { word: "cuatro", translation: "four", pronunciation: "KWAH-troh" },
      { word: "cinco", translation: "five", pronunciation: "SEEN-koh" },
      { word: "seis", translation: "six", pronunciation: "sayss" },
      { word: "siete", translation: "seven", pronunciation: "SYEH-teh" },
      { word: "ocho", translation: "eight", pronunciation: "OH-choh" },
      { word: "nueve", translation: "nine", pronunciation: "NWEH-beh" },
      { word: "diez", translation: "ten", pronunciation: "dyehs" },
    ],
    phrases: [],
    activities: [
      {
        id: "es-l3-a1",
        type: "multiple_choice",
        question: "What is 'cinco' in English?",
        answer: "five",
        options: ["four", "five", "six", "seven"],
      },
      {
        id: "es-l3-a2",
        type: "multiple_choice",
        question: "How do you say 'eight' in Spanish?",
        answer: "ocho",
        options: ["siete", "nueve", "ocho", "diez"],
      },
    ],
    aiTeacherPrompt: `You are a friendly Spanish teacher named Sofia.
Teach the numbers 1 through 10 in Spanish using a fun counting rhythm.
Say each number clearly with its pronunciation, then count the full sequence together.
Play a simple game: say a number in English and ask the student to respond in Spanish.
Keep it playful — celebrate correct answers enthusiastically!`,
  },

  // ─── French ─────────────────────────────────────────────────────────────────
  {
    id: "fr-lesson-1",
    unitId: "fr-unit-1",
    title: "Hello & Goodbye",
    description: "Master the most common French greetings.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye in French",
      "Understand formal vs informal greetings",
    ],
    vocabulary: [
      {
        word: "bonjour",
        translation: "hello / good day",
        pronunciation: "bohn-ZHOOR",
        exampleSentence: "Bonjour! Comment allez-vous?",
        exampleTranslation: "Hello! How are you?",
      },
      {
        word: "salut",
        translation: "hi / bye (informal)",
        pronunciation: "sah-LUE",
      },
      {
        word: "au revoir",
        translation: "goodbye",
        pronunciation: "oh reh-VWAHR",
      },
      {
        word: "bonne nuit",
        translation: "good night",
        pronunciation: "bun NWEE",
      },
    ],
    phrases: [
      {
        phrase: "Comment allez-vous?",
        translation: "How are you? (formal)",
        pronunciation: "koh-MAHN ah-lay-VOO",
        context: "Formal — use with strangers or in professional settings.",
      },
      {
        phrase: "Comment ça va?",
        translation: "How's it going? (informal)",
        pronunciation: "koh-MAHN sah VAH",
        context: "Informal — use with friends.",
      },
      {
        phrase: "Très bien, merci.",
        translation: "Very well, thank you.",
        pronunciation: "treh byaN, mehr-SEE",
      },
    ],
    activities: [
      {
        id: "fr-l1-a1",
        type: "multiple_choice",
        question: "How do you say 'hello' (formal) in French?",
        answer: "bonjour",
        options: ["salut", "bonjour", "au revoir", "merci"],
      },
      {
        id: "fr-l1-a2",
        type: "fill_in_blank",
        question: "Complete: '___ revoir!' (Goodbye!)",
        answer: "Au",
        hint: "Two-word farewell phrase.",
      },
    ],
    aiTeacherPrompt: `You are a charming French teacher named Claire.
Your student is a complete beginner learning French greetings.
Teach: bonjour, salut, au revoir, bonne nuit, Comment ça va?, Très bien merci.
Speak with warmth and a little French flair. Pronounce each phrase slowly and clearly.
Explain the difference between formal and informal greetings.
End with a short roleplay: greet the student and say goodbye.`,
  },

  // ─── Japanese ───────────────────────────────────────────────────────────────
  {
    id: "ja-lesson-1",
    unitId: "ja-unit-1",
    title: "Hello & Goodbye",
    description: "Learn essential Japanese greetings.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye in Japanese",
      "Use time-based greetings correctly",
    ],
    vocabulary: [
      {
        word: "こんにちは",
        translation: "hello / good afternoon",
        pronunciation: "kon-ni-chi-WA",
        exampleSentence: "こんにちは！お元気ですか？",
        exampleTranslation: "Hello! How are you?",
      },
      {
        word: "おはようございます",
        translation: "good morning (formal)",
        pronunciation: "o-ha-yo-go-za-i-MAS",
      },
      {
        word: "こんばんは",
        translation: "good evening",
        pronunciation: "kon-BAN-wa",
      },
      {
        word: "さようなら",
        translation: "goodbye",
        pronunciation: "sa-yo-NA-ra",
      },
      {
        word: "またね",
        translation: "see you (informal)",
        pronunciation: "ma-ta-NE",
      },
    ],
    phrases: [
      {
        phrase: "お元気ですか？",
        translation: "How are you?",
        pronunciation: "o-GEN-ki des-KA",
      },
      {
        phrase: "元気です、ありがとう。",
        translation: "I'm fine, thank you.",
        pronunciation: "GEN-ki des, a-ri-GA-to",
      },
    ],
    activities: [
      {
        id: "ja-l1-a1",
        type: "multiple_choice",
        question: "Which phrase means 'good morning' (formal) in Japanese?",
        answer: "おはようございます",
        options: [
          "こんにちは",
          "おはようございます",
          "こんばんは",
          "さようなら",
        ],
      },
      {
        id: "ja-l1-a2",
        type: "multiple_choice",
        question: "How do you say 'goodbye' (formal) in Japanese?",
        answer: "さようなら",
        options: ["またね", "こんにちは", "さようなら", "ありがとう"],
      },
    ],
    aiTeacherPrompt: `You are a friendly Japanese teacher named Yuki.
Your student is a complete beginner with no Japanese experience.
Teach: こんにちは, おはようございます, こんばんは, さようなら, またね, お元気ですか.
Use the romanized pronunciation after each Japanese word so the student can follow.
Explain when each time-based greeting is used.
Speak gently and patiently. Celebrate every correct attempt.
End with a simple greeting roleplay.`,
  },

  // ─── Portuguese ─────────────────────────────────────────────────────────────
  {
    id: "pt-lesson-1",
    unitId: "pt-unit-1",
    title: "Hello & Goodbye",
    description: "Learn the most common Portuguese greetings.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      "Say hello and goodbye in Portuguese",
      "Use common Brazilian Portuguese greetings",
    ],
    vocabulary: [
      {
        word: "olá",
        translation: "hello",
        pronunciation: "oh-LAH",
        exampleSentence: "Olá! Tudo bem?",
        exampleTranslation: "Hello! All good?",
      },
      {
        word: "oi",
        translation: "hi (informal)",
        pronunciation: "OY",
      },
      {
        word: "tchau",
        translation: "bye",
        pronunciation: "CHOW",
      },
      {
        word: "bom dia",
        translation: "good morning",
        pronunciation: "bohn JEE-ah",
      },
      {
        word: "boa noite",
        translation: "good night",
        pronunciation: "BOH-ah NOY-chee",
      },
    ],
    phrases: [
      {
        phrase: "Tudo bem?",
        translation: "All good? / How are you?",
        pronunciation: "TOO-doo beng",
        context: "Very common informal Brazilian greeting.",
      },
      {
        phrase: "Tudo bem, obrigado/obrigada.",
        translation: "All good, thank you.",
        pronunciation: "TOO-doo beng, oh-bree-GAH-doo / oh-bree-GAH-dah",
        context: "Men say obrigado, women say obrigada.",
      },
    ],
    activities: [
      {
        id: "pt-l1-a1",
        type: "multiple_choice",
        question: "How do you say 'hello' (informal) in Brazilian Portuguese?",
        answer: "oi",
        options: ["olá", "oi", "tchau", "obrigado"],
      },
      {
        id: "pt-l1-a2",
        type: "fill_in_blank",
        question: "Complete: 'Tudo ___?' (All good?)",
        answer: "bem",
        hint: "Means 'good' or 'well'.",
      },
    ],
    aiTeacherPrompt: `You are an upbeat Portuguese teacher named Lucas from Brazil.
Your student is a complete beginner learning Brazilian Portuguese greetings.
Teach: olá, oi, tchau, bom dia, boa noite, Tudo bem?, obrigado/obrigada.
Use Brazilian pronunciation throughout. Keep the energy lively and fun.
Explain the difference between olá (neutral) and oi (casual).
Note that obrigado vs obrigada depends on the speaker's gender.
End with a fun greeting roleplay.`,
  },
];

export const getLessonById = (id: string) =>
  LESSONS.find((l) => l.id === id);

export const getLessonsForUnit = (unitId: string) =>
  LESSONS.filter((l) => l.unitId === unitId);
