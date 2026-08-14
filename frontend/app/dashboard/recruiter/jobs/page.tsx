"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { jobsApi, dashboardApi } from "@/lib/api";
import { useAppSelector } from "@/lib/redux/store";

interface JobItem {
  id: string;
  title: string;
  applicants: number;
  status: "Active" | "Paused" | "Closed" | "Published";
  posted: string;
  views: number;
  salary: string;
  location: string;
  description?: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Published: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Paused: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Closed: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

export default function RecruiterJobsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState<"All" | "Active" | "Paused" | "Closed">("All");
  const [search, setSearch] = useState("");

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Post Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [jobExperience, setJobExperience] = useState("Mid Level");
  const [jobDescription, setJobDescription] = useState("");
  const [whatYouWillDo, setWhatYouWillDo] = useState("");
  const [skills, setSkills] = useState("React, Node.js, TypeScript");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user?.companyName) {
      setCompanyName(user.companyName);
    }
  }, [user]);

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    setIsLoading(true);
    try {
      const res = await dashboardApi.getRecruiterDashboard();
      if (res.success) {
        const rawList = res.dashboard?.jobs || res.data?.allJobs || res.data?.activeJobs || [];
        const formatted: JobItem[] = rawList.map((j: any) => ({
          id: j._id || j.id,
          title: j.title,
          applicants: j.applicationCount ?? j.applicantsCount ?? 0,
          status: j.status === "Published" ? "Active" : "Closed",
          posted: new Date(j.createdAt).toLocaleDateString(),
          views: 120,
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive",
          location: j.location || "Remote",
          description: j.description,
        }));
        setJobs(formatted);
      }
    } catch (err) {
      console.log("Error loading recruiter jobs:", err);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const res = await jobsApi.deleteJob(jobId);
      if (res.success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        alert(res.message || "Failed to delete job.");
      }
    } catch (err: any) {
      // Local fallback removal for demo
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalMsg(null);

    const token = typeof window !== "undefined" ? localStorage.getItem("jobify_token") : null;
    if (!user || !token) {
      setModalMsg({
        type: "error",
        text: "You are not logged in. Please sign in to your recruiter account first to post jobs.",
      });
      return;
    }

    if (!jobTitle || !jobLocation || !jobDescription) {
      setModalMsg({ type: "error", text: "Please fill in job title, location, and description." });
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsRequired = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const fullDescription = whatYouWillDo.trim()
        ? `${jobDescription.trim()}\n\nWhat You Will Do:\n${whatYouWillDo.trim()}`
        : jobDescription.trim();

      const payload = {
        title: jobTitle,
        company: companyName.trim() || user?.companyName || "Acme Corp",
        location: jobLocation,
        salary: Number(jobSalary) || 120000,
        experience: jobExperience,
        skillsRequired,
        jobType,
        description: fullDescription,
        status: "Published",
      };

      const res = await jobsApi.createJob(payload);
      if (res.success) {
        setModalMsg({ type: "success", text: "Job posted successfully to live database!" });
        const created = res.data;
        const newJobItem: JobItem = {
          id: created?._id || String(Date.now()),
          title: jobTitle,
          applicants: 0,
          status: "Active",
          posted: "Just now",
          views: 1,
          salary: jobSalary ? `$${Number(jobSalary).toLocaleString()}/yr` : "Competitive",
          location: jobLocation,
          description: jobDescription,
        };
        setJobs((prev) => [newJobItem, ...prev]);

        setTimeout(() => {
          setShowPostModal(false);
          setJobTitle("");
          setJobDescription("");
        }, 1200);
      } else {
        const errorText = res.message?.includes("token")
          ? "You are not logged in. Please sign in to your recruiter account to post jobs."
          : res.message || "Failed to post job.";
        setModalMsg({ type: "error", text: errorText });
      }
    } catch (err: any) {
      setModalMsg({ type: "error", text: err.message || "Error posting job." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesFilter = filter === "All" || j.status === filter;
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    All: jobs.length,
    Active: jobs.filter((j) => j.status === "Active" || j.status === "Published").length,
    Paused: jobs.filter((j) => j.status === "Paused").length,
    Closed: jobs.filter((j) => j.status === "Closed").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Header actions */}
      <div className="recruiter-jobs-header">
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", maxWidth: "100%" }}>
          {(["All", "Active", "Paused", "Closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              type="button"
              style={{
                padding: "7px 16px",
                borderRadius: "50px",
                border: filter === f ? "1px solid rgba(79,70,229,0.3)" : "1px solid var(--border)",
                background: filter === f ? "rgba(79,70,229,0.08)" : "#ffffff",
                color: filter === f ? "#4338ca" : "var(--text-secondary)",
                fontWeight: filter === f ? 700 : 500,
                fontSize: "0.825rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                whiteSpace: "nowrap",
              }}
            >
              {f} <span style={{ opacity: 0.7 }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        <div className="recruiter-jobs-search-container">
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ padding: "9px 14px", borderRadius: "10px" }}
            aria-label="Search job postings"
          />
          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              setShowPostModal(true);
              setModalMsg(null);
            }}
            style={{ padding: "9px 20px", borderRadius: "10px", fontSize: "0.875rem" }}
          >
            + Post New Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="table-responsive-wrapper">
          <div className="table-min-width">
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 100px 80px 100px 140px",
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
            background: "#f8fafc",
          }}
        >
          {["Job Title", "Location", "Applicants", "Views", "Status", "Actions"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
            <p>No jobs match your filters.</p>
          </div>
        ) : (
          filtered.map((job, i) => {
            const sc = statusColors[job.status] || statusColors.Active;
            return (
              <div
                key={job.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 100px 80px 100px 140px",
                  padding: "16px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center",
                  transition: "background 0.2s",
                }}
              >
                <div>
                  <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "3px" }} className="hover-underline">
                      {job.title}
                    </p>
                  </Link>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{job.salary} · Posted {job.posted}</p>
                </div>
                <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>{job.location}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{job.applicants}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{job.views.toLocaleString()}</div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "50px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: sc.bg,
                    color: sc.text,
                    border: `1px solid ${sc.border}`,
                    width: "fit-content",
                  }}
                >
                  {job.status}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Link
                    href={`/jobs/${job.id}`}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "7px",
                      background: "rgba(79,70,229,0.08)",
                      border: "1px solid rgba(79,70,229,0.2)",
                      color: "#4338ca",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job.id)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "7px",
                      background: "rgba(220,38,38,0.08)",
                      border: "1px solid rgba(220,38,38,0.2)",
                      color: "#b91c1c",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {jobs.length} jobs
      </p>

      {/* Post Job Modal */}
      {showPostModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "32px",
              width: "100%",
              maxWidth: "540px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              border: "1px solid var(--border)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            className="animate-fade-in-up"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>
                Post a New Job
              </h3>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {modalMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                  background: modalMsg.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
                  color: modalMsg.type === "success" ? "#047857" : "#b91c1c",
                  border: `1px solid ${modalMsg.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                {modalMsg.type === "success" ? "✅ " : "⚠️ "}{modalMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateJob} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "10px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "10px" }}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco or Remote"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "10px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    placeholder="130000"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "10px" }}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    Experience Level
                  </label>
                  <select
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, TypeScript"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  Job Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed job summary and requirements..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px", resize: "vertical" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                  What You Will Do (Responsibilities)
                </label>
                <textarea
                  rows={3}
                  placeholder="Key day-to-day responsibilities, tasks, and team role..."
                  value={whatYouWillDo}
                  onChange={(e) => setWhatYouWillDo(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: "10px", padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{ borderRadius: "10px", padding: "10px 24px", opacity: isSubmitting ? 0.6 : 1 }}
                >
                  {isSubmitting ? "Posting Job..." : "Publish Job →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
