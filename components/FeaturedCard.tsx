import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

export default function FeaturedCard({
  title,
  cover,
  onPress,
}: {
  title: string;
  cover: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 320, marginRight: spacing.md }}
    >
      <View
        style={{
          borderRadius: radius.lg,
          overflow: "hidden",
          backgroundColor: colors.surface,
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
            style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}
          >
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
