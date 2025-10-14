import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { login } from "@/services";
import { setAuthToken } from "@/utils/auth";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Input refs for focus management
  const passwordRef = useRef<TextInput>(null);

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

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};
    let isValid = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate password
    if (!credentials.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials({ ...credentials, [field]: value });
    // Clear error when typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Call login API
      const response = await login(credentials.email, credentials.password);

      // Handle successful login
      if (response.data?.token) {
        await setAuthToken(response.data.token);
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Lỗi đăng nhập",
          "Không nhận được token. Vui lòng thử lại sau."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle API error responses
      if (error.response?.status === 401) {
        Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không đúng");
      } else if (error.response?.data?.message) {
        Alert.alert("Lỗi đăng nhập", error.response.data.message);
      } else {
        Alert.alert(
          "Lỗi đăng nhập",
          "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau."
        );
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={[styles.container, isDark && styles.containerDark]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
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

          <View style={styles.header}>
            <View
              style={[styles.logoContainer, isDark && styles.logoContainerDark]}
            >
              <Ionicons
                name="book"
                size={48}
                color={isDark ? "#a78bfa" : "#8b5cf6"}
              />
            </View>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              Đăng nhập
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Chào mừng bạn quay trở lại!
            </Text>
          </View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.inputSection}>
              <Text
                style={[styles.inputLabel, isDark && styles.inputLabelDark]}
              >
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isDark && styles.inputDark,
                  errors.email && styles.inputError,
                ]}
                placeholder="Nhập địa chỉ email"
                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                value={credentials.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.inputSection}>
              <Text
                style={[styles.inputLabel, isDark && styles.inputLabelDark]}
              >
                Mật khẩu
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={passwordRef}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    isDark && styles.inputDark,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                  value={credentials.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color={isDark ? "#d1d5db" : "#6b7280"}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isDark && styles.checkboxDark,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.rememberMeText,
                    isDark && styles.rememberMeTextDark,
                  ]}
                >
                  Ghi nhớ đăng nhập
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, isDark && styles.dividerDark]} />
              <Text
                style={[styles.dividerText, isDark && styles.dividerTextDark]}
              >
                Hoặc
              </Text>
              <View style={[styles.divider, isDark && styles.dividerDark]} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, isDark && styles.socialButtonDark]}
              >
                <Ionicons
                  name="logo-google"
                  size={20}
                  color="#4285F4"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.socialButtonText,
                    isDark && styles.socialButtonTextDark,
                  ]}
                >
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, isDark && styles.socialButtonDark]}
              >
                <Ionicons
                  name="logo-facebook"
                  size={20}
                  color="#1877F2"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.socialButtonText,
                    isDark && styles.socialButtonTextDark,
                  ]}
                >
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text
                style={[styles.registerText, isDark && styles.registerTextDark]}
              >
                Chưa có tài khoản?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/register")}>
                <Text style={styles.registerLink}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e5e7eb",
  },
  logoContainerDark: {
    backgroundColor: "#374151",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  titleDark: {
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
  },
  subtitleDark: {
    color: "#9ca3af",
  },
  formContainer: {
    width: "100%",
    marginTop: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputLabelDark: {
    color: "#d1d5db",
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputDark: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    color: "#f9fafb",
  },
  inputError: {
    borderColor: "#ef4444",
    borderWidth: 1,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDark: {
    borderColor: "#a78bfa",
  },
  checkboxActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#4b5563",
  },
  rememberMeTextDark: {
    color: "#9ca3af",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#8b5cf6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#a78bfa",
    elevation: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerDark: {
    backgroundColor: "#374151",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  dividerTextDark: {
    color: "#9ca3af",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  socialButtonDark: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    color: "#374151",
    fontWeight: "500",
  },
  socialButtonTextDark: {
    color: "#e5e7eb",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 16,
    color: "#4b5563",
  },
  registerTextDark: {
    color: "#9ca3af",
  },
  registerLink: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
});
