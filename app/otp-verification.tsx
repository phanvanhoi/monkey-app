import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { resendOtp, verifyOtp } from "@/services";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function OTPVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // References for OTP input fields
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Countdown timer for resending OTP
    let interval: number;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isTimerRunning]);

  const handleOtpChange = (text: string, index: number) => {
    if (error) setError("");

    // Allow only numbers
    if (!/^\d*$/.test(text)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus to next field
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all digits are filled
    if (text.length === 1 && index === 5) {
      // Last digit was entered, hide keyboard
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous field on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // API call to verify OTP
      await verifyOtp(email || "", otpString);

      // Show success message and navigate to login
      Alert.alert(
        "Xác thực thành công",
        "Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập để tiếp tục.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setError(error.message || "Mã OTP không đúng. Vui lòng thử lại.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isTimerRunning) return;

    try {
      setIsResending(true);

      // API call to resend OTP
      await resendOtp(email || "");

      // Reset timer
      setTimer(60);
      setIsTimerRunning(true);

      // Show success message
      Alert.alert("Gửi lại OTP", "Mã OTP mới đã được gửi tới email của bạn.");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      Alert.alert("Lỗi", "Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.container, isDark && styles.containerDark]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#f3f4f6" : "#374151"}
            />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.iconContainer,
                  isDark && styles.iconContainerDark,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={40}
                  color={isDark ? "#a78bfa" : "#8b5cf6"}
                />
              </View>
              <Text style={[styles.title, isDark && styles.titleDark]}>
                Xác thực tài khoản
              </Text>
              <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                Mã xác thực đã được gửi tới
              </Text>
              <Text style={[styles.emailText, isDark && styles.emailTextDark]}>
                {email || "email của bạn"}
              </Text>
            </View>

            <View style={styles.otpContainer}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      isDark && styles.otpInputDark,
                      otp[index] ? styles.otpInputFilled : {},
                      error ? styles.otpInputError : {},
                    ]}
                    value={otp[index]}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.verifyButton,
                (isLoading || otp.join("").length !== 6) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleVerify}
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Xác thực</Text>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text
                style={[styles.resendText, isDark && styles.resendTextDark]}
              >
                Không nhận được mã?{" "}
              </Text>
              {isTimerRunning ? (
                <Text style={styles.timerText}>Gửi lại sau {timer}s</Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOtp}
                  disabled={isResending}
                >
                  <Text style={styles.resendLink}>
                    {isResending ? "Đang gửi..." : "Gửi lại"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainerDark: {
    backgroundColor: "#4c1d95",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  titleDark: {
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitleDark: {
    color: "#9ca3af",
  },
  emailText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#8b5cf6",
  },
  emailTextDark: {
    color: "#a78bfa",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: "15%",
    height: 60,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  otpInputDark: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    color: "#f9fafb",
  },
  otpInputFilled: {
    borderColor: "#8b5cf6",
    backgroundColor: "#f5f3ff",
  },
  otpInputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  verifyButton: {
    height: 56,
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#a78bfa",
    elevation: 0,
    opacity: 0.8,
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    color: "#4b5563",
  },
  resendTextDark: {
    color: "#9ca3af",
  },
  timerText: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
  },
  resendLink: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
});
