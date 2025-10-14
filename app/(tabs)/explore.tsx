import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { useOptionalAppTheme } from "@/contexts/ThemeContext";

type Wallet = {
  balance: number;
  modification_time: number;
};

type UserInfo = {
  id: number;
  email: string;
  fullname: string;
  date_joined: string;
  last_login: string;
  role: string;
  avatar: string;
  avatar_uri: string;
  facebook: string;
  contact: string;
  description: string;
  is_vip: boolean;
  vip_expiry: number;
  wallet: Wallet;
};

const mockUser: UserInfo = {
  id: 1,
  email: "admin@admin.vn",
  fullname: "Adminn",
  date_joined: "2024-07-04T17:53:04.607311+07:00",
  last_login: "2025-10-06T17:58:20.809657+07:00",
  role: "admin",
  avatar:
    "http://api.hoannq.click/be-user/2024-07-04_105304.6073110000_1715953258-2238_jNkYw4G.jpg",
  avatar_uri:
    "/backend-images/be-user/2024-07-04_105304.6073110000_1715953258-2238_jNkYw4G.jpg",
  facebook: "hoannq",
  contact: "",
  description: "hoannq",
  is_vip: true,
  vip_expiry: -1,
  wallet: {
    balance: 79,
    modification_time: 1741544710,
  },
};

export default function ProfileScreen() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";
  const isDark = colorScheme === "dark";

  const router = useRouter();

  useEffect(() => {
    setUser(mockUser);
  }, []);

  if (!user) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.nameSection}>
          <Text style={styles.fullname}>{user.fullname}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user.role === "admin" ? "Quản trị viên" : user.role}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{user.wallet.balance}</Text>
          <Text style={styles.balanceUnit}>xu</Text>
        </View>
        <TouchableOpacity
          style={styles.topUpButton}
          onPress={() => router.push("/top-up")}
        >
          <Text style={styles.topUpText}>Nạp thêm</Text>
          <Ionicons name="add-circle-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8b5cf6"
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>
                {user.email}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#8b5cf6"
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Ngày tham gia</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>
                {formatDate(user.date_joined)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={20}
              color="#8b5cf6"
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Lần đăng nhập cuối</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>
                {formatDate(user.last_login)} {formatTime(user.last_login)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="logo-facebook"
              size={20}
              color="#8b5cf6"
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Facebook</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>
                {user.facebook}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#8b5cf6"
              style={styles.icon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Mô tả</Text>
              <Text style={[styles.value, isDark && styles.valueDark]}>
                {user.description}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="diamond-outline"
              size={20}
              color="#8b5cf6"
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Hạng</Text>
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.vipText}>VIP</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings-outline" size={22} color="#8b5cf6" />
          <Text style={styles.actionText}>Cài đặt tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmarks-outline" size={22} color="#8b5cf6" />
          <Text style={styles.actionText}>Truyện đã lưu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color="#8b5cf6" />
          <Text style={styles.actionText}>Truyện yêu thích</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={[styles.actionText, { color: "#ef4444" }]}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },
  containerDark: {
    backgroundColor: "#1a1a22",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: "#ddd6fe",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginBottom: 14,
    borderWidth: 4,
    borderColor: "#fff",
  },
  nameSection: {
    alignItems: "center",
  },
  fullname: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5b21b6",
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  balanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#a78bfa",
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balanceValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  balanceUnit: {
    color: "white",
    fontSize: 16,
    marginLeft: 4,
  },
  topUpButton: {
    flexDirection: "row",
    backgroundColor: "#7c3aed",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  topUpText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 3,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoCardDark: {
    backgroundColor: "#252530",
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginTop: 2,
    marginRight: 12,
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  valueDark: {
    color: "#f1f1f1",
  },
  vipBadge: {
    flexDirection: "row",
    backgroundColor: "#f0eaff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignItems: "center",
  },
  vipText: {
    color: "#7c3aed",
    fontWeight: "bold",
    marginLeft: 4,
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    margin: 16,
    marginTop: 0,
    elevation: 3,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
});
