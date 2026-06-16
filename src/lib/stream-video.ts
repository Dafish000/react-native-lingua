// Safe re-exports of @stream-io/video-react-native-sdk.
//
// The SDK contains native WebRTC code compiled into a dev-client build.
// Running in Expo Go (plain `npx expo start`) causes an immediate crash:
//   "new NativeEventEmitter() requires a non-null argument"
// because @stream-io/react-native-webrtc registers a native module that
// doesn't exist in the JS-only Expo Go bundle.
//
// This file wraps the require() in a try-catch so the rest of the app
// loads normally in offline/practice mode.
// To enable live audio calls, run:
//   npx expo prebuild --clean && npx expo run:ios   (or run:android)

import type * as SDKTypes from "@stream-io/video-react-native-sdk";

let _sdk: typeof SDKTypes | undefined;

try {
  _sdk = require("@stream-io/video-react-native-sdk") as typeof SDKTypes;
} catch {
  if (__DEV__) {
    console.warn(
      "[StreamVideo] Native WebRTC modules not available.\n" +
        "Run: npx expo prebuild --clean && npx expo run:ios (or :android)\n" +
        "Audio lessons will show in Practice Mode until then."
    );
  }
}

/** True when native WebRTC modules are compiled in and calls are supported. */
export const streamVideoAvailable = !!_sdk;

// ── Providers ─────────────────────────────────────────────────────────────────

export const StreamVideo = _sdk?.StreamVideo as typeof SDKTypes.StreamVideo;
export const StreamVideoClient = _sdk?.StreamVideoClient as typeof SDKTypes.StreamVideoClient;
export const StreamCall = _sdk?.StreamCall as typeof SDKTypes.StreamCall;

// ── UI components ─────────────────────────────────────────────────────────────

export const VideoRenderer = _sdk?.VideoRenderer as typeof SDKTypes.VideoRenderer;

// ── Enums ─────────────────────────────────────────────────────────────────────

export const CallingState = (_sdk?.CallingState ?? {
  UNKNOWN: "unknown" as SDKTypes.CallingState,
  IDLE: "idle" as SDKTypes.CallingState,
  RINGING: "ringing" as SDKTypes.CallingState,
  JOINING: "joining" as SDKTypes.CallingState,
  JOINED: "joined" as SDKTypes.CallingState,
  LEFT: "left" as SDKTypes.CallingState,
  RECONNECTING: "reconnecting" as SDKTypes.CallingState,
  RECONNECTING_FAILED: "reconnecting_failed" as SDKTypes.CallingState,
  OFFLINE: "offline" as SDKTypes.CallingState,
  MIGRATING: "migrating" as SDKTypes.CallingState,
}) as typeof SDKTypes.CallingState;

// ── Hooks — no-op fallbacks are never called in practice (the hooks only run ──
// inside <StreamCall>, which is only rendered when the SDK loaded and a real  ──
// call exists), but they prevent TS errors when the SDK is absent.            ──

export const useStreamVideoClient: typeof SDKTypes.useStreamVideoClient =
  _sdk?.useStreamVideoClient ?? (() => undefined as ReturnType<typeof SDKTypes.useStreamVideoClient>);

export const useCall: typeof SDKTypes.useCall =
  _sdk?.useCall ?? (() => undefined as ReturnType<typeof SDKTypes.useCall>);

export const useCallStateHooks: typeof SDKTypes.useCallStateHooks =
  _sdk?.useCallStateHooks ?? (() => ({}) as ReturnType<typeof SDKTypes.useCallStateHooks>);
