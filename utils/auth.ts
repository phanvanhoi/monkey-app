import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const ACCESS_KEY = "auth_token";
const REFRESH_KEY = "refresh_token";

export async function setAuthTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken?: string;
}) {
  if (accessToken) await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
}

export async function clearAuthTokens() {
  await AsyncStorage.removeItem(ACCESS_KEY);
  await AsyncStorage.removeItem(REFRESH_KEY);
}

export async function getAuthToken() {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_KEY);
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
      await setAuthTokens({ accessToken, refreshToken });
      // Sau login, dùng token (api interceptor sẽ pick token từ AsyncStorage)
      // Nếu bạn muốn dùng Basic Auth thay vì token, có thể gọi setBasicAuth(username, password)
    }

    return data;
  } catch (err) {
    // throw để component gọi có thể catch và hiển thị lỗi
    throw err;
  }
}
