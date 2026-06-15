import { Ionicons } from "@expo/vector-icons";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "../tw";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  home: { active: "home", inactive: "home-outline" },
  learn: { active: "book", inactive: "book-outline" },
  "ai-teacher": { active: "school", inactive: "school-outline" },
  chat: { active: "chatbubble-ellipses", inactive: "chatbubble-ellipses-outline" },
  profile: { active: "person", inactive: "person-outline" },
};

const BAR_HEIGHT = 68;
const BOTTOM_GAP = 12;
const HORIZONTAL_MARGIN = 24;
const INDICATOR_HEIGHT = BAR_HEIGHT - 10;
const INDICATOR_BORDER_RADIUS = INDICATOR_HEIGHT / 2; // stadium matches the pill's BAR_HEIGHT/2 curve
const FADE_OUT_MS = 100;
const FADE_IN_MS = 100;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const indicatorVisibility = useSharedValue(1);
  const hasMeasured = useRef(false);

  const useGlass =
    Platform.OS === "ios" &&
    isGlassEffectAPIAvailable() &&
    isLiquidGlassAvailable();

  const tabWidth = barWidth / state.routes.length;
  const indicatorWidth = tabWidth > 0 ? tabWidth - 8 : 0;

  useEffect(() => {
    if (tabWidth === 0) return;
    // Center indicator within its tab column (4px offset = half of the 8px gap)
    const x = state.index * tabWidth + 4;
    if (!hasMeasured.current) {
      hasMeasured.current = true;
      indicatorX.value = x;
      return;
    }
    indicatorX.value = withDelay(FADE_OUT_MS, withTiming(x, { duration: 0 }));
    indicatorVisibility.value = withSequence(
      withTiming(0, { duration: FADE_OUT_MS }),
      withTiming(1, { duration: FADE_IN_MS })
    );
  }, [state.index, tabWidth, indicatorX, indicatorVisibility]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorVisibility.value,
    transform: [
      { translateX: indicatorX.value },
      { scale: 0.88 + 0.12 * indicatorVisibility.value },
    ],
  }));

  const tabItems = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label = options.title ?? route.name;
    const focused = state.index === index;
    const icons = TAB_ICONS[route.name] ?? {
      active: "ellipse",
      inactive: "ellipse-outline",
    };

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
        onPress={onPress}
        style={styles.tabItem}
      >
        <Ionicons
          name={focused ? icons.active : icons.inactive}
          size={26}
          color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)"}
        />
      </Pressable>
    );
  });

  const pillContent = (
    <View
      style={styles.pillContent}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      {barWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { width: indicatorWidth },
            indicatorStyle,
          ]}
        />
      )}
      {tabItems}
    </View>
  );

  return (
    <View
      style={[
        styles.outerContainer,
        { paddingBottom: insets.bottom + BOTTOM_GAP },
      ]}
    >
      {useGlass ? (
        <GlassView
          glassEffectStyle="regular"
          colorScheme="dark"
          style={styles.pill}
        >
          {pillContent}
        </GlassView>
      ) : (
        <View style={[styles.pill, styles.pillFallback]}>{pillContent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: HORIZONTAL_MARGIN,
     backgroundColor: "#FFFFFF",
    paddingTop: 8,
  },
  pill: {
    borderRadius: BAR_HEIGHT / 2,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 20,
      },
    }),
  },
  pillFallback: {
    backgroundColor: "rgba(18, 22, 30, 0.90)",
    elevation: 16,
  },
  pillContent: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    top: (BAR_HEIGHT - INDICATOR_HEIGHT) / 2,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_BORDER_RADIUS,
    backgroundColor: "rgba(10, 14, 20, 0.70)",
  },
});
