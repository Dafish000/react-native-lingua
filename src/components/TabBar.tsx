import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Pressable, Text, View } from "../tw";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICONS: Record<
  string,
  { active: IoniconName; inactive: IoniconName }
> = {
  home: { active: "home", inactive: "home-outline" },
  learn: { active: "book", inactive: "book-outline" },
  "ai-teacher": { active: "school", inactive: "school-outline" },
  chat: {
    active: "chatbubble-ellipses",
    inactive: "chatbubble-ellipses-outline",
  },
  profile: { active: "person", inactive: "person-outline" },
};

const BAR_HEIGHT = 64;
const CIRCLE_SIZE = 48;
const FADE_OUT_MS = 100;
const FADE_IN_MS = 100;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const circleX = useSharedValue(0);
  const circleVisibility = useSharedValue(1);
  const hasMeasured = useRef(false);

  const tabWidth = barWidth / state.routes.length;

  useEffect(() => {
    if (tabWidth === 0) return;
    const x = state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2;
    if (!hasMeasured.current) {
      // First layout: place the circle without animating
      hasMeasured.current = true;
      circleX.value = x;
      return;
    }
    // Fade out at the old tab, jump to the new tab, fade back in
    circleX.value = withDelay(FADE_OUT_MS, withTiming(x, { duration: 0 }));
    circleVisibility.value = withSequence(
      withTiming(0, { duration: FADE_OUT_MS }),
      withTiming(1, { duration: FADE_IN_MS })
    );
  }, [state.index, tabWidth, circleX, circleVisibility]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleVisibility.value,
    transform: [
      { translateX: circleX.value },
      // Slight pop as it reappears
      { scale: 0.7 + 0.3 * circleVisibility.value },
    ],
  }));

  return (
    <View
      className="tab-bar"
      style={[styles.bar, { paddingBottom: insets.bottom }]}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      <View className="flex-row" style={{ height: BAR_HEIGHT }}>
        {barWidth > 0 && <Animated.View style={[styles.circle, circleStyle]} />}

        {state.routes.map((route, index) => {
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
              className="tab-bar__item"
            >
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={24}
                color={focused ? "#FFFFFF" : colors.textSecondary}
              />
              {!focused && <Text className="tab-bar__label">{label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: Platform.select({
    ios: {
      shadowColor: "#001328",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: { elevation: 12 },
    default: {},
  }),
  circle: {
    position: "absolute",
    top: (BAR_HEIGHT - CIRCLE_SIZE) / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.primary,
  },
});
