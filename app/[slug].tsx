import { Colors } from "@/constants/Colors";
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { getStoryDetail } from "@/services";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function StoryDetailPage() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const scheme = ctxTheme ?? fallback ?? "light";
  const themeColors = Colors[scheme] ?? Colors.light;

  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      (async () => {
        try {
          const resp = await getStoryDetail(slug as string);
          setStory(resp.data);
        } catch (err) {
          setStory(null);
        }
      })();
    }
  }, [slug]);

  if (!story)
    return (
      <Text style={{ color: themeColors.text, padding: 24 }}>
        Không có dữ liệu truyện.
      </Text>
    );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.surface }]}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverContainer}>
          <Image source={{ uri: story.avatar }} style={styles.cover} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={16}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {story.name}
          </Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Cập nhật</Text>
              <Text style={styles.value}>6 tháng trước</Text>
              <Text style={styles.label}>Loại</Text>
              <Text style={[styles.badge, styles.badgePurple]}>Truyện Chữ</Text>
              <Text style={styles.label}>Tác giả</Text>
              <Text style={styles.value}>{story.author}</Text>
              <Text style={styles.label}>Thể loại</Text>
              {story.category?.map((c: any) => (
                <Text key={c.id} style={[styles.badge, styles.badgePink]}>
                  {c.name}
                </Text>
              ))}
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>Lượt xem</Text>
              <Text style={styles.value}>
                {story.statistics?.total_watched}
              </Text>
              <Text style={styles.label}>Team</Text>
              <Text style={[styles.badge, styles.badgeBlue]}>
                {story.team?.name}
              </Text>
              <Text style={styles.label}>Lượt theo dõi</Text>
              <Text style={styles.value}>{story.statistics?.total_follow}</Text>
              <Text style={styles.label}>Trạng thái</Text>
              <Text style={styles.value}>
                {story.status === "processing"
                  ? "Đang phát hành"
                  : story.status}
              </Text>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.donate]}>
              <Text style={styles.buttonText}>Donate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.read]}>
              <Text style={styles.buttonText}>Đọc từ đầu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.readNew]}>
              <Text style={styles.buttonText}>Đọc tập mới</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.follow]}>
              <Text style={styles.buttonText}>Theo dõi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.error]}>
              <Text style={styles.buttonText}>Báo lỗi</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.button, styles.copyright]}>
            <Text style={styles.buttonText}>Báo cáo vi phạm bản quyền</Text>
          </TouchableOpacity>
          <Text style={[styles.desc, { color: themeColors.text }]}>
            {story.description}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  coverContainer: {
    width: "100%",
    height: 240,
    position: "relative",
    marginBottom: 12,
  },
  cover: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  backBtn: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.32)",
    borderRadius: 20,
    padding: 2,
    zIndex: 10,
  },
  card: { marginHorizontal: 16, borderRadius: 12, padding: 16, elevation: 2 },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoCol: { flex: 1, gap: 4 },
  label: { fontSize: 13, color: "#888", marginTop: 6 },
  value: { fontSize: 14, color: "#222" },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 2,
    color: "#fff",
  },
  badgePurple: { backgroundColor: "#a855f7" },
  badgePink: { backgroundColor: "#ec4899" },
  badgeBlue: { backgroundColor: "#0ea5e9" },
  buttonRow: { flexDirection: "row", gap: 8, marginTop: 8, marginBottom: 4 },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 4,
  },
  donate: { backgroundColor: "#fb7185" },
  read: { backgroundColor: "#fde047" },
  readNew: { backgroundColor: "#4ade80" },
  follow: { backgroundColor: "#a78bfa" },
  error: { backgroundColor: "#222" },
  copyright: { backgroundColor: "#ef4444", marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  desc: { marginTop: 16, fontSize: 14, lineHeight: 20 },
});
