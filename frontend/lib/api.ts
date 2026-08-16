const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  const token = typeof window !== "undefined" ? (localStorage.getItem("jobify_token") || localStorage.getItem("token")) : null;


  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "An error occurred",
        statusCode: res.status,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error. Is the backend server running?",
    };
  }
}

// Authentication API methods
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


// Jobs API methods
export const jobsApi = {
  getJobs: (params?: Record<string, string>) => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiRequest(`/jobs${queryString}`);
  },

  getJobById: (id: string) => apiRequest(`/jobs/${id}`),

  createJob: (jobData: any) =>
    apiRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),

  updateJob: (id: string, jobData: any) =>
    apiRequest(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    }),

  deleteJob: (id: string) =>
    apiRequest(`/jobs/${id}`, {
      method: "DELETE",
    }),

  applyJob: (jobId: string, formData: FormData) =>
    apiRequest(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: formData,
    }),

  updateApplicationStatus: (applicationId: string, status: string) =>
    apiRequest(`/jobs/applications/${applicationId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Dashboard API methods
export const dashboardApi = {
  getRecruiterDashboard: () => apiRequest("/users/dashboard/recruiter"),
  getCandidateDashboard: () => apiRequest("/users/dashboard/candidate"),
};

// Admin API methods
export const adminApi = {
  getUsers: (params?: Record<string, string>) => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiRequest(`/admin/users${queryString}`);
  },
  toggleUserBan: (id: string) =>
    apiRequest(`/admin/users/${id}/ban`, {
      method: "PUT",
    }),
  updateUser: (id: string, userData: any) =>
    apiRequest(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  getJobs: () => apiRequest("/admin/jobs"),
  approveJob: (id: string) =>
    apiRequest(`/admin/jobs/${id}/approve`, {
      method: "PUT",
    }),
  deleteJob: (id: string) =>
    apiRequest(`/admin/jobs/${id}`, {
      method: "DELETE",
    }),

  getCompanies: () => apiRequest("/admin/companies"),

  getReports: () => apiRequest("/admin/reports"),
  resolveReport: (id: string, actionTaken: string) =>
    apiRequest(`/admin/reports/${id}/resolve`, {
      method: "PUT",
      body: JSON.stringify({ actionTaken }),
    }),

  getAnalytics: () => apiRequest("/admin/analytics"),
};

