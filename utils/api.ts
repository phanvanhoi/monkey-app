import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";

const BASE_URL = process.env.API_BASE_URL ?? "https://api.example.com";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers ?? {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token handling (queue requests while refreshing)
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (err?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token && config.headers) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.headers.Authorization = `Bearer ${token}`;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resolve(api(config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error?.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: original });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // adjust endpoint to your API
        const resp = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const newToken = resp.data?.accessToken ?? resp.data?.access_token;
        const newRefresh = resp.data?.refreshToken ?? resp.data?.refresh_token;

        if (!newToken) throw new Error("Refresh failed");

        await AsyncStorage.setItem("auth_token", newToken);
        if (newRefresh) await AsyncStorage.setItem("refresh_token", newRefresh);

        processQueue(null, newToken);
        isRefreshing = false;

        if (original.headers) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return api(original);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        await AsyncStorage.removeItem("auth_token");
        await AsyncStorage.removeItem("refresh_token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Thiết lập Basic Authorization header cho mọi request (username:password)
 */
export function setBasicAuth(username: string, password: string) {
  try {
    const token = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );
    api.defaults.headers.common = api.defaults.headers.common ?? {};
    api.defaults.headers.common["Authorization"] = `Basic ${token}`;
  } catch (e) {
    console.warn("setBasicAuth failed", e);
  }
}

/**
 * Xóa Authorization header (dùng khi muốn chuyển sang token based hoặc logout)
 */
export function clearAuthHeader() {
  if (api.defaults.headers && api.defaults.headers.common) {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
