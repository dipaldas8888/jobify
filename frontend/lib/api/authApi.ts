import { apiRequest } from "./client";

export const authApi = {
  register: (payload: { name: string; email: string; password: string; role?: string; companyName?: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyEmail: (payload: { email: string; otp: string }) =>
    apiRequest("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resendOTP: (email: string) =>
    apiRequest("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verify2FA: (payload: { email: string; otp: string }) =>
    apiRequest("/auth/verify-2fa", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload: { email: string; otp: string; newPassword: string }) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getProfile: () => apiRequest("/users/profile"),
};
