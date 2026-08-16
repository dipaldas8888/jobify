import { apiRequest } from "./client";

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
