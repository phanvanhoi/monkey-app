import FacebookPageCard from "@/components/FacebookPageCard";
import FeaturedCard from "@/components/FeaturedCard";
import FooterCard from "@/components/FooterCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import RankingBoard from "@/components/RankingBoard";
import SectionHeader from "@/components/SectionHeader";
import StoryCard from "@/components/StoryCard";
import Header from "@/components/ui/Header";
import UpdateRow from "@/components/UpdateRow";
import { spacing } from "@/constants/theme";
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { getStoryList } from "@/services";
import { RootStackParamList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

const HomeScreen = React.memo(function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";

  const [featured, setFeatured] = useState<any[]>([]);
  const [trendingMonth, setTrendingMonth] = useState<any[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<any[]>([]);

  const router = useRouter();

  const goTo = useCallback(
    (slug: string) => {
      router.push(`/${slug}`);
    },
    [router]
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
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={<Header />}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            <SectionHeader title="Đề cử hôm nay" onPressMore={() => {}} />
            <FlatList
              ref={featuredListRef}
              data={featured}
              keyExtractor={(it) => it.id?.toString?.() ?? `${it.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => (
                <FeaturedCard
                  title={item.name}
                  cover={item.avatar}
                  author={item.author}
                  onPress={() => goTo(item.slug)}
                />
              )}
            />

            <SectionHeader
              title="Truyện Hot Tháng Này"
              onPressMore={() => {}}
            />
            <FlatList
              data={trendingMonth}
              keyExtractor={(it) => it.id?.toString?.() ?? `${it.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => (
                <StoryCard
                  title={item.name}
                  cover={item.avatar}
                  views={item.statistics?.total_watched}
                  chapters={item.last_chapter?.chapter_number}
                  author={item.author}
                  onPress={() => goTo(item.slug)}
                />
              )}
            />

            <SectionHeader title="Truyện mới cập nhật" onPressMore={() => {}} />
            <View style={styles.latestUpdatesContainer}>
              {latestUpdates.map((item) => (
                <UpdateRow
                  key={item.slug}
                  title={item.name}
                  cover={item.avatar}
                  latestChapterTitle={
                    item.last_chapter?.name ||
                    `Chương ${item.last_chapter?.chapter_number ?? ""}`
                  }
                  timeAgo={item.modification_time}
                  onPress={() => goTo(item.slug)}
                />
              ))}
            </View>
            <View style={styles.centered}>
              <FacebookPageCard />
            </View>
            <View style={styles.footerCentered}>
              <RankingBoard />
            </View>
          </View>
          <View style={styles.footerCentered}>
            <FooterCard />
          </View>
        </ScrollView>
      </ParallaxScrollView>
    </>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: spacing.xs,
  },
  flatListContent: {
    paddingBottom: spacing.md,
  },
  latestUpdatesContainer: {
    paddingVertical: spacing.sm,
  },
  centered: {
    alignItems: "center",
    marginBottom: spacing.lg,
    width: "100%",
  },
  footerCentered: {
    alignItems: "center",
    width: "100%",
  },
  copyright: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
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
