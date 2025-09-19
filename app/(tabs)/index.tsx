import FeaturedCard from "@/components/FeaturedCard";
import SectionHeader from "@/components/SectionHeader";
import StoryCard from "@/components/StoryCard";
import Header from "@/components/ui/Header";
import UpdateRow from "@/components/UpdateRow";
import { colors, spacing } from "@/constants/theme";
import { featured, latestUpdates, trendingMonth } from "@/data/mock";
import { RootStackParamList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { useColorScheme } from "react-native";

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";

  const goTo = useCallback(
    (id: string) => {
      navigation.navigate("StoryDetail", { id });
    },
    [navigation]
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
