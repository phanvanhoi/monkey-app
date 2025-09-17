import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors, spacing } from "../constants/theme";

export default function SectionHeader({
  title,
  onPressMore,
}: {
  title: string;
  onPressMore?: () => void;
}) {
  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          fontWeight: "700",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      {onPressMore ? (
        <Pressable onPress={onPressMore} hitSlop={8}>
          <Text style={{ color: colors.subtle, fontSize: 13 }}>Xem tất cả</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
