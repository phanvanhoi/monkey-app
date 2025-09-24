import { Colors } from "@/constants/Colors";
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, Pressable, Text, View, useColorScheme } from "react-native";
import { radius, spacing } from "../constants/theme";

type FeaturedCardProps = {
  title: string;
  cover: string;
  author?: string;
  onPress?: () => void;
};

export default function FeaturedCard({
  title,
  cover,
  author,
  onPress,
}: FeaturedCardProps) {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const scheme = ctxTheme ?? fallback ?? "light";

  // Chọn màu theo theme
  const themeColors = Colors[scheme] ?? Colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={{ width: 320, marginRight: spacing.md }}
    >
      <View
        style={{
          borderRadius: radius.lg,
          overflow: "hidden",
          backgroundColor: themeColors.surface,
        }}
      >
        <Image
          source={{ uri: cover }}
          style={{ width: "100%", height: 180 }}
          resizeMode="cover"
        />
        <View style={{ padding: spacing.md }}>
          <Text
            numberOfLines={2}
            style={{ color: themeColors.text, fontSize: 16, fontWeight: "700" }}
          >
            {title}
          </Text>
          {author ? (
            <Text
              numberOfLines={1}
              style={{
                color: themeColors.subtle,
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {author}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
