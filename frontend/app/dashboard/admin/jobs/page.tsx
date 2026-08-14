"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";

interface JobItem {
  _id: string;
  id?: string;
  title: string;
  company?: string;
  companyName?: string;
  recruiter?: {
    name?: string;
    email?: string;
    companyName?: string;
  };
  location: string;
  salary?: string;
  status?: string;
  createdAt: string;
  applicationCount?: number;
  applicantsCount?: number;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Pending: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.25)" },
  Published: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Active: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Closed: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | "Pending" | "Active" | "Closed">("All");
  const [search, setSearch] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getJobs();
      if (res.success) {
        const list = res.data || res.jobs || [];
        setJobs(list);
      }
    } catch (err) {
      console.error("Error fetching admin jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveJob = async (job: JobItem) => {
    const jobId = job._id || job.id || "";
    try {
      const res = await adminApi.approveJob(jobId);
      if (res.success) {
        setActionMsg(`Job "${job.title}" has been approved and published live!`);
        setJobs((prev) =>
          prev.map((j) => ((j._id || j.id) === jobId ? { ...j, status: "Published" } : j))
        );
        setTimeout(() => setActionMsg(null), 4000);
      } else {
        alert(res.message || "Failed to approve job.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to approve job.");
    }
  };

  const handleDeleteJob = async (job: JobItem) => {
    const jobId = job._id || job.id || "";
    if (!confirm(`Are you sure you want to remove the job listing "${job.title}"?`)) return;

    try {
      const res = await adminApi.deleteJob(jobId);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => (j._id || j.id) !== jobId));
      } else {
        alert(res.message || "Failed to remove job.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove job.");
    }
  };

  const pendingJobsCount = jobs.filter((j) => j.status === "Pending").length;
  const activeJobsCount = jobs.filter((j) => j.status === "Published" || j.status === "Active" || !j.status).length;
  const closedJobsCount = jobs.filter((j) => j.status === "Closed" || j.status === "Draft").length;

  const filtered = jobs.filter((j) => {
    const currentStatus = j.status || "Published";
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && currentStatus === "Pending") ||
      (filter === "Active" && (currentStatus === "Published" || currentStatus === "Active")) ||
      (filter === "Closed" && (currentStatus === "Closed" || currentStatus === "Draft"));

    const compName = j.companyName || j.company || j.recruiter?.companyName || j.recruiter?.name || "";
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      compName.toLowerCase().includes(search.toLowerCase()) ||
      (j.location && j.location.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Job Listings Moderation & Approval</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Review recruiter job postings, approve pending submissions, or delete non-compliant listings.</p>
        </div>
      </div>

      {actionMsg && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            background: "rgba(5,150,105,0.08)",
            border: "1px solid rgba(5,150,105,0.25)",
            color: "#047857",
            fontSize: "0.875rem",
            fontWeight: 700,
          }}
        >
          ✅ {actionMsg}
        </div>
      )}

      {/* Pending Banner Alert if pending jobs exist */}
      {pendingJobsCount > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(217,119,6,0.08), rgba(245,158,11,0.05))",
            border: "1px solid rgba(217,119,6,0.3)",
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.3rem" }}>⏳</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#b45309" }}>
                {pendingJobsCount} {pendingJobsCount === 1 ? "job posting is" : "job postings are"} awaiting admin approval
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Review and approve employer job submissions before they appear live on the job board.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilter("Pending")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              background: "#b45309",
              color: "white",
              border: "none",
              fontSize: "0.825rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Filter Pending ({pendingJobsCount})
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
        {[
          { label: "Total Job Listings", value: jobs.length, color: "#4f46e5" },
          { label: "Pending Approval", value: pendingJobsCount, color: "#d97706" },
          { label: "Active Jobs", value: activeJobsCount, color: "#059669" },
          { label: "Closed / Paused", value: closedJobsCount, color: "#dc2626" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "18px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontFamily: "var(--font-display,'Outfit',sans-serif)", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="recruiter-jobs-header">
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", maxWidth: "100%" }}>
          {(["All", "Pending", "Active", "Closed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px",
                borderRadius: "50px",
                border: filter === f ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
                background: filter === f ? "rgba(220,38,38,0.08)" : "#ffffff",
                color: filter === f ? "#b91c1c" : "var(--text-secondary)",
                fontWeight: filter === f ? 700 : 500,
                fontSize: "0.825rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                whiteSpace: "nowrap",
              }}
            >
              {f === "Pending" ? "Pending Approval ⏳" : f}{" "}
              <span style={{ opacity: 0.7 }}>
                ({f === "All" ? jobs.length : f === "Pending" ? pendingJobsCount : f === "Active" ? activeJobsCount : closedJobsCount})
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search job title, company, or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ width: "240px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search jobs"
        />
      </div>

      {/* Jobs Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="table-responsive-wrapper">
          <div className="table-min-width">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 120px 160px", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
              {["Job Title / Employer", "Location", "Applicants", "Status", "Actions"].map((col) => (
                <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
              ))}
            </div>

            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p style={{ fontWeight: 600 }}>Loading job listings from server...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p>No job postings found matching your filters.</p>
              </div>
            ) : (
              filtered.map((job, i) => {
                const compName = job.companyName || job.company || job.recruiter?.companyName || job.recruiter?.name || "Independent Employer";
                const isPending = job.status === "Pending";
                const isJobActive = job.status === "Published" || job.status === "Active";
                const sc = isPending ? statusColors.Pending : isJobActive ? statusColors.Published : statusColors.Closed;
                const applicants = job.applicationCount ?? job.applicantsCount ?? 0;

                return (
                  <div
                    key={job._id || job.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 140px 90px 120px 160px",
                      padding: "14px 20px",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center",
                      background: isPending ? "rgba(217,119,6,0.03)" : "transparent",
                    }}
                  >
                    <div>
                      <Link href={`/jobs/${job._id || job.id}`} style={{ textDecoration: "none" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }} className="hover-underline">
                          {job.title}
                        </p>
                      </Link>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        🏢 {compName} {job.createdAt && `· Submitted ${new Date(job.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>

                    <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                      {job.location || "Remote"}
                    </span>

                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {applicants}
                    </span>

                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, width: "fit-content" }}>
                      {isPending ? "Pending Approval" : isJobActive ? "Active" : "Closed"}
                    </span>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleApproveJob(job)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: "#059669",
                            color: "white",
                            border: "none",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 700,
                            boxShadow: "0 2px 4px rgba(5,150,105,0.2)",
                          }}
                        >
                          Approve ✅
                        </button>
                      ) : (
                        <Link
                          href={`/jobs/${job._id || job.id}`}
                          style={{ padding: "5px 10px", borderRadius: "7px", background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.2)", color: "#4338ca", fontSize: "0.72rem", textDecoration: "none", fontWeight: 600 }}
                        >
                          View
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job)}
                        style={{ padding: "5px 10px", borderRadius: "7px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.72rem", cursor: "pointer", fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {jobs.length} jobs
      </p>
    </div>
  );
}
