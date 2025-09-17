import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

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
          style={{ color: colors.text, fontSize: 14, fontWeight: "700" }}
        >
          {title}
        </Text>
        {latestChapterTitle ? (
          <Text
            numberOfLines={1}
            style={{ color: colors.subtle, fontSize: 12, marginTop: 4 }}
          >
            {latestChapterTitle}
          </Text>
        ) : null}
        {timeAgo ? (
          <Text style={{ color: colors.subtle, fontSize: 12, marginTop: 2 }}>
            {timeAgo}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
