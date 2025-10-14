import { getRanking } from "@/services";
import { RankingStory } from "@/types";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = [
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
];

export default function RankingBoard() {
  const [tab, setTab] = useState<"today" | "week" | "month">("today");
  const [data, setData] = useState<RankingStory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        size: 10,
        page: 1,
        ordering:
          tab === "today"
            ? "daily_watched"
            : tab === "week"
            ? "weekly_watched"
            : "monthly_watched",
      };
      const resp = await getRanking(params);
      const results: RankingStory[] = resp.data?.results ?? [];
      setData(results);
    };

    fetchData();
  }, [tab]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BẢNG XẾP HẠNG</Text>
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key as "today" | "week" | "month")}
          >
            <Text
              style={[styles.tabText, tab === t.key && styles.tabTextActive]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image source={{ uri: item.avatar }} style={styles.cover} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.chapter}>
                Chương {item.last_chapter?.chapter_number ?? "-"}
              </Text>
            </View>
            <View style={styles.viewsRow}>
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/000000/visible.png",
                }}
                style={styles.eyeIcon}
              />
              <Text style={styles.views}>
                {tab === "today"
                  ? item.statistics?.daily_watched ?? 0
                  : tab === "week"
                  ? item.statistics?.weekly_watched ?? 0
                  : item.statistics?.monthly_watched ?? 0}
              </Text>
            </View>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f5fc",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    elevation: 2,
    width: "100%",
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#6d28d9",
    textAlign: "center",
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    backgroundColor: "#ede9fe",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: "#a78bfa",
  },
  tabText: {
    color: "#6d28d9",
    fontWeight: "bold",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#fff",
  },
  list: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 1,
  },
  rank: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#a855f7",
    width: 24,
    textAlign: "center",
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginHorizontal: 8,
    backgroundColor: "#f3e5ab",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#222",
    marginBottom: 2,
  },
  chapter: {
    fontSize: 12,
    color: "#a855f7",
  },
  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  eyeIcon: {
    width: 16,
    height: 16,
    marginRight: 2,
    tintColor: "#a3a3a3",
  },
  views: {
    fontSize: 13,
    color: "#444",
    fontWeight: "bold",
  },
});
