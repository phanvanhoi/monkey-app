import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const TOKEN_KEY = "auth_token";

/**
 * Lưu token vào storage
 */
export const setAuthToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

// Đổi tên từ saveToken sang setAuthToken
export const saveToken = setAuthToken; // Để tương thích ngược

/**
 * Lấy token từ storage
 */
export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

/**
 * Xóa token và đăng xuất
 */
export const clearTokenAndLogout = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  router.replace("/login");
};

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};
