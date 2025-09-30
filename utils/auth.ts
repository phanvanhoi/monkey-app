import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const TOKEN_KEY = "auth_token";

/**
 * Lưu token sau khi login
 */
export async function setAuthToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

/**
 * Xóa token khi logout
 */
export async function clearAuthToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

/**
 * Lấy token để dùng cho axios
 */
export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

/**
 * Gửi username/password tới API để lấy token (adjust endpoint/body theo API của bạn).
 * Nếu API trả accessToken/refreshToken thì lưu vào AsyncStorage.
 */
export async function loginWithCredentials({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    // Nếu API dùng JSON body
    const resp = await api.post("/auth/login", { username, password });

    const data = resp.data ?? {};
    const accessToken = data.accessToken ?? data.token ?? data.access_token;
    const refreshToken = data.refreshToken ?? data.refresh_token;

    if (accessToken) {
      await setAuthToken(accessToken);
      // Sau login, dùng token (api interceptor sẽ pick token từ AsyncStorage)
      // Nếu bạn muốn dùng Basic Auth thay vì token, có thể gọi setBasicAuth(username, password)
    }

    return data;
  } catch (err) {
    // throw để component gọi có thể catch và hiển thị lỗi
    throw err;
  }
}
