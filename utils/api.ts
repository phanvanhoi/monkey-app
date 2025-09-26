import axios, { AxiosInstance } from "axios";
import Constants from "expo-constants";
import { setupInterceptors } from "./apiInterceptors";

const BASE_URL =
  Constants.manifest?.extra?.API_BASE_URL ?? "https://api.hoannq.click";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thiết lập interceptors
setupInterceptors(api, BASE_URL);

/**
 * Thiết lập Basic Authorization header cho mọi request (username:password)
 */
export function setBasicAuth(token: string) {
  try {
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
