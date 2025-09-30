import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, ViewStyle } from "react-native";

type HapticTabProps = {
  children: React.ReactNode;
  onPress?: (...args: any[]) => void;
  style?: ViewStyle | ViewStyle[];
  [key: string]: any;
};

/**
 * Wrap tab bar button to provide light haptic feedback on press.
 * Compatible with expo and bare RN (uses Haptics where available).
 */
export default function HapticTab({
  children,
  onPress,
  style,
  ...rest
}: HapticTabProps) {
  const handlePress = (...args: any[]) => {
    try {
      // prefer light impact for small UI interactions
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    } catch {
      // ignore if Haptics unavailable
    }

    if (typeof onPress === "function") onPress(...args);
  };

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{ color: "rgba(0,0,0,0.08)" }}
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.85,
  },
});
