import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

const paymentMethods = [
  {
    id: "momo",
    name: "MoMo",
    icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    icon: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
  },
  {
    id: "vnpay",
    name: "VNPay",
    icon: "https://play-lh.googleusercontent.com/KNAtZwTr-jKWzX5O2L5UzlKn8GFoHvz63MjGQ4h8yd_YkS72iwVtEgGw39jYJ7OU0QY",
  },
  {
    id: "bank",
    name: "Chuyển khoản ngân hàng",
    icon: "https://cdn-icons-png.flaticon.com/512/2991/2991406.png",
  },
];

const packages = [
  { id: 1, coins: 10, price: 10000, bonus: 0 },
  { id: 2, coins: 20, price: 20000, bonus: 0 },
  { id: 3, coins: 50, price: 50000, bonus: 5 },
  { id: 4, coins: 100, price: 100000, bonus: 10 },
  { id: 5, coins: 200, price: 200000, bonus: 15 },
  { id: 6, coins: 500, price: 500000, bonus: 30 },
];

export default function TopUpScreen() {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState<number>(2);
  const [selectedPayment, setSelectedPayment] = useState<string>("momo");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false); // Trạng thái loading
  const [transactionId, setTransactionId] = useState(""); // ID giao dịch

  // Hàm xử lý khi nhấn nạp xu
  const handleTopUp = () => {
    const pkg = packages.find((p) => p.id === selectedPackage);
    const paymentMethod = paymentMethods.find((p) => p.id === selectedPayment);

    // Tạo mã giao dịch ngẫu nhiên
    const newTransactionId = `TX${Date.now().toString().substring(6)}`;
    setTransactionId(newTransactionId);

    // Trong thực tế, bạn sẽ gọi API để lấy QR code dựa trên phương thức và gói thanh toán
    setQrCode(
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT:${paymentMethod?.id}:${pkg?.price}:${newTransactionId}`
    );
    setShowPaymentModal(true);
  };

  // Hàm xác nhận đã chuyển khoản
  const confirmPayment = async () => {
    setIsConfirming(true);

    try {
      // Mô phỏng gọi API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Trong thực tế, bạn sẽ gọi API endpoint để xác nhận thanh toán:
      // const response = await api.post('/api/payment/confirm', {
      //   transactionId,
      //   packageId: selectedPackage,
      //   paymentMethod: selectedPayment,
      //   amount: packages.find(p => p.id === selectedPackage)?.price
      // });

      // Đóng modal trước
      setShowPaymentModal(false);

      // Chuyển hướng đến trang lịch sử giao dịch
      router.push("/transaction-history");
    } catch (error) {
      Alert.alert(
        "Lỗi xác nhận",
        "Có lỗi xảy ra khi xác nhận giao dịch. Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={[styles.container, isDark && styles.containerDark]}
        showsVerticalScrollIndicator={false}
      >
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
            Nạp xu
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View
          style={[styles.balanceSection, isDark && styles.balanceSectionDark]}
        >
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>79</Text>
            <Text style={styles.balanceUnit}>xu</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Chọn gói nạp
        </Text>

        <View style={styles.packagesContainer}>
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                isDark && styles.packageCardDark,
                selectedPackage === pkg.id && styles.packageCardSelected,
              ]}
              onPress={() => setSelectedPackage(pkg.id)}
            >
              <View style={styles.packageContent}>
                <View style={styles.coinWrapper}>
                  <Ionicons name="logo-bitcoin" size={18} color="#FFD700" />
                  <Text style={[styles.coinValue, isDark && styles.textDark]}>
                    {pkg.coins}
                  </Text>
                </View>
                <Text style={[styles.price, isDark && styles.textDark]}>
                  {pkg.price.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              {pkg.bonus > 0 && (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusText}>+{pkg.bonus}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Chọn phương thức thanh toán
        </Text>

        <View
          style={[styles.paymentMethods, isDark && styles.paymentMethodsDark]}
        >
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                isDark && styles.paymentMethodDark,
                selectedPayment === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Image source={{ uri: method.icon }} style={styles.paymentIcon} />
              <Text
                style={[styles.paymentName, isDark && styles.paymentNameDark]}
              >
                {method.name}
              </Text>
              <View style={styles.radioCircle}>
                {selectedPayment === method.id && (
                  <View style={styles.radioFill} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.topUpButton, isDark && styles.topUpButtonDark]}
          onPress={handleTopUp}
        >
          <Text style={styles.topUpButtonText}>
            Nạp {packages.find((p) => p.id === selectedPackage)?.coins} xu
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={18} color="#888" />
          <Text style={styles.noticeText}>
            Xu sẽ được cộng vào tài khoản của bạn ngay sau khi thanh toán hoàn
            tất. Nếu bạn gặp vấn đề, vui lòng liên hệ với bộ phận hỗ trợ.
          </Text>
        </View>
      </ScrollView>

      {/* Modal hiển thị QR và điều khoản */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !isConfirming && setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            style={{ width: "100%" }}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={[styles.modalContent, isDark && styles.modalContentDark]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[styles.modalTitle, isDark && styles.modalTitleDark]}
                >
                  Thanh toán
                </Text>
                {!isConfirming && (
                  <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDark ? "#fff" : "#333"}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text
                style={[
                  styles.modalSubtitle,
                  isDark && styles.modalSubtitleDark,
                ]}
              >
                Quét mã QR để thanh toán
              </Text>

              <View style={styles.qrContainer}>
                <Image source={{ uri: qrCode }} style={styles.qrCode} />
              </View>

              <View style={styles.paymentInfoBox}>
                <View style={styles.paymentInfoRow}>
                  <Text style={styles.paymentInfoLabel}>Mã giao dịch:</Text>
                  <Text style={styles.paymentInfoValue}>{transactionId}</Text>
                </View>
                <View style={styles.paymentInfoRow}>
                  <Text style={styles.paymentInfoLabel}>Số xu:</Text>
                  <Text style={styles.paymentInfoValue}>
                    {packages.find((p) => p.id === selectedPackage)?.coins} xu
                  </Text>
                </View>
                <View style={styles.paymentInfoRow}>
                  <Text style={styles.paymentInfoLabel}>Số tiền:</Text>
                  <Text style={styles.paymentInfoValue}>
                    {packages
                      .find((p) => p.id === selectedPackage)
                      ?.price.toLocaleString("vi-VN")}
                    đ
                  </Text>
                </View>
                <View style={styles.paymentInfoRow}>
                  <Text style={styles.paymentInfoLabel}>Phương thức:</Text>
                  <Text style={styles.paymentInfoValue}>
                    {paymentMethods.find((p) => p.id === selectedPayment)?.name}
                  </Text>
                </View>
              </View>

              <Text style={styles.instructionText}>
                Sau khi quét mã và thanh toán thành công, vui lòng nhấn nút "Xác
                nhận đã chuyển khoản" ở dưới.
              </Text>

              <View style={styles.termsContainer}>
                <Text style={styles.termsTitle}>Điều khoản sử dụng:</Text>
                <Text style={styles.termsText}>
                  1. Xu được nạp không thể hoàn lại hoặc chuyển cho người khác.
                </Text>
                <Text style={styles.termsText}>
                  2. Đơn vị phát hành có quyền điều chỉnh tỷ giá xu và tiền tệ.
                </Text>
                <Text style={styles.termsText}>
                  3. Người dùng chịu trách nhiệm bảo mật thông tin thanh toán.
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://example.com/terms")}
                >
                  <Text style={styles.termsLink}>Xem toàn bộ điều khoản</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmPaymentButton,
                  isDark && styles.confirmPaymentButtonDark,
                  isConfirming && styles.disabledButton,
                ]}
                onPress={confirmPayment}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.confirmButtonText}>
                      Đang xác nhận...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Xác nhận đã chuyển khoản
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  isConfirming && styles.disabledButton,
                ]}
                onPress={() => setShowPaymentModal(false)}
                disabled={isConfirming}
              >
                <Text style={styles.cancelButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  balanceSection: {
    backgroundColor: "#a78bfa",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  balanceSectionDark: {
    backgroundColor: "#7c3aed",
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balanceValue: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  balanceUnit: {
    color: "white",
    fontSize: 16,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  sectionTitleDark: {
    color: "#f1f1f1",
  },
  packagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  packageCard: {
    backgroundColor: "#fff",
    width: "47%",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
    overflow: "hidden",
  },
  packageCardDark: {
    backgroundColor: "#252530",
  },
  packageCardSelected: {
    borderWidth: 2,
    borderColor: "#8b5cf6",
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  packageContent: {
    alignItems: "center",
  },
  coinWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  coinValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  textDark: {
    color: "#fff",
  },
  price: {
    fontSize: 14,
    color: "#666",
  },
  packagePriceDark: {
    color: "#bbb",
  },
  bonusBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#f43f5e",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: 8,
  },
  bonusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  paymentMethods: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentMethodsDark: {
    backgroundColor: "#252530",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  paymentMethodDark: {
    borderBottomColor: "#333",
  },
  paymentMethodSelected: {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  paymentIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
  },
  paymentName: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  paymentNameDark: {
    color: "#f1f1f1",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  radioFill: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#8b5cf6",
  },
  topUpButton: {
    flexDirection: "row",
    backgroundColor: "#8b5cf6",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    elevation: 3,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  topUpButtonDark: {
    backgroundColor: "#7c3aed",
  },
  topUpButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 8,
  },
  notice: {
    flexDirection: "row",
    padding: 16,
    marginTop: 16,
    alignItems: "flex-start",
    marginBottom: 40,
  },
  noticeText: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 6,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "100%",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContentDark: {
    backgroundColor: "#252530",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalTitleDark: {
    color: "#fff",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  modalSubtitleDark: {
    color: "#aaa",
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignSelf: "center",
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  paymentInfoBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  paymentInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  paymentInfoLabel: {
    color: "#666",
  },
  paymentInfoValue: {
    fontWeight: "bold",
    color: "#333",
  },
  instructionText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 16,
    fontStyle: "italic",
  },
  termsContainer: {
    marginTop: 12,
  },
  termsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  termsText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
    lineHeight: 18,
  },
  termsLink: {
    color: "#8b5cf6",
    fontSize: 13,
    marginTop: 6,
    textDecorationLine: "underline",
  },
  confirmPaymentButton: {
    backgroundColor: "#22c55e", // Màu xanh lá
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 20,
  },
  confirmPaymentButtonDark: {
    backgroundColor: "#15803d", // Màu xanh lá đậm hơn cho dark mode
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButtonText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
