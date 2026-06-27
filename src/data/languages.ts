import type { PlanTier } from "../lib/subscription";
import type { Language } from "../types/learning";

type LanguageWithColor = Language & {
  color: string;
  tier: PlanTier;
};

export const LANGUAGES: LanguageWithColor[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "https://flagcdn.com/w320/es.png",
    color: '#FF9500',
    tier: 'free',
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "https://flagcdn.com/w320/fr.png",
    color: '#4D88FF',
    tier: 'silver',
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "https://flagcdn.com/w320/pt.png",
    color: '#d09e57',
    tier: 'silver',
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w320/jp.png",
    color: '#FF3830',
    tier: 'gold',
  },
];

export const getLanguage = (code: string) =>
  LANGUAGES.find((l) => l.code === code);
