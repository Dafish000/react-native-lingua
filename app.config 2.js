export default {
  expo: {
    name: "FleaMarket",
    slug: "FleaMarket",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "fleamarket",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/images/icon.png",
      bundleIdentifier: "com.anonymous.FleaMarket",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      package: "com.anonymous.FleaMarket",
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76,
          },
        },
      ],
      "@clerk/expo",
      "expo-secure-store",
      "@stream-io/video-react-native-sdk",
      [
        "@config-plugins/react-native-webrtc",
        {
          cameraPermission: "$(PRODUCT_NAME) requires camera access for video lessons",
          microphonePermission: "$(PRODUCT_NAME) requires microphone access for audio lessons",
        },
      ],
      ["expo-build-properties", { android: { minSdkVersion: 24 } }],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "b0961f8d-46ce-4f8c-8d97-7cadf3945e25",
      },
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
    },
  },
};
