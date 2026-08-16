import { apiRequest } from "./client";

export const dashboardApi = {
  getRecruiterDashboard: () => apiRequest("/users/dashboard/recruiter"),
  getCandidateDashboard: () => apiRequest("/users/dashboard/candidate"),
  getCompanyProfile: () => apiRequest("/users/company-profile"),
  updateCompanyProfile: (data: any) =>
    apiRequest("/users/company-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
