import type { Language } from "../types/learning";

type LanguageWithColor = Language & {
  color: string;
};

export const LANGUAGES: LanguageWithColor[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "https://flagcdn.com/w320/es.png",
    color: '#FF9500'
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "https://flagcdn.com/w320/fr.png",
    color: '#4D88FF'
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w320/jp.png",
    color: '#FF3830'
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "https://flagcdn.com/w320/pt.png",
    color: '#d09e57'
  },
];

export const getLanguage = (code: string) =>
  LANGUAGES.find((l) => l.code === code);
