import api from "@/utils/api";

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

// CHAPTER
export const getChapterDetail = (storySlug: string) =>
  api.get(`/api/story/${storySlug}`);

export const getChapterList = (storySlug: string) =>
  api.get(`/api/story/${storySlug}/chapter`);

// IMAGES
export const getImage = (path: string) => api.get(`/images/${path}`);
