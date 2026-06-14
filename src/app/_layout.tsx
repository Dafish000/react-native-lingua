import "../global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../config/posthog";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function AppStack() {
  const { isLoaded: clerkLoaded } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  const ready = (fontsLoaded || !!fontError) && clerkLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, { previous_screen: previousPathname.current ?? null, ...params });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!ready) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={Platform.OS !== "web" ? tokenCache : undefined}
    >
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ["testID"],
          maxElementsCaptured: 20,
        }}
      >
        <AppStack />
      </PostHogProvider>
    </ClerkProvider>
  );
}
