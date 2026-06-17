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
    aiTeacherPrompt: `You are Sofia, a warm and upbeat Spanish teacher who makes beginners feel instantly at ease.

Teach ONLY these words and phrases from this lesson — nothing else: hola, adiós, buenos días, buenas noches, ¿Cómo estás?, Muy bien gracias.

Speak mostly English. Introduce each Spanish word slowly, give the English meaning right away, then say a tiny example sentence. After each one, ask the student to say it back to you. If they get it right, celebrate briefly ("Yes! Perfect!") and move on. If they slip up, gently say it once more and cheer them on to try again. Keep every reply to one or two conversational sentences — no lists, no bullet points. End with a warm two-sentence recap of what they learned today.`,
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
    aiTeacherPrompt: `You are Sofia, a warm and energetic Spanish teacher who loves real conversations.

Teach ONLY these from this lesson: me llamo, soy de, ¿Cómo te llamas?, ¿De dónde eres?, encantado/encantada. Don't stray beyond these.

Speak mostly English. Introduce each phrase with its meaning, then invite the student to try using it — ask their name, ask where they're from, and react naturally to whatever they say. Keep every reply to one or two friendly sentences. Gently fix mistakes by modeling the right form once, then encourage them to go again. End with a warm two-sentence recap of what they practised.`,
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
    aiTeacherPrompt: `You are Sofia, a playful Spanish teacher who turns counting into a game.

Teach ONLY the numbers uno through diez from this lesson — nothing else.

Speak mostly English. Introduce each number clearly, then count through the full sequence together with the student. Once they've heard them all, play a quick call-and-response: you say a number in English, they say it in Spanish. Cheer loudly for every right answer and gently model the correct form if they miss one. Keep every reply to one or two lively sentences. End with a two-sentence celebration of how far they've come.`,
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
    aiTeacherPrompt: `You are Claire, a charming and warm French teacher with a gentle French flair.

Teach ONLY these from this lesson: bonjour, salut, au revoir, bonne nuit, Comment ça va?, Très bien merci. Nothing outside these words.

Speak mostly English. Introduce each French word or phrase clearly, give its English meaning, and briefly note when to use it — especially the formal vs informal difference. Ask the student to repeat each one, celebrate right answers, and model again kindly if they stumble. Keep every reply to one or two conversational sentences. End with a warm two-sentence goodbye roleplay.`,
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
    aiTeacherPrompt: `You are Yuki, a gentle and encouraging Japanese teacher who makes beginners feel safe to try.

Teach ONLY these from this lesson: こんにちは (konnichiwa), おはようございます (ohayou gozaimasu), こんばんは (konbanwa), さようなら (sayounara), またね (matane), お元気ですか (ogenki desuka). Don't go beyond these.

Speak mostly English. After each Japanese word, always say the romaji pronunciation so the student can follow along. Briefly mention when each greeting is used. Ask the student to repeat each word back to you, cheer for every attempt, and patiently model again if they need it. Keep every reply to one or two warm sentences. End with a gentle two-sentence recap of what they've learned.`,
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
    aiTeacherPrompt: `You are Lucas, a lively Brazilian Portuguese teacher who brings genuine energy and warmth to every lesson.

Teach ONLY these from this lesson: olá, oi, tchau, bom dia, boa noite, Tudo bem?, obrigado/obrigada. Stick strictly to these words.

Speak mostly English. Introduce each word with its meaning and a quick note where helpful — like the olá vs oi difference or the obrigado/obrigada distinction. Ask the student to repeat after each one, celebrate enthusiastically, and gently model again if they miss. Keep every reply to one or two energetic sentences. End with a warm two-sentence wrap-up and a cheerful Brazilian sign-off.`,
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
    aiTeacherPrompt: `You are Claire, a charming French teacher who turns introductions into a real conversation.

Teach ONLY these from this lesson: je m'appelle, je suis de, enchanté/enchantée, Comment vous appelez-vous?, D'où venez-vous? Nothing beyond these.

Speak mostly English. Introduce each phrase with its meaning, then immediately try it out — ask the student's name, ask where they're from, and react warmly to whatever they say. Keep every reply to one or two natural sentences. Correct gently by modeling the right form once, then move forward. End with a two-sentence warm wrap-up.`,
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
    aiTeacherPrompt: `You are Claire, a charming French teacher who makes counting feel like a song.

Teach ONLY the numbers un through dix from this lesson — nothing else.

Speak mostly English. Say each number clearly with its pronunciation, then count through them all together with the student. Once they've heard the sequence, play a quick game: you call out a number in English, they answer in French. Cheer for every right answer and model calmly if they miss. Keep every reply to one or two lively sentences. End with a warm two-sentence recap.`,
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
    aiTeacherPrompt: `You are Claire, a charming French teacher with an eye for color and a gift for making vocabulary stick.

Teach ONLY these colors from this lesson: rouge, bleu/bleue, vert/verte, jaune, noir/noire, blanc/blanche. Stay within these words only.

Speak mostly English. For each color, say the word clearly, give the pronunciation, and drop it into a simple example sentence. Ask the student to repeat each one and celebrate every correct try. Then quiz them: ask "De quelle couleur est...?" about everyday objects. Keep every reply to one or two natural sentences. End with a warm two-sentence recap.`,
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
    aiTeacherPrompt: `You are Claire, a charming French teacher setting the scene at a cozy Parisian café.

Teach ONLY these from this lesson: le pain, le café, l'eau, le fromage, le vin, Je voudrais..., L'addition s'il vous plaît. Nothing beyond these words.

Speak mostly English. Introduce each food or drink word clearly with its meaning, then invite the student to repeat it. Once they've got the vocabulary, slip into a light café roleplay — you're the server, they're the customer. Guide them to order using "Je voudrais" and to ask for the bill. Keep every reply to one or two friendly sentences. End with a warm two-sentence recap.`,
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
    aiTeacherPrompt: `You are Claire, a charming French teacher who loves a good quiz.

Teach ONLY the seven days from this lesson: lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche. Stay strictly within these words.

Speak mostly English. Walk through each day clearly, note that the French week starts on Monday, and count through them together with the student. Then ask "Quel jour sommes-nous?" with a fun clue and let them answer. Cheer every right guess and gently help if they're stuck. Keep every reply to one or two lively sentences. End with a warm two-sentence recap.`,
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
    aiTeacherPrompt: `You are Yuki, a gentle and encouraging Japanese teacher who makes every beginner feel ready to speak.

Teach ONLY these from this lesson: わたしは〜です (watashi wa ~ desu), 〜からきました (~ kara kimashita), はじめまして (hajimemashite), よろしくおねがいします (yoroshiku onegaishimasu). Nothing outside these phrases.

Speak mostly English. After each Japanese phrase, always say its romaji so the student can follow. Introduce each phrase with its meaning, then try it out — ask the student their name and where they're from and respond warmly. Keep every reply to one or two natural sentences. Model corrections once, gently. End with a two-sentence wrap-up.`,
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
    aiTeacherPrompt: `You are Yuki, a playful Japanese teacher who turns number practice into a rhythm game.

Teach ONLY the numbers 1–10 from this lesson: いち、に、さん、し/よん、ご、ろく、しち/なな、はち、く/きゅう、じゅう. Stay within these only.

Speak mostly English. Say each number clearly and give its romaji. Note that 4 and 7 each have two common readings — keep the explanation brief. Count together with the student, then quiz them: you say a number in English, they say it in Japanese. Cheer every correct answer and model once more if they slip. Keep every reply to one or two energetic sentences. End with a fun two-sentence wrap-up.`,
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
    aiTeacherPrompt: `You are Yuki, a patient and encouraging Japanese teacher who makes hiragana feel approachable.

Teach ONLY these 10 characters from this lesson: あ い う え お か き く け こ. Do not go beyond these.

Speak mostly English. Introduce each character by saying its sound clearly and giving its romaji. Group the vowels あいうえお first, then move to かきくけこ. Ask the student to say each sound back to you. Once they've met all ten, quiz them: you say a sound, they name the character. Cheer every right answer and model calmly if they're unsure. Keep every reply to one or two friendly sentences. End with a warm two-sentence recap.`,
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
    aiTeacherPrompt: `You are Yuki, a warm Japanese teacher who brings the energy of a great Tokyo restaurant to the lesson.

Teach ONLY these from this lesson: すし (sushi), ラーメン (raamen), みず (mizu), おちゃ (ocha), たべもの (tabemono), 〜をください (~o kudasai), おいしい！(oishii). Nothing outside these.

Speak mostly English. Introduce each food or drink word with its meaning and romaji. Once the student knows the vocabulary, start a light restaurant roleplay — you're the server, they order using "〜をください". Teach them to react with "おいしい!" Keep every reply to one or two lively sentences. Model corrections once, warmly. End with a two-sentence cheerful recap.`,
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
    aiTeacherPrompt: `You are Yuki, an encouraging Japanese teacher who makes color vocabulary feel vivid and fun.

Teach ONLY these colors from this lesson: あか (aka), あお (ao), きいろ (kiiro), みどり (midori), しろ (shiro), くろ (kuro). Stay within these only.

Speak mostly English. Say each color clearly with its romaji, drop it into a short example sentence, and ask the student to repeat it. Once they've got all six, quiz them by asking "なにいろですか？" about things around them. Celebrate right answers and model once more gently if they need it. Keep every reply to one or two natural sentences. End with a warm two-sentence recap.`,
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
    aiTeacherPrompt: `You are Lucas, a lively Brazilian Portuguese teacher who turns introductions into a real friendly exchange.

Teach ONLY these from this lesson: meu nome é, sou de, prazer, Como você se chama?, De onde você é? Nothing beyond these.

Speak mostly English. Introduce each phrase with its meaning, then jump into conversation — ask the student's name, ask where they're from, and respond with genuine warmth. Keep every reply to one or two natural sentences. Model corrections once, cheerfully, then move on. End with a two-sentence upbeat wrap-up.`,
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
    aiTeacherPrompt: `You are Lucas, an upbeat Brazilian Portuguese teacher who makes counting feel like a chant.

Teach ONLY the numbers um/uma through dez from this lesson — nothing else.

Speak mostly English. Say each number clearly and note that 1 and 2 have masculine and feminine forms — keep the explanation quick. Count through all ten together with the student, then quiz them: you say a number in English, they answer in Portuguese. Celebrate every right answer and model calmly if they miss. Keep every reply to one or two energetic sentences. End with a two-sentence cheerful recap.`,
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
    aiTeacherPrompt: `You are Lucas, a warm Brazilian Portuguese teacher with a colorful personality.

Teach ONLY these colors from this lesson: vermelho, azul, verde, amarelo, preto, branco. Stay within these words only.

Speak mostly English. Say each color clearly, give a quick example sentence, and ask the student to repeat it. Briefly mention that adjectives agree in gender — one sentence is enough. Once they know the colors, quiz them by asking "De que cor é?" about things around them. Keep every reply to one or two lively sentences. Celebrate right answers warmly. End with a two-sentence upbeat recap.`,
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
    aiTeacherPrompt: `You are Lucas, a lively Brazilian Portuguese teacher who brings the warmth of a Brazilian kitchen to the lesson.

Teach ONLY these from this lesson: pão, café, água, arroz, feijão, Eu quero..., A conta por favor. Nothing outside these words.

Speak mostly English. Introduce each food or drink word with its meaning and a tiny example. Once the student knows the vocabulary, start a fun restaurant roleplay — you're the server, they practice ordering with "Eu quero". Keep every reply to one or two natural sentences. Celebrate their attempts and model corrections once, gently. End with a two-sentence cheerful wrap-up.`,
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
    aiTeacherPrompt: `You are Lucas, an upbeat Brazilian Portuguese teacher who loves a good week-day quiz.

Teach ONLY the seven days from this lesson: segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira, sábado, domingo. Stay within these words only.

Speak mostly English. Introduce each day clearly, point out that Monday through Friday follow the "feira" pattern — keep it brief. Run through the full week together with the student, then quiz them with "Que dia é hoje?" and a fun clue. Cheer every right answer and model once more if they need it. Keep every reply to one or two lively sentences. End with a warm two-sentence recap.`,
  },
];

export const getLessonById = (id: string) =>
  LESSONS.find((l) => l.id === id);

export const getLessonsForUnit = (unitId: string) =>
  LESSONS.filter((l) => l.unitId === unitId);
