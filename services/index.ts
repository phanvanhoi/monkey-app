import api from "@/utils/api";
import { clearTokenAndLogout, getToken, setAuthToken } from "@/utils/auth";

// TEAM
export const getTeamDetail = (slug: string) => api.get(`/api/teams/${slug}`);

export const getTeamList = (params?: { size?: number; page?: number }) =>
  api.get("/api/teams", { params });

// AUTH
export const login = (email: string, password: string) =>
  api.post("/api/auth/login", { email, password });

export const logout = () => api.post("/api/auth/logout");

// USERS
export const getUsers = () => api.get("/api/users");

export const getUserDetail = (userId: string) =>
  api.get(`/api/users/${userId}`);

export const registerUser = (
  email: string,
  fullname: string,
  password: string
) => api.post("/api/users/register", { email, fullname, password });

export const verifyOtp = (email: string, otp: string) =>
  api.post("/api/users/register/verify-otp", { email, otp });

export const retryOtp = (email: string) =>
  api.post("/api/users/create-otp", { email });

export const forgotPassword = (email: string, otp: string, password: string) =>
  api.post("/api/users/forgot-password", { email, otp, password });

// CATEGORY
export const getCategoryDetail = (slug: string) =>
  api.get(`/api/category/${slug}`);

export const getCategoryList = (params?: { size?: number; page?: number }) =>
  api.get("/api/category", { params });

// STORY
export const getStoryDetail = (slug: string) => api.get(`/api/story/${slug}`);

export const getStoryList = (params?: {
  size?: number;
  page?: number;
  status?: string;
}) => api.get("/api/story", { params });

export const getRanking = (props: {
  size: number;
  page: number;
  ordering: string;
}) =>
  api.get("/api/story", {
    params: props || { size: 10, page: 1, ordering: "daily_watched" },
  });

// CHAPTER
export const getChapterDetail = (storySlug: string) =>
  api.get(`/api/story/${storySlug}`);

export const getChapterList = (storySlug: string) =>
  api.get(`/api/story/${storySlug}/chapter`);

// IMAGES
export const getImage = (path: string) => api.get(`/images/${path}`);

// Types for Transaction
export interface User {
  fullname: string;
  email: string;
}

export interface Transaction {
  id: number;
  user: User;
  modification_time: number;
  creation_time: number;
  code: string;
  amount: string;
  method: string;
  status: "init" | "pending" | "success" | "failed";
}

export interface TransactionResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: Transaction[];
}

/**
 * Lấy lịch sử giao dịch của người dùng (yêu cầu đã đăng nhập)
 * @param params - Các tham số tùy chọn: ordering, size, page
 * @returns Promise với dữ liệu lịch sử giao dịch
 * @throws Error nếu không có token hoặc token không hợp lệ
 */
export const getTransactions = async (params?: {
  ordering?: string;
  size?: number;
  page?: number;
}) => {
  // Kiểm tra token trước khi gọi API
  const token = await getToken();
  console.log("token", token);
  if (!token) {
    // Không có token, người dùng chưa đăng nhập
    throw new Error("Unauthorized: Please login first");
  }

  // Tham số mặc định
  const defaultParams = {
    ordering: "-creation_time",
    size: 5,
    page: 1,
  };

  // Kết hợp tham số
  const queryParams = { ...defaultParams, ...params };

  try {
    // Gọi API với token trong header
    return await api.get<TransactionResponse>("/api/profile/transaction", {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    // Xử lý lỗi token hết hạn hoặc không hợp lệ
    if (error.response && error.response.status === 401) {
      // Token không hợp lệ hoặc hết hạn
      await clearTokenAndLogout();
      throw new Error("Your session has expired. Please login again.");
    }
    throw error;
  }
};

// REGISTER - Thêm interface để định nghĩa kiểu dữ liệu cho payload đăng ký
export interface RegisterPayload {
  email: string;
  fullname: string;
  password: string;
  confirm_password: string;
}

/**
 * Đăng ký người dùng mới
 * @param payload Thông tin đăng ký: email, fullname, password, confirm_password
 * @returns Promise với response từ API đăng ký
 */
export const register = async (payload: RegisterPayload) => {
  try {
    const response = await api.post("/api/users/register", payload);

    // Nếu API trả về token, lưu token
    if (response.data?.token) {
      await setAuthToken(response.data.token);
    }

    return response;
  } catch (error: any) {
    // Xử lý lỗi cụ thể từ API
    if (error.response?.status === 400) {
      // Lỗi validation
      throw new Error(
        error.response.data?.message || "Thông tin đăng ký không hợp lệ"
      );
    }
    if (error.response?.status === 409) {
      // Email đã tồn tại
      throw new Error("Email này đã được đăng ký");
    }
    // Chuyển tiếp lỗi khác
    throw error;
  }
};

/**
 * Gửi lại mã OTP
 * @param email Email người dùng
 * @returns Promise với response từ API
 */
export const resendOtp = async (email: string) => {
  try {
    // Sử dụng endpoint api/users/create-otp thay vì api/users/resend-otp
    const response = await api.post("/api/users/create-otp", {
      email,
    });
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Email không tồn tại trong hệ thống");
    }
    if (error.response?.status === 429) {
      throw new Error("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau");
    }
    throw error;
  }
};
