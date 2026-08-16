import { apiRequest } from "./client";

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
