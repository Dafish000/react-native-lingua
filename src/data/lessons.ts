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

  // ─── French (extended) ──────────────────────────────────────────────────────
  {
    id: "fr-lesson-2",
    unitId: "fr-unit-1",
    title: "Introducing Yourself",
    description: "Learn to share your name and where you're from in French.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Introduce yourself in French", "Ask and answer about name and origin"],
    vocabulary: [
      { word: "je m'appelle", translation: "my name is", pronunciation: "zhuh mah-PELL", exampleSentence: "Je m'appelle Marie.", exampleTranslation: "My name is Marie." },
      { word: "je suis de", translation: "I am from", pronunciation: "zhuh swee duh", exampleSentence: "Je suis de Paris.", exampleTranslation: "I am from Paris." },
      { word: "enchanté / enchantée", translation: "nice to meet you", pronunciation: "ahn-shahn-TAY" },
    ],
    phrases: [
      { phrase: "Comment vous appelez-vous?", translation: "What is your name? (formal)", pronunciation: "koh-MAHN voo zah-play-VOO" },
      { phrase: "D'où venez-vous?", translation: "Where are you from? (formal)", pronunciation: "doo vuh-NAY-voo" },
    ],
    activities: [
      { id: "fr-l2-a1", type: "multiple_choice", question: "How do you say 'My name is Paul'?", answer: "Je m'appelle Paul.", options: ["Je m'appelle Paul.", "Mon nom Paul.", "Paul je suis.", "Appelle moi Paul suis."] },
      { id: "fr-l2-a2", type: "fill_in_blank", question: "Complete: 'Je suis ___ Lyon.'", answer: "de", hint: "A preposition meaning 'from'." },
    ],
    aiTeacherPrompt: `You are a charming French teacher named Claire. Your student is learning to introduce themselves in French. Teach: je m'appelle, je suis de, enchanté/enchantée, Comment vous appelez-vous?, D'où venez-vous? Ask the student their name and where they're from. Respond naturally and correct gently.`,
  },
  {
    id: "fr-lesson-3",
    unitId: "fr-unit-2",
    title: "Numbers 1–10",
    description: "Count from one to ten in French.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Count from 1 to 10 in French"],
    vocabulary: [
      { word: "un", translation: "one", pronunciation: "uhn" },
      { word: "deux", translation: "two", pronunciation: "duh" },
      { word: "trois", translation: "three", pronunciation: "twah" },
      { word: "quatre", translation: "four", pronunciation: "KAH-truh" },
      { word: "cinq", translation: "five", pronunciation: "sank" },
      { word: "six", translation: "six", pronunciation: "sees" },
      { word: "sept", translation: "seven", pronunciation: "set" },
      { word: "huit", translation: "eight", pronunciation: "weet" },
      { word: "neuf", translation: "nine", pronunciation: "nuhf" },
      { word: "dix", translation: "ten", pronunciation: "dees" },
    ],
    phrases: [],
    activities: [
      { id: "fr-l3-a1", type: "multiple_choice", question: "What is 'cinq' in English?", answer: "five", options: ["four", "five", "six", "seven"] },
      { id: "fr-l3-a2", type: "multiple_choice", question: "How do you say 'eight' in French?", answer: "huit", options: ["sept", "neuf", "huit", "dix"] },
    ],
    aiTeacherPrompt: `You are a charming French teacher named Claire. Teach the numbers 1–10 in French with a fun rhythm. Say each number with its pronunciation. Count the full sequence together. Play a game: say a number in English and ask the student to respond in French.`,
  },
  {
    id: "fr-lesson-4",
    unitId: "fr-unit-2",
    title: "Colors",
    description: "Learn the most common colors in French.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name common colors in French"],
    vocabulary: [
      { word: "rouge", translation: "red", pronunciation: "roozh" },
      { word: "bleu / bleue", translation: "blue", pronunciation: "bluh" },
      { word: "vert / verte", translation: "green", pronunciation: "vehr" },
      { word: "jaune", translation: "yellow", pronunciation: "zhohn" },
      { word: "noir / noire", translation: "black", pronunciation: "nwahr" },
      { word: "blanc / blanche", translation: "white", pronunciation: "blahn" },
    ],
    phrases: [
      { phrase: "De quelle couleur est...?", translation: "What color is...?", pronunciation: "duh kel koo-LEUR ay" },
    ],
    activities: [
      { id: "fr-l4-a1", type: "multiple_choice", question: "What is 'bleu' in English?", answer: "blue", options: ["red", "blue", "green", "yellow"] },
      { id: "fr-l4-a2", type: "fill_in_blank", question: "The French word for 'red' is ___.", answer: "rouge", hint: "Rhymes with 'lounge'." },
    ],
    aiTeacherPrompt: `You are a charming French teacher named Claire. Teach the common colors in French. For each color, say the word, give the pronunciation, and use it in a simple sentence. Quiz the student by pointing to things and asking 'De quelle couleur est...?'`,
  },
  {
    id: "fr-lesson-5",
    unitId: "fr-unit-3",
    title: "Food & Drinks",
    description: "Order food and drinks in French.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name common foods and drinks in French", "Order at a café"],
    vocabulary: [
      { word: "le pain", translation: "bread", pronunciation: "luh pan" },
      { word: "le café", translation: "coffee", pronunciation: "luh kah-FAY" },
      { word: "l'eau", translation: "water", pronunciation: "loh" },
      { word: "le fromage", translation: "cheese", pronunciation: "luh froh-MAHZH" },
      { word: "le vin", translation: "wine", pronunciation: "luh van" },
    ],
    phrases: [
      { phrase: "Je voudrais...", translation: "I would like...", pronunciation: "zhuh voo-DRAY", context: "Polite way to order." },
      { phrase: "L'addition, s'il vous plaît.", translation: "The bill, please.", pronunciation: "lah-dee-SYOHN seel voo play" },
    ],
    activities: [
      { id: "fr-l5-a1", type: "multiple_choice", question: "How do you say 'I would like a coffee'?", answer: "Je voudrais un café.", options: ["Je voudrais un café.", "Un café s'il vous plaît voudrais.", "Je café voudrais.", "Voudrais je café."] },
      { id: "fr-l5-a2", type: "fill_in_blank", question: "'___ eau, s'il vous plaît.' (Water, please.)", answer: "L'", hint: "The French article for 'water'." },
    ],
    aiTeacherPrompt: `You are a charming French teacher named Claire. Teach food and drink vocabulary in French. Roleplay a café scene: you are the waiter and the student is the customer. Teach them to order using 'Je voudrais' and to ask for the bill.`,
  },
  {
    id: "fr-lesson-6",
    unitId: "fr-unit-3",
    title: "Days of the Week",
    description: "Learn the seven days of the week in French.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name all seven days of the week in French"],
    vocabulary: [
      { word: "lundi", translation: "Monday", pronunciation: "luhn-DEE" },
      { word: "mardi", translation: "Tuesday", pronunciation: "mar-DEE" },
      { word: "mercredi", translation: "Wednesday", pronunciation: "mehr-kruh-DEE" },
      { word: "jeudi", translation: "Thursday", pronunciation: "zhuh-DEE" },
      { word: "vendredi", translation: "Friday", pronunciation: "vahn-druh-DEE" },
      { word: "samedi", translation: "Saturday", pronunciation: "sahm-DEE" },
      { word: "dimanche", translation: "Sunday", pronunciation: "dee-MAHNSH" },
    ],
    phrases: [
      { phrase: "Aujourd'hui c'est...", translation: "Today is...", pronunciation: "oh-zhoor-DWEE say" },
      { phrase: "Quel jour sommes-nous?", translation: "What day is it?", pronunciation: "kel zhoor sohm-NOO" },
    ],
    activities: [
      { id: "fr-l6-a1", type: "multiple_choice", question: "What is 'vendredi' in English?", answer: "Friday", options: ["Thursday", "Friday", "Saturday", "Sunday"] },
      { id: "fr-l6-a2", type: "fill_in_blank", question: "The day before 'dimanche' is ___.", answer: "samedi", hint: "Saturday in French." },
    ],
    aiTeacherPrompt: `You are a charming French teacher named Claire. Teach the seven days of the week in French. Note that the French week starts on Monday. Quiz the student by asking 'Quel jour sommes-nous?' and giving clues.`,
  },

  // ─── Japanese (extended) ────────────────────────────────────────────────────
  {
    id: "ja-lesson-2",
    unitId: "ja-unit-1",
    title: "Introducing Yourself",
    description: "Learn to share your name and nationality in Japanese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Introduce yourself in Japanese", "Ask someone's name politely"],
    vocabulary: [
      { word: "わたしは〜です", translation: "I am ~", pronunciation: "wa-ta-shi wa ~ des", exampleSentence: "わたしはケンです。", exampleTranslation: "I am Ken." },
      { word: "〜からきました", translation: "I am from ~", pronunciation: "~ ka-ra ki-ma-shi-ta" },
      { word: "よろしくおねがいします", translation: "Nice to meet you (formal)", pronunciation: "yo-ro-shi-ku o-ne-ga-i shi-mas" },
    ],
    phrases: [
      { phrase: "おなまえは？", translation: "What is your name?", pronunciation: "o-na-ma-e wa" },
      { phrase: "はじめまして。", translation: "Nice to meet you (first meeting).", pronunciation: "ha-ji-me-ma-shi-te" },
    ],
    activities: [
      { id: "ja-l2-a1", type: "multiple_choice", question: "How do you say 'I am Yuki'?", answer: "わたしはゆきです。", options: ["わたしはゆきです。", "ゆきはわたしです。", "です。わたし。ゆき。", "ゆきからきました。"] },
      { id: "ja-l2-a2", type: "fill_in_blank", question: "Complete: 'アメリカ ___ きました。' (I came from America.)", answer: "から", hint: "The particle meaning 'from'." },
    ],
    aiTeacherPrompt: `You are a friendly Japanese teacher named Yuki. Teach the student to introduce themselves in Japanese. Cover: わたしは〜です, 〜からきました, はじめまして, よろしくおねがいします. Use romaji after each Japanese phrase. Ask the student's name and where they're from.`,
  },
  {
    id: "ja-lesson-3",
    unitId: "ja-unit-2",
    title: "Numbers 1–10",
    description: "Count from one to ten in Japanese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Count from 1 to 10 in Japanese"],
    vocabulary: [
      { word: "いち", translation: "one", pronunciation: "i-chi" },
      { word: "に", translation: "two", pronunciation: "ni" },
      { word: "さん", translation: "three", pronunciation: "san" },
      { word: "し / よん", translation: "four", pronunciation: "shi / yon" },
      { word: "ご", translation: "five", pronunciation: "go" },
      { word: "ろく", translation: "six", pronunciation: "ro-ku" },
      { word: "しち / なな", translation: "seven", pronunciation: "shi-chi / na-na" },
      { word: "はち", translation: "eight", pronunciation: "ha-chi" },
      { word: "く / きゅう", translation: "nine", pronunciation: "ku / kyu" },
      { word: "じゅう", translation: "ten", pronunciation: "ju" },
    ],
    phrases: [],
    activities: [
      { id: "ja-l3-a1", type: "multiple_choice", question: "What is 'ご' (go) in English?", answer: "five", options: ["four", "five", "six", "seven"] },
      { id: "ja-l3-a2", type: "multiple_choice", question: "How do you say 'eight' in Japanese?", answer: "はち", options: ["しち", "く", "はち", "じゅう"] },
    ],
    aiTeacherPrompt: `You are a friendly Japanese teacher named Yuki. Teach the numbers 1–10 in Japanese. Note that 4 and 7 have two readings each. Count together rhythmically, then play a number quiz game.`,
  },
  {
    id: "ja-lesson-4",
    unitId: "ja-unit-2",
    title: "Hiragana Basics",
    description: "Learn the first 10 hiragana characters.",
    xpReward: 15,
    estimatedMinutes: 8,
    goals: ["Read and write 10 basic hiragana characters"],
    vocabulary: [
      { word: "あ", translation: "a", pronunciation: "a" },
      { word: "い", translation: "i", pronunciation: "i" },
      { word: "う", translation: "u", pronunciation: "u" },
      { word: "え", translation: "e", pronunciation: "e" },
      { word: "お", translation: "o", pronunciation: "o" },
      { word: "か", translation: "ka", pronunciation: "ka" },
      { word: "き", translation: "ki", pronunciation: "ki" },
      { word: "く", translation: "ku", pronunciation: "ku" },
      { word: "け", translation: "ke", pronunciation: "ke" },
      { word: "こ", translation: "ko", pronunciation: "ko" },
    ],
    phrases: [
      { phrase: "あいうえお", translation: "a-i-u-e-o (vowel row)", pronunciation: "a i u e o", context: "The five fundamental Japanese vowels in hiragana." },
    ],
    activities: [
      { id: "ja-l4-a1", type: "multiple_choice", question: "Which hiragana represents 'ka'?", answer: "か", options: ["あ", "か", "さ", "た"] },
      { id: "ja-l4-a2", type: "fill_in_blank", question: "The hiragana for 'u' is ___.", answer: "う", hint: "Third vowel in the あいうえお sequence." },
    ],
    aiTeacherPrompt: `You are a friendly Japanese teacher named Yuki. Teach the first 10 hiragana characters: あいうえお and かきくけこ. Say each character with its sound clearly. Quiz the student by saying a sound and asking them to name the hiragana character.`,
  },
  {
    id: "ja-lesson-5",
    unitId: "ja-unit-3",
    title: "Food & Drinks",
    description: "Order food and express preferences in Japanese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name common Japanese foods", "Order at a restaurant"],
    vocabulary: [
      { word: "すし", translation: "sushi", pronunciation: "su-shi" },
      { word: "ラーメン", translation: "ramen", pronunciation: "ra-men" },
      { word: "みず", translation: "water", pronunciation: "mi-zu" },
      { word: "おちゃ", translation: "green tea", pronunciation: "o-cha" },
      { word: "たべもの", translation: "food", pronunciation: "ta-be-mo-no" },
    ],
    phrases: [
      { phrase: "〜をください。", translation: "Please give me ~.", pronunciation: "~ o ku-da-sai", context: "Polite way to order food." },
      { phrase: "おいしい！", translation: "Delicious!", pronunciation: "o-i-shi" },
    ],
    activities: [
      { id: "ja-l5-a1", type: "multiple_choice", question: "How do you order sushi politely?", answer: "すしをください。", options: ["すしをください。", "ください。すし。", "すしがおいしい。", "すしはたべもの。"] },
      { id: "ja-l5-a2", type: "fill_in_blank", question: "'___ をください。' means 'Please give me green tea.'", answer: "おちゃ", hint: "The Japanese word for green tea." },
    ],
    aiTeacherPrompt: `You are a friendly Japanese teacher named Yuki. Teach food vocabulary and ordering phrases. Roleplay: you are a restaurant server and the student orders. Teach them to use 〜をください and react to food with おいしい!`,
  },
  {
    id: "ja-lesson-6",
    unitId: "ja-unit-3",
    title: "Colors",
    description: "Learn common colors in Japanese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name common colors in Japanese"],
    vocabulary: [
      { word: "あか", translation: "red", pronunciation: "a-ka" },
      { word: "あお", translation: "blue", pronunciation: "a-o" },
      { word: "きいろ", translation: "yellow", pronunciation: "ki-i-ro" },
      { word: "みどり", translation: "green", pronunciation: "mi-do-ri" },
      { word: "しろ", translation: "white", pronunciation: "shi-ro" },
      { word: "くろ", translation: "black", pronunciation: "ku-ro" },
    ],
    phrases: [
      { phrase: "なにいろですか？", translation: "What color is it?", pronunciation: "na-ni-i-ro des-ka" },
    ],
    activities: [
      { id: "ja-l6-a1", type: "multiple_choice", question: "What is 'あか' in English?", answer: "red", options: ["blue", "red", "green", "yellow"] },
      { id: "ja-l6-a2", type: "fill_in_blank", question: "The Japanese word for 'black' is ___.", answer: "くろ", hint: "Starts with 'ku'." },
    ],
    aiTeacherPrompt: `You are a friendly Japanese teacher named Yuki. Teach the common colors in Japanese. After each color, use it in a sentence. Quiz the student by asking about colors of objects around them.`,
  },

  // ─── Portuguese (extended) ──────────────────────────────────────────────────
  {
    id: "pt-lesson-2",
    unitId: "pt-unit-1",
    title: "Introducing Yourself",
    description: "Learn to share your name and where you're from in Portuguese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Introduce yourself in Brazilian Portuguese"],
    vocabulary: [
      { word: "meu nome é", translation: "my name is", pronunciation: "mew NO-mi eh", exampleSentence: "Meu nome é Ana.", exampleTranslation: "My name is Ana." },
      { word: "sou de", translation: "I am from", pronunciation: "soh dji", exampleSentence: "Sou do Brasil.", exampleTranslation: "I am from Brazil." },
      { word: "prazer", translation: "nice to meet you", pronunciation: "pra-ZER" },
    ],
    phrases: [
      { phrase: "Como você se chama?", translation: "What is your name?", pronunciation: "KO-mo vo-SAY si SHA-ma" },
      { phrase: "De onde você é?", translation: "Where are you from?", pronunciation: "dji ON-dji vo-SAY eh" },
    ],
    activities: [
      { id: "pt-l2-a1", type: "multiple_choice", question: "How do you say 'My name is Carlos'?", answer: "Meu nome é Carlos.", options: ["Meu nome é Carlos.", "Sou Carlos nome.", "Carlos meu nome.", "Nome Carlos é meu."] },
      { id: "pt-l2-a2", type: "fill_in_blank", question: "Complete: 'Sou ___ São Paulo.' (I am from São Paulo.)", answer: "de", hint: "A preposition meaning 'from'." },
    ],
    aiTeacherPrompt: `You are an upbeat Portuguese teacher named Lucas from Brazil. Teach the student to introduce themselves. Cover: meu nome é, sou de, prazer, Como você se chama?, De onde você é? Have a natural introductions conversation with the student.`,
  },
  {
    id: "pt-lesson-3",
    unitId: "pt-unit-2",
    title: "Numbers 1–10",
    description: "Count from one to ten in Brazilian Portuguese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Count from 1 to 10 in Brazilian Portuguese"],
    vocabulary: [
      { word: "um / uma", translation: "one", pronunciation: "oom / OO-mah" },
      { word: "dois / duas", translation: "two", pronunciation: "doys / DOO-ahs" },
      { word: "três", translation: "three", pronunciation: "trays" },
      { word: "quatro", translation: "four", pronunciation: "KWA-tro" },
      { word: "cinco", translation: "five", pronunciation: "SEEN-ko" },
      { word: "seis", translation: "six", pronunciation: "says" },
      { word: "sete", translation: "seven", pronunciation: "SEH-chi" },
      { word: "oito", translation: "eight", pronunciation: "OY-to" },
      { word: "nove", translation: "nine", pronunciation: "NO-vi" },
      { word: "dez", translation: "ten", pronunciation: "dez" },
    ],
    phrases: [],
    activities: [
      { id: "pt-l3-a1", type: "multiple_choice", question: "What is 'cinco' in English?", answer: "five", options: ["four", "five", "six", "seven"] },
      { id: "pt-l3-a2", type: "multiple_choice", question: "How do you say 'eight' in Portuguese?", answer: "oito", options: ["sete", "nove", "oito", "dez"] },
    ],
    aiTeacherPrompt: `You are an upbeat Portuguese teacher named Lucas from Brazil. Teach the numbers 1–10. Note that 1 and 2 have masculine/feminine forms. Count together rhythmically, then quiz the student.`,
  },
  {
    id: "pt-lesson-4",
    unitId: "pt-unit-2",
    title: "Colors",
    description: "Learn the most common colors in Portuguese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name common colors in Brazilian Portuguese"],
    vocabulary: [
      { word: "vermelho", translation: "red", pronunciation: "vehr-MEH-lyo" },
      { word: "azul", translation: "blue", pronunciation: "ah-ZOOL" },
      { word: "verde", translation: "green", pronunciation: "VEHR-dji" },
      { word: "amarelo", translation: "yellow", pronunciation: "ah-mah-REH-lo" },
      { word: "preto", translation: "black", pronunciation: "PREH-to" },
      { word: "branco", translation: "white", pronunciation: "BRAN-ko" },
    ],
    phrases: [
      { phrase: "De que cor é?", translation: "What color is it?", pronunciation: "dji ki KOR eh" },
    ],
    activities: [
      { id: "pt-l4-a1", type: "multiple_choice", question: "What is 'azul' in English?", answer: "blue", options: ["red", "blue", "green", "yellow"] },
      { id: "pt-l4-a2", type: "fill_in_blank", question: "The Portuguese word for 'red' is ___.", answer: "vermelho", hint: "Starts with 'ver'." },
    ],
    aiTeacherPrompt: `You are an upbeat Portuguese teacher named Lucas from Brazil. Teach common colors in Portuguese. Note that adjectives agree in gender with the noun. Quiz the student about colors of objects in their surroundings.`,
  },
  {
    id: "pt-lesson-5",
    unitId: "pt-unit-3",
    title: "Food & Drinks",
    description: "Order food and drinks in Brazilian Portuguese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name common Brazilian foods and drinks", "Order at a restaurant"],
    vocabulary: [
      { word: "pão", translation: "bread", pronunciation: "pown" },
      { word: "café", translation: "coffee", pronunciation: "kah-FAY" },
      { word: "água", translation: "water", pronunciation: "AH-gwah" },
      { word: "arroz", translation: "rice", pronunciation: "ah-HOHS" },
      { word: "feijão", translation: "beans", pronunciation: "fay-ZHOWN" },
    ],
    phrases: [
      { phrase: "Eu quero...", translation: "I want...", pronunciation: "ew KE-ro", context: "Common way to order in Brazil." },
      { phrase: "A conta, por favor.", translation: "The bill, please.", pronunciation: "ah KON-tah, por fah-VOR" },
    ],
    activities: [
      { id: "pt-l5-a1", type: "multiple_choice", question: "How do you say 'I want coffee'?", answer: "Eu quero café.", options: ["Eu quero café.", "Café eu quero sim.", "Quero café por favor eu.", "Eu café quero sim."] },
      { id: "pt-l5-a2", type: "fill_in_blank", question: "'___ e feijão' is a classic Brazilian dish.", answer: "Arroz", hint: "Means 'rice' in Portuguese." },
    ],
    aiTeacherPrompt: `You are an upbeat Portuguese teacher named Lucas from Brazil. Teach food vocabulary focusing on Brazilian staples like arroz e feijão. Roleplay a Brazilian restaurant scene where the student learns to order using 'Eu quero'.`,
  },
  {
    id: "pt-lesson-6",
    unitId: "pt-unit-3",
    title: "Days of the Week",
    description: "Learn the seven days of the week in Portuguese.",
    xpReward: 10,
    estimatedMinutes: 5,
    goals: ["Name all seven days of the week in Brazilian Portuguese"],
    vocabulary: [
      { word: "segunda-feira", translation: "Monday", pronunciation: "seh-GOON-dah FAY-rah" },
      { word: "terça-feira", translation: "Tuesday", pronunciation: "TER-sah FAY-rah" },
      { word: "quarta-feira", translation: "Wednesday", pronunciation: "KWAR-tah FAY-rah" },
      { word: "quinta-feira", translation: "Thursday", pronunciation: "KEEN-tah FAY-rah" },
      { word: "sexta-feira", translation: "Friday", pronunciation: "SAYS-tah FAY-rah" },
      { word: "sábado", translation: "Saturday", pronunciation: "SAH-bah-do" },
      { word: "domingo", translation: "Sunday", pronunciation: "do-MEEN-go" },
    ],
    phrases: [
      { phrase: "Que dia é hoje?", translation: "What day is today?", pronunciation: "ki JEE-ah eh O-zhi" },
      { phrase: "Hoje é...", translation: "Today is...", pronunciation: "O-zhi eh" },
    ],
    activities: [
      { id: "pt-l6-a1", type: "multiple_choice", question: "What is 'sexta-feira' in English?", answer: "Friday", options: ["Thursday", "Friday", "Saturday", "Sunday"] },
      { id: "pt-l6-a2", type: "fill_in_blank", question: "The weekend days are sábado and ___.", answer: "domingo", hint: "Starts with 'do'." },
    ],
    aiTeacherPrompt: `You are an upbeat Portuguese teacher named Lucas from Brazil. Teach the seven days of the week in Portuguese. Note that Monday through Friday use the 'feira' suffix. Saturday and Sunday are different. Quiz the student about the days.`,
  },
];

export const getLessonById = (id: string) =>
  LESSONS.find((l) => l.id === id);

export const getLessonsForUnit = (unitId: string) =>
  LESSONS.filter((l) => l.unitId === unitId);
