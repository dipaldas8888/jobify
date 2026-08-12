"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/store";
import { dashboardApi, jobsApi } from "@/lib/api";

const initialStats = [
  { label: "Jobs Posted", value: "0", change: "+0", trend: "up", icon: "💼", color: "#4f46e5" },
  { label: "Applications", value: "0", change: "+0", trend: "up", icon: "📋", color: "#0284c7" },
  { label: "Interviews", value: "0", change: "+0", trend: "up", icon: "🤝", color: "#059669" },
  { label: "Hired This Month", value: "0", change: "+0", trend: "up", icon: "🎉", color: "#d97706" },
];

const pipeline = [
  { stage: "Applied", count: 0, color: "#4f46e5" },
  { stage: "Screening", count: 0, color: "#0284c7" },
  { stage: "Interview", count: 0, color: "#d97706" },
  { stage: "Offer", count: 0, color: "#059669" },
  { stage: "Hired", count: 0, color: "#10b981" },
];

const topCandidates = [
  { name: "Jordan Lee", role: "Frontend Engineer", score: 94, skills: ["React", "TypeScript"] },
  { name: "Maya Patel", role: "Product Manager", score: 91, skills: ["Strategy", "Analytics"] },
  { name: "Ryan Chen", role: "Backend Developer", score: 88, skills: ["Go", "PostgreSQL"] },
  { name: "Sofia Rodriguez", role: "UX Designer", score: 86, skills: ["Figma", "User Research"] },
];

function StatCard({ stat }: { stat: typeof initialStats[0] }) {
  return (
    <div
      className="dashboard-card"
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "4px" }}>
            {stat.label}
          </p>
          <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}>
            {stat.value}
          </p>
        </div>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${stat.color}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            border: `1px solid ${stat.color}25`,
          }}
        >
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

export default function RecruiterOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [statsData, setStatsData] = useState(initialStats);
  const [jobsList, setJobsList] = useState<any[]>([]);

  // Post Job Modal State
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

  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user?.companyName) {
      setCompanyName(user.companyName);
    }
  }, [user]);

  useEffect(() => {
    dashboardApi.getRecruiterDashboard().then((res) => {
      if (res.success) {
        const dJobs = res.dashboard?.jobs || res.data?.allJobs || [];
        const totalApps = res.dashboard?.stats?.totalApplications ?? res.data?.totalApplicants ?? 0;
        const totalJobsCount = dJobs.length || res.dashboard?.stats?.totalJobs || 0;

        setStatsData([
          { label: "Jobs Posted", value: String(totalJobsCount), change: "+1", trend: "up", icon: "💼", color: "#4f46e5" },
          { label: "Applications", value: String(totalApps), change: "+4", trend: "up", icon: "📋", color: "#0284c7" },
          { label: "Interviews", value: String(res.data?.interviews?.length || 2), change: "+2", trend: "up", icon: "🤝", color: "#059669" },
          { label: "Hired This Month", value: "3", change: "+1", trend: "up", icon: "🎉", color: "#d97706" },
        ]);

        if (Array.isArray(dJobs) && dJobs.length > 0) {
          setJobsList(
            dJobs.map((j: any) => ({
              title: j.title,
              applicants: j.applicationCount ?? j.applicantsCount ?? 0,
              status: j.status === "Published" ? "Active" : "Draft",
              posted: new Date(j.createdAt).toLocaleDateString(),
              views: 120,
            }))
          );
        }
      }
    });
  }, []);

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
      setModalMsg({ type: "error", text: "Please fill in title, location, and description." });
      return;
    }

    setIsSubmittingJob(true);

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
        setJobsList((prev) => [
          { title: jobTitle, applicants: 0, status: "Active", posted: "Just now", views: 1 },
          ...prev,
        ]);
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
      setIsSubmittingJob(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(2,132,199,0.04) 100%)",
          border: "1px solid rgba(79,70,229,0.15)",
          borderRadius: "16px",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div>
          <h2 style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)", fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
            Welcome back, {user?.name || "Sarah"} 👋
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Manage job postings, track candidates, and streamline your hiring process.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowPostModal(true);
            setModalMsg(null);
          }}
          className="btn-primary"
          style={{ padding: "10px 22px", fontSize: "0.875rem" }}
        >
          + Post New Job
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {statsData.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>

        {/* Recent Job Postings */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Recent Job Postings</h3>
            <Link href="/dashboard/recruiter/jobs" style={{ fontSize: "0.8rem", color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
          </div>
          <div>
            {jobsList.map((job, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 24px",
                  borderBottom: i < jobsList.length - 1 ? "1px solid var(--border)" : "none",
                  gap: "12px",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "3px" }}>{job.title}</p>
                  <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                    {job.applicants} applicants · {job.views.toLocaleString()} views · {job.posted}
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "50px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: job.status === "Active" ? "rgba(5,150,105,0.08)" : "rgba(217,119,6,0.08)",
                    color: job.status === "Active" ? "#047857" : "#b45309",
                    border: `1px solid ${job.status === "Active" ? "rgba(5,150,105,0.2)" : "rgba(217,119,6,0.2)"}`,
                  }}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Application Pipeline */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "16px" }}>Application Pipeline</h3>
            {pipeline.map((stage, i) => {
              const pct = Math.round((stage.count / 847) * 100);
              return (
                <div key={stage.stage} style={{ marginBottom: i < pipeline.length - 1 ? "10px" : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>{stage.stage}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 700 }}>{stage.count}</span>
                  </div>
                  <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: stage.color,
                        borderRadius: "3px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Candidates */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Top Candidates</h3>
              <Link href="/dashboard/recruiter/candidates" style={{ fontSize: "0.8rem", color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
            </div>
            {topCandidates.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f46e5, #0284c7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{c.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.role}</p>
                </div>
                <div
                  style={{
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "rgba(5,150,105,0.08)",
                    color: "#047857",
                    border: "1px solid rgba(5,150,105,0.2)",
                  }}
                >
                  {c.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                  background: modalMsg.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
                  color: modalMsg.type === "success" ? "#047857" : "#b91c1c",
                  border: `1px solid ${modalMsg.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                {modalMsg.type === "success" ? "✅ " : "⚠️ "}{modalMsg.text}
                {!user && (
                  <div style={{ marginTop: "8px" }}>
                    <Link href="/auth/login" style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: 700 }}>
                      Click here to Sign In as Recruiter →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleCreateJob} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                  disabled={isSubmittingJob}
                  style={{ borderRadius: "10px", padding: "10px 24px", opacity: isSubmittingJob ? 0.6 : 1 }}
                >
                  {isSubmittingJob ? "Posting Job..." : "Publish Job →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
