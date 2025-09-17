import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { colors, radius, spacing } from "../../constants/theme";
import { featured, latestUpdates, trendingMonth } from "../../data/mock";

function byId(id: string) {
  return featured.concat(trendingMonth, latestUpdates).find((s) => s.id === id);
}

export default function StoryDetailScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "StoryDetail">) {
  const story = byId(route.params.id);

  if (!story) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.text }}>Không tìm thấy truyện.</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: colors.primary }}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: spacing.lg }}>
        <Image
          source={{ uri: story.cover }}
          style={{ width: "100%", height: 260, borderRadius: radius.lg }}
        />
        <Text
          style={{
            color: colors.text,
            fontSize: 20,
            fontWeight: "800",
            marginTop: spacing.md,
          }}
        >
          {story.title}
        </Text>
        <Text style={{ color: colors.subtle, marginTop: 6 }}>
          {story.chapters ? `${story.chapters} chương` : ""}
          {story.views
            ? ` · ${story.views.toLocaleString("vi-VN")} lượt xem`
            : ""}
        </Text>
      </View>
      <View style={{ paddingHorizontal: spacing.lg }}>
        <Text
          style={{ color: colors.text, fontWeight: "700", marginBottom: 8 }}
        >
          Mô tả
        </Text>
        <Text style={{ color: colors.subtle, lineHeight: 20 }}>
          Đây là màn hình chi tiết mẫu. Bạn có thể nối API thật hoặc nội dung
          Markdown của truyện để hiển thị chương, mục lục, bình luận…
        </Text>
      </View>
    </View>
  );
}
