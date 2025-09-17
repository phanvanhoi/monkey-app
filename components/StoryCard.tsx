import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

export default function StoryCard({
  title,
  cover,
  views,
  chapters,
  isFull,
  onPress,
}: {
  title: string;
  cover: string;
  views?: number;
  chapters?: number;
  isFull?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 150, marginRight: spacing.md }}
    >
      <View
        style={{
          borderRadius: radius.md,
          overflow: "hidden",
          backgroundColor: colors.surface,
        }}
      >
        <View>
          <Image
            source={{ uri: cover }}
            style={{ width: "100%", height: 200 }}
            resizeMode="cover"
          />
          {isFull ? (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "#0ea5e9",
                paddingHorizontal: 6,
                paddingVertical: 3,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
                FULL
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ padding: spacing.sm }}>
          <Text
            numberOfLines={2}
            style={{
              color: colors.text,
              fontSize: 13,
              fontWeight: "700",
              minHeight: 36,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 6,
              alignItems: "center",
            }}
          >
            {typeof views === "number" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="eye-outline" size={14} color={colors.subtle} />
                <Text
                  style={{ color: colors.subtle, fontSize: 12, marginLeft: 4 }}
                >
                  {views.toLocaleString("vi-VN")}
                </Text>
              </View>
            ) : null}
            {typeof chapters === "number" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="bookmark-outline"
                  size={14}
                  color={colors.subtle}
                />
                <Text
                  style={{ color: colors.subtle, fontSize: 12, marginLeft: 4 }}
                >
                  {chapters}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
