import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { colors, spacing } from "../../constants/theme";
import { featured, latestUpdates, trendingMonth } from "../../data/mock";
import FeaturedCard from "../FeaturedCard";
import SectionHeader from "../SectionHeader";
import StoryCard from "../StoryCard";
import UpdateRow from "../UpdateRow";

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {
  const goTo = useCallback(
    (id: string) => {
      navigation.navigate("StoryDetail", { id });
    },
    [navigation]
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Đề cử hôm nay */}
      <SectionHeader title="Đề cử hôm nay" onPressMore={() => {}} />
      <FlatList
        data={featured}
        keyExtractor={(it) => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: spacing.md }}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <FeaturedCard
            title={item.title}
            cover={item.cover}
            onPress={() => goTo(item.id)}
          />
        )}
      />

      {/* Truyện Hot Tháng Này */}
      <SectionHeader title="Truyện Hot Tháng Này" onPressMore={() => {}} />
      <FlatList
        data={trendingMonth}
        keyExtractor={(it) => it.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: spacing.md }}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <StoryCard
            title={item.title}
            cover={item.cover}
            views={item.views}
            chapters={item.chapters}
            onPress={() => goTo(item.id)}
          />
        )}
      />

      {/* Truyện mới cập nhật */}
      <SectionHeader title="Truyện mới cập nhật" onPressMore={() => {}} />
      <View style={{ paddingVertical: spacing.sm }}>
        {latestUpdates.map((item) => (
          <UpdateRow
            key={item.id}
            title={item.title}
            cover={item.cover}
            latestChapterTitle={item.latestChapterTitle}
            timeAgo={item.timeAgo}
            onPress={() => goTo(item.id)}
          />
        ))}
      </View>

      <Text
        style={{
          color: colors.subtle,
          fontSize: 12,
          textAlign: "center",
          paddingVertical: spacing.lg,
        }}
      >
        © 2025 MonkeyD Clone — demo UI
      </Text>
    </ScrollView>
  );
}
