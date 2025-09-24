import { Colors } from "@/constants/Colors";
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, Pressable, Text, View, useColorScheme } from "react-native";
import { radius, spacing } from "../constants/theme";

export default function UpdateRow({
  title,
  cover,
  latestChapterTitle,
  timeAgo,
  onPress,
}: {
  title: string;
  cover: string;
  latestChapterTitle?: string;
  timeAgo?: string;
  onPress?: () => void;
}) {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const scheme = ctxTheme ?? fallback ?? "light";

  // Chọn màu theo theme
  const themeColors = Colors[scheme] ?? Colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      }}
    >
      <Image
        source={{ uri: cover }}
        style={{ width: 72, height: 94, borderRadius: radius.sm }}
      />
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={{ color: themeColors.text, fontSize: 14, fontWeight: "700" }}
        >
          {title}
        </Text>
        {latestChapterTitle ? (
          <Text
            numberOfLines={1}
            style={{ color: themeColors.subtle, fontSize: 12, marginTop: 4 }}
          >
            {latestChapterTitle}
          </Text>
        ) : null}
        {timeAgo ? (
          <Text
            style={{ color: themeColors.subtle, fontSize: 12, marginTop: 2 }}
          >
            {timeAgo}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
