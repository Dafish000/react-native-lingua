import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { useLanguageStore } from "../store/languageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);
  const hasHydrated = useLanguageStore((s) => s.hasHydrated);

  if (!isLoaded || !hasHydrated) return null;
  if (isSignedIn) {
    if (!selectedLanguage) return <Redirect href="/language-select" />;
    return <Redirect href="/home" />;
  }
  return <Redirect href="/onboarding" />;
}
