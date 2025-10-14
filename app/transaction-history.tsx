import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { getTransactions, Transaction, TransactionResponse } from "@/services";
import { isAuthenticated } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const mockTransactions: TransactionResponse = {
  count: 27,
  next: 2,
  previous: null,
  results: [
    {
      id: 35,
      user: {
        fullname: "Adminn",
        email: "admin@admin.vn",
      },
      modification_time: 1759750758,
      creation_time: 1759750758,
      code: "T1LXAGEOIM",
      amount: "50000",
      method: "bank_transfer",
      status: "init",
    },
    {
      id: 34,
      user: {
        fullname: "Adminn",
        email: "admin@admin.vn",
      },
      modification_time: 1759748921,
      creation_time: 1759748921,
      code: "T1YMFKNPWJ",
      amount: "200000",
      method: "bank_transfer",
      status: "pending",
    },
    {
      id: 33,
      user: {
        fullname: "Adminn",
        email: "admin@admin.vn",
      },
      modification_time: 1759748894,
      creation_time: 1759748894,
      code: "T1WFNJPBUG",
      amount: "10000",
      method: "bank_transfer",
      status: "pending",
    },
    {
      id: 29,
      user: {
        fullname: "Adminn",
        email: "admin@admin.vn",
      },
      modification_time: 1742977449,
      creation_time: 1742977449,
      code: "T1WKTGHPFI",
      amount: "20000",
      method: "bank_transfer",
      status: "init",
    },
    {
      id: 23,
      user: {
        fullname: "Adminn",
        email: "admin@admin.vn",
      },
      modification_time: 1741793221,
      creation_time: 1741793208,
      code: "T1PNKKBJDM",
      amount: "10000",
      method: "bank_transfer",
      status: "success",
    },
  ],
};

// Helper function để lấy icon và màu dựa trên trạng thái giao dịch
const getStatusInfo = (status: string, isDark: boolean) => {
  switch (status) {
    case "success":
      return {
        icon: "checkmark-circle",
        color: "#22c55e",
        label: "Thành công",
      };
    case "pending":
      return {
        icon: "time",
        color: "#eab308",
        label: "Đang xử lý",
      };
    case "failed":
      return {
        icon: "close-circle",
        color: "#ef4444",
        label: "Thất bại",
      };
    case "init":
    default:
      return {
        icon: "ellipsis-horizontal-circle",
        color: "#3b82f6",
        label: "Khởi tạo",
      };
  }
};

// Helper function để định dạng thời gian
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper function để định dạng phương thức thanh toán
const getMethodName = (method: string) => {
  switch (method) {
    case "bank_transfer":
      return "Chuyển khoản";
    case "momo":
      return "MoMo";
    case "zalopay":
      return "ZaloPay";
    case "vnpay":
      return "VNPay";
    default:
      return method;
  }
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        // Kiểm tra đăng nhập trước khi gọi API
        const isLoggedIn = await isAuthenticated();

        if (!isLoggedIn) {
          Alert.alert(
            "Cần đăng nhập",
            "Vui lòng đăng nhập để xem lịch sử giao dịch",
            [{ text: "OK", onPress: () => router.replace("/login") }]
          );
          return;
        }

        // Gọi API (đã có kiểm tra token bên trong)
        const response = await getTransactions({
          ordering: "-creation_time",
          size: 10,
        });

        setTransactions(response.data.results);
      } catch (error) {
        console.error("Failed to fetch transactions", error);

        if (
          error instanceof Error &&
          error.message.includes("session has expired")
        ) {
          Alert.alert(
            "Phiên đăng nhập hết hạn",
            "Vui lòng đăng nhập lại để tiếp tục",
            [{ text: "OK" }]
          );
        } else {
          // Fallback to mock data if API fails
          setTransactions(mockTransactions.results);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const statusInfo = getStatusInfo(item.status, isDark);

    return (
      <View
        style={[styles.transactionCard, isDark && styles.transactionCardDark]}
      >
        <View style={styles.transactionHeader}>
          <View style={styles.codeContainer}>
            <Text style={[styles.codeLabel, isDark && styles.labelDark]}>
              Mã giao dịch
            </Text>
            <Text style={[styles.codeValue, isDark && styles.valueDark]}>
              {item.code}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo.color + "20" },
            ]}
          >
            <Ionicons
              name={statusInfo.icon}
              size={14}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.labelDark]}>
              Số tiền
            </Text>
            <Text
              style={[
                styles.detailValue,
                styles.amountText,
                isDark && styles.valueDark,
              ]}
            >
              {parseInt(item.amount).toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.labelDark]}>
              Phương thức
            </Text>
            <Text style={[styles.detailValue, isDark && styles.valueDark]}>
              {getMethodName(item.method)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.labelDark]}>
              Thời gian
            </Text>
            <Text style={[styles.detailValue, isDark && styles.valueDark]}>
              {formatDate(item.creation_time)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#fff" : "#333"}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            Lịch sử giao dịch
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text
              style={[styles.loadingText, isDark && styles.loadingTextDark]}
            >
              Đang tải lịch sử giao dịch...
            </Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransactionItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={64} color="#a1a1aa" />
                <Text
                  style={[styles.emptyText, isDark && styles.emptyTextDark]}
                >
                  Không có giao dịch nào
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerTitleDark: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  loadingTextDark: {
    color: "#aaa",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionCardDark: {
    backgroundColor: "#252530",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  codeContainer: {},
  codeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  labelDark: {
    color: "#aaa",
  },
  valueDark: {
    color: "#f1f1f1",
  },
  emptyContainer: {
    paddingTop: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#71717a",
    textAlign: "center",
  },
  emptyTextDark: {
    color: "#a1a1aa",
  },
});
