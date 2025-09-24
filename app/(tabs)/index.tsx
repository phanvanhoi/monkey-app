import FeaturedCard from "@/components/FeaturedCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SectionHeader from "@/components/SectionHeader";
import StoryCard from "@/components/StoryCard";
import Header from "@/components/ui/Header";
import UpdateRow from "@/components/UpdateRow";
import { colors, spacing } from "@/constants/theme";
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { getStoryList } from "@/services"; // import API
import { RootStackParamList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, useColorScheme } from "react-native";

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";

  const [featured, setFeatured] = useState<any[]>([]);
  const [trendingMonth, setTrendingMonth] = useState<any[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<any[]>([]);

  const goTo = useCallback(
    (id: string) => {
      navigation.navigate("StoryDetail", { id });
    },
    [navigation]
  );

  useEffect(() => {
    (async () => {
      try {
        const params = {
          size: 10,
          page: 1,
          ordering: "daily_watched",
        };
        const resp = await getStoryList(params);
        const results = resp.data?.results ?? [];
        // Map dữ liệu cho từng section nếu cần
        setFeatured(results);
        setTrendingMonth(results);
        setLatestUpdates(results);
      } catch (err) {
        console.warn("getStoryList error", err);
      }
    })();
  }, []);

  const featuredListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (featured.length > 1) {
      const timer = setTimeout(() => {
        featuredListRef.current?.scrollToIndex({ index: 1, animated: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [featured]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Header />}
    >
      {/* Đề cử hôm nay */}
      <SectionHeader title="Đề cử hôm nay" onPressMore={() => {}} />
      <FlatList
        ref={featuredListRef}
        data={featured}
        keyExtractor={(it) => it.id?.toString?.() ?? `${it.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: spacing.xs }}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <FeaturedCard
            title={item.name}
            cover={item.avatar}
            author={item.author}
            onPress={() => goTo(item.id)}
          />
        )}
      />

      {/* Truyện Hot Tháng Này */}
      <SectionHeader title="Truyện Hot Tháng Này" onPressMore={() => {}} />
      <FlatList
        data={trendingMonth}
        keyExtractor={(it) => it.id?.toString?.() ?? `${it.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: spacing.xs }}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <StoryCard
            title={item.name}
            cover={item.avatar}
            views={item.statistics?.total_watched}
            chapters={item.last_chapter?.chapter_number}
            author={item.author}
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
            title={item.name}
            cover={item.avatar}
            latestChapterTitle={
              item.last_chapter?.name ||
              `Chương ${item.last_chapter?.chapter_number ?? ""}`
            }
            timeAgo={item.modification_time}
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
