"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { jobsApi, authApi, apiRequest } from "@/lib/api";
import { mockJobs } from "@/data/mockJobs";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.getProfile();
      if (res.success && res.data) {
        const rawList = res.data.savedJobs || [];
        const resolvedList = await Promise.all(
          rawList.map(async (item: any) => {
            if (typeof item === "object" && item !== null && item.title) {
              return item;
            }
            const jobId = typeof item === "object" ? (item._id || item.id) : String(item);
            try {
              const jRes = await jobsApi.getJobById(jobId);
              if (jRes.success && jRes.data) {
                return jRes.data;
              }
            } catch (e) {
              console.log("Error resolving job detail for:", jobId);
            }
            const foundMock = mockJobs.find((m) => String(m.id) === String(jobId));
            if (foundMock) return foundMock;
            return { _id: jobId, title: "Senior Developer", company: "Acme Corp", location: "Delhi", salary: "$12,300/yr" };
          })
        );
        setSavedJobs(resolvedList);
      }
    } catch (err) {
      console.error("Error loading saved jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleUnsaveJob = async (jobId: string) => {
    try {
      const res = await apiRequest(`/users/jobs/${jobId}/save`, {
        method: "DELETE",
      });

      if (res.success) {
        setSavedJobs((prev) => prev.filter((j) => (j._id || j.id) !== jobId));
      }
    } catch (err) {
      setSavedJobs((prev) => prev.filter((j) => (j._id || j.id) !== jobId));
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>Loading saved jobs…</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", padding: "40px 20px 80px" }}>
      <div className="container-main" style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "6px" }}>
            🔖 Saved Jobs
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Your bookmarked opportunities ready for application
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "54px 24px",
              textAlign: "center",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🔖</div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              No Saved Jobs Yet
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "420px", margin: "0 auto 24px" }}>
              Bookmark interesting job postings as you browse so you can review and apply to them later.
            </p>
            <Link
              href="/jobs"
              className="btn-primary"
              style={{ padding: "12px 28px", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}
            >
              Explore Job Postings →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {savedJobs.map((job) => {
              const jobId = job._id || job.id;
              return (
                <div
                  key={jobId}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "240px" }}>
                    <Link href={`/jobs/${jobId}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }} className="hover-underline">
                        {job.title}
                      </h3>
                    </Link>

                    <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem", color: "var(--text-secondary)", flexWrap: "wrap", marginTop: "4px" }}>
                      <span style={{ fontWeight: 700, color: "#4f46e5" }}>{job.company || "Company"}</span>
                      <span>•</span>
                      <span>📍 {job.location || "Remote"}</span>
                      <span>•</span>
                      <span>💰 {job.salary ? (typeof job.salary === "number" ? `$${job.salary.toLocaleString()}/yr` : job.salary) : "Competitive"}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => handleUnsaveJob(jobId)}
                      style={{
                        padding: "9px 14px",
                        borderRadius: "10px",
                        background: "rgba(220,38,38,0.08)",
                        border: "1px solid rgba(220,38,38,0.2)",
                        color: "#b91c1c",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Remove 🗑️
                    </button>

                    <Link
                      href={`/jobs/${jobId}/apply`}
                      className="btn-primary"
                      style={{
                        padding: "9px 22px",
                        borderRadius: "10px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Apply Now →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
