import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
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

import { register } from "@/services";
import * as Haptics from "expo-haptics";

interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState<RegisterPayload>({
    fullname: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterPayload>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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
    const newErrors: Partial<RegisterPayload> = {};
    let isValid = true;

    // Validate fullname
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ tên không được để trống";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    // Validate confirm password
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof RegisterPayload, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Gọi API đăng ký
      await register(formData);

      // Chuyển hướng đến trang xác thực OTP thay vì login
      router.replace({
        pathname: "/otp-verification",
        params: { email: formData.email },
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      // Xử lý lỗi API
      if (error.response?.data?.message) {
        Alert.alert("Lỗi đăng ký", error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Xử lý lỗi validation
        const apiErrors = error.response.data.errors;
        const formattedErrors: Partial<RegisterPayload> = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key as keyof RegisterPayload] = apiErrors[key];
        });

        setErrors(formattedErrors);
      } else {
        Alert.alert(
          "Lỗi đăng ký",
          "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau."
        );
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.fullname.trim()) {
      setErrors({ ...errors, fullname: "Họ tên không được để trống" });
      return;
    }

    if (currentStep === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        setErrors({ ...errors, email: "Email không hợp lệ" });
        return;
      }
    }

    if (currentStep < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Render fields based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDark && styles.stepTitleDark]}>
              Xin chào! Bạn tên là gì?
            </Text>
            <Text
              style={[
                styles.stepDescription,
                isDark && styles.stepDescriptionDark,
              ]}
            >
              Cho chúng tôi biết tên của bạn để tạo tài khoản
            </Text>
            <TextInput
              style={[
                styles.input,
                isDark && styles.inputDark,
                errors.fullname && styles.inputError,
              ]}
              placeholder="Nhập họ tên của bạn"
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              value={formData.fullname}
              onChangeText={(text) => handleInputChange("fullname", text)}
              autoFocus
              returnKeyType="next"
              onSubmitEditing={nextStep}
            />
            {errors.fullname ? (
              <Text style={styles.errorText}>{errors.fullname}</Text>
            ) : null}
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDark && styles.stepTitleDark]}>
              Email của bạn là gì?
            </Text>
            <Text
              style={[
                styles.stepDescription,
                isDark && styles.stepDescriptionDark,
              ]}
            >
              Chúng tôi sẽ gửi xác nhận đến email này
            </Text>
            <TextInput
              ref={emailRef}
              style={[
                styles.input,
                isDark && styles.inputDark,
                errors.email && styles.inputError,
              ]}
              placeholder="Nhập địa chỉ email"
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={nextStep}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDark && styles.stepTitleDark]}>
              Tạo mật khẩu
            </Text>
            <Text
              style={[
                styles.stepDescription,
                isDark && styles.stepDescriptionDark,
              ]}
            >
              Hãy chọn mật khẩu an toàn (ít nhất 6 ký tự)
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
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoFocus
                returnKeyType="next"
                onSubmitEditing={nextStep}
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
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDark && styles.stepTitleDark]}>
              Xác nhận mật khẩu
            </Text>
            <Text
              style={[
                styles.stepDescription,
                isDark && styles.stepDescriptionDark,
              ]}
            >
              Nhập lại mật khẩu để xác nhận
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={confirmPasswordRef}
                style={[
                  styles.input,
                  styles.passwordInput,
                  isDark && styles.inputDark,
                  errors.confirm_password && styles.inputError,
                ]}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                value={formData.confirm_password}
                onChangeText={(text) =>
                  handleInputChange("confirm_password", text)
                }
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color={isDark ? "#d1d5db" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
            {errors.confirm_password ? (
              <Text style={styles.errorText}>{errors.confirm_password}</Text>
            ) : null}
          </View>
        );
      default:
        return null;
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
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
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
              Đăng ký tài khoản
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
            {renderStep()}

            <View style={styles.stepIndicator}>
              {[0, 1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={[
                    styles.stepDot,
                    currentStep === step && styles.stepDotActive,
                    isDark &&
                      (currentStep === step
                        ? styles.stepDotActiveDark
                        : styles.stepDotDark),
                  ]}
                />
              ))}
            </View>

            {currentStep === 3 ? (
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Đăng ký</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={nextStep}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
              </TouchableOpacity>
            )}

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, isDark && styles.loginTextDark]}>
                Đã có tài khoản?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
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
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  titleDark: {
    color: "#f9fafb",
  },
  formContainer: {
    width: "100%",
  },
  stepContainer: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  stepTitleDark: {
    color: "#f9fafb",
  },
  stepDescription: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 24,
  },
  stepDescriptionDark: {
    color: "#9ca3af",
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
    marginBottom: 8,
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
    marginBottom: 8,
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
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 32,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d1d5db",
    marginHorizontal: 6,
  },
  stepDotActive: {
    backgroundColor: "#8b5cf6",
    width: 12,
    height: 12,
  },
  stepDotDark: {
    backgroundColor: "#4b5563",
  },
  stepDotActiveDark: {
    backgroundColor: "#a78bfa",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: "#4b5563",
  },
  loginTextDark: {
    color: "#9ca3af",
  },
  loginLink: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoContainerDark: {
    backgroundColor: "#4c1d95",
  },
});
