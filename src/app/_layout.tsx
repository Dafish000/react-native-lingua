import "../global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../config/posthog";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StreamVideo,
  StreamVideoClient,
} from "../lib/stream-video";
import type {
  Theme,
  DeepPartial,
  User,
  StreamVideoClient as StreamVideoClientType,
} from "@stream-io/video-react-native-sdk";
import Constants from "expo-constants";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

function getApiUrl(): string {
  // In development, Expo serves API routes from the Metro bundler.
  // On a physical device, replace localhost with your machine's LAN IP,
  // or set EXPO_PUBLIC_API_URL in .env to your EAS Hosting URL in production.
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const host = hostUri.split(":")[0];
      return `http://${host}:8081`;
    }
  }
  return "http://localhost:8081";
}

// Bridges device safe-area insets into the StreamVideo theme so call screens
// respect notches and system bars on both iOS and Android.
// Falls back to rendering children as-is when native WebRTC modules aren't
// compiled (Expo Go) — lessons run in offline/Practice Mode until then.
function StreamVideoWrapper({ children }: { children: React.ReactNode }) {
  // Local refs so TypeScript can narrow these after the guard check below.
  // StreamVideo / StreamVideoClient are module-level constants that never
  // change; they are undefined only when the native build hasn't been done.
  const VideoProvider = StreamVideo;
  const VideoClient = StreamVideoClient;

  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [client, setClient] = useState<StreamVideoClientType | undefined>();

  useEffect(() => {
    if (!isSignedIn || !userId || !user || !VideoClient) return;

    const streamUser: User = {
      id: userId,
      name:
        user.fullName ??
        user.primaryEmailAddress?.emailAddress ??
        userId,
      image: user.imageUrl ?? undefined,
    };

    const tokenProvider = async (): Promise<string> => {
      const res = await fetch(`${getApiUrl()}/api/stream-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName: streamUser.name }),
      });
      if (!res.ok) throw new Error(`Stream token fetch failed: ${res.status}`);
      const data = (await res.json()) as { token: string };
      return data.token;
    };

    const c = VideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user: streamUser,
      tokenProvider,
    });

    // Defer setState to avoid synchronous state update inside the effect body.
    void Promise.resolve().then(() => setClient(c));

    return () => {
      c.disconnectUser().catch(console.error);
      setClient(undefined);
    };
  },
  // `user` is intentionally excluded — `userId` is the stable identifier.
  // `VideoClient` is a module-level constant, never changes at runtime.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isSignedIn, userId]);

  // No provider: SDK missing (Expo Go) or client not yet initialised.
  if (!VideoProvider || !client) return <>{children}</>;

  const theme = {
    variants: {
      insets: {
        top: insets.top,
        right: insets.right,
        bottom: insets.bottom,
        left: insets.left,
      },
    },
  } as DeepPartial<Theme>;

  return (
    <VideoProvider client={client} style={theme}>
      {children}
    </VideoProvider>
  );
}

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

  return (
    <StreamVideoWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </StreamVideoWrapper>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
