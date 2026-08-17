"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { jobsApi, dashboardApi } from "@/lib/api";
import { useAppSelector } from "@/lib/redux/store";
import CsvImportModal from "@/components/dashboard/CsvImportModal";

interface JobItem {
  id: string;
  title: string;
  company: string;
  applicants: number;
  status: "Active" | "Paused" | "Closed" | "Published";
  posted: string;
  views: number;
  salary: string;
  location: string;
  description?: string;
  jobType?: string;
  experience?: string;
  skillsRequired?: string[];
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

  // Post Modal State
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

  // CSV Import Modal
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editStatus, setEditStatus] = useState("Published");
  const [editJobType, setEditJobType] = useState("Full Time");
  const [editExperience, setEditExperience] = useState("Mid Level");
  const [editSkills, setEditSkills] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWhatYouWillDo, setEditWhatYouWillDo] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [editModalMsg, setEditModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
          company: j.company || user?.companyName || "Acme Corp",
          applicants: j.applicationCount ?? j.applicantsCount ?? 0,
          status: j.status === "Published" ? "Active" : j.status || "Active",
          posted: new Date(j.createdAt || Date.now()).toLocaleDateString(),
          views: j.views || 120,
          salary: j.salary ? (typeof j.salary === "number" ? `$${j.salary.toLocaleString()}/yr` : String(j.salary)) : "Competitive",
          location: j.location || "Remote",
          description: j.description || "",
          jobType: j.jobType || "Full Time",
          experience: j.experience || "Mid Level",
          skillsRequired: Array.isArray(j.skillsRequired) ? j.skillsRequired : [],
        }));
        setJobs(formatted);
      }
    } catch (err) {
      console.error("Error loading recruiter jobs:", err);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (job: JobItem) => {
    setEditingJobId(job.id);
    setEditTitle(job.title);
    setEditCompany(job.company);
    setEditLocation(job.location);

    // Extract numeric salary if needed
    const numericSalary = job.salary.replace(/[^0-9]/g, "");
    setEditSalary(numericSalary || "120000");

    setEditStatus(job.status === "Active" ? "Published" : job.status);
    setEditJobType(job.jobType || "Full Time");
    setEditExperience(job.experience || "Mid Level");
    setEditSkills(job.skillsRequired ? job.skillsRequired.join(", ") : "React, Node.js");

    const descParts = (job.description || "").split("\n\nWhat You Will Do:\n");
    setEditDescription(descParts[0] || "");
    setEditWhatYouWillDo(descParts[1] || "");

    setEditModalMsg(null);
    setShowEditModal(true);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJobId) return;
    setEditModalMsg(null);

    if (!editTitle || !editLocation || !editDescription) {
      setEditModalMsg({ type: "error", text: "Please fill in job title, location, and description." });
      return;
    }

    setIsUpdating(true);

    try {
      const skillsRequired = editSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const fullDescription = editWhatYouWillDo.trim()
        ? `${editDescription.trim()}\n\nWhat You Will Do:\n${editWhatYouWillDo.trim()}`
        : editDescription.trim();

      const payload = {
        title: editTitle,
        company: editCompany.trim() || user?.companyName || "Acme Corp",
        location: editLocation,
        salary: Number(editSalary) || 120000,
        experience: editExperience,
        skillsRequired,
        jobType: editJobType,
        description: fullDescription,
        status: editStatus,
      };

      const res = await jobsApi.updateJob(editingJobId, payload);
      if (res.success) {
        setEditModalMsg({ type: "success", text: "🎉 Job details updated successfully!" });

        setJobs((prev) =>
          prev.map((j) => {
            if (j.id === editingJobId) {
              return {
                ...j,
                title: editTitle,
                company: payload.company,
                location: editLocation,
                salary: editSalary ? `$${Number(editSalary).toLocaleString()}/yr` : "Competitive",
                status: editStatus === "Published" ? "Active" : (editStatus as any),
                description: fullDescription,
                jobType: editJobType,
                experience: editExperience,
                skillsRequired,
              };
            }
            return j;
          })
        );

        setTimeout(() => {
          setShowEditModal(false);
          setEditingJobId(null);
        }, 1200);
      } else {
        setEditModalMsg({ type: "error", text: res.message || "Failed to update job details." });
      }
    } catch (err: any) {
      setEditModalMsg({ type: "error", text: err.message || "Error updating job details." });
    } finally {
      setIsUpdating(false);
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
        text: "You must be signed in to your recruiter account to post jobs.",
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
        setModalMsg({ type: "success", text: "🎉 Job published successfully!" });
        const created = res.data;
        const newJobItem: JobItem = {
          id: created?._id || String(Date.now()),
          title: jobTitle,
          company: payload.company,
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
          setWhatYouWillDo("");
        }, 1200);
      } else {
        setModalMsg({ type: "error", text: res.message || "Failed to post job." });
      }
    } catch (err: any) {
      setModalMsg({ type: "error", text: err.message || "Error posting job." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = jobs.filter((j) => {
    const matchesFilter = filter === "All" || j.status === filter;
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    All: jobs.length,
    Active: jobs.filter((j) => j.status === "Active" || j.status === "Published").length,
    Paused: jobs.filter((j) => j.status === "Paused").length,
    Closed: jobs.filter((j) => j.status === "Closed").length,
  };

  const totalApplicants = jobs.reduce((acc, curr) => acc + curr.applicants, 0);
  const totalViews = jobs.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Stat Summary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px 24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Total Job Postings
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "6px" }}>
            {jobs.length}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px 24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Active Openings
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#047857", marginTop: "6px" }}>
            {counts.Active}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px 24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Total Applicants
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#4f46e5", marginTop: "6px" }}>
            {totalApplicants}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px 24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Job Views
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0369a1", marginTop: "6px" }}>
            {totalViews}
          </div>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          background: "#ffffff",
          padding: "16px 20px",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Status Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
          {(["All", "Active", "Paused", "Closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              type="button"
              style={{
                padding: "8px 18px",
                borderRadius: "50px",
                border: filter === f ? "1px solid rgba(79,70,229,0.3)" : "1px solid var(--border)",
                background: filter === f ? "rgba(79,70,229,0.08)" : "#ffffff",
                color: filter === f ? "#4338ca" : "var(--text-secondary)",
                fontWeight: filter === f ? 700 : 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {f} <span style={{ opacity: 0.7 }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Search & Post Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, justifyContent: "flex-end", minWidth: "280px" }}>
          <input
            type="text"
            placeholder="Search job title or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ padding: "10px 16px", borderRadius: "12px", maxWidth: "320px", flex: 1 }}
            aria-label="Search job postings"
          />

          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              setShowPostModal(true);
              setModalMsg(null);
            }}
            style={{ padding: "10px 22px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            + Post New Job
          </button>

          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#6366f1",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📂 Import CSV
          </button>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <CsvImportModal
          onClose={() => setShowCsvModal(false)}
          onSuccess={() => {
            fetchRecruiterJobs();
          }}
        />
      )}

      {/* Main Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="table-responsive-wrapper">
          <div className="table-min-width">
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1fr 100px 80px 110px 180px",
                padding: "14px 24px",
                borderBottom: "1px solid var(--border)",
                background: "#f8fafc",
              }}
            >
              {["Job Title", "Location", "Applicants", "Views", "Status", "Actions"].map((col) => (
                <div key={col} style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {col}
                </div>
              ))}
            </div>

            {/* Table Content */}
            {isLoading ? (
              <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                Loading job postings…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "54px 24px", textAlign: "center", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💼</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  No Job Postings Found
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  Publish your first job posting to start receiving candidate applications.
                </p>
              </div>
            ) : (
              filtered.map((job, i) => {
                const sc = statusColors[job.status] || statusColors.Active;
                return (
                  <div
                    key={job.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.8fr 1fr 100px 80px 110px 180px",
                      padding: "18px 24px",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <div>
                      <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "4px" }} className="hover-underline">
                          {job.title}
                        </p>
                      </Link>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {job.salary} · Posted {job.posted}
                      </p>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                      📍 {job.location}
                    </div>

                    <div>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "50px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          background: "rgba(79,70,229,0.08)",
                          color: "#4338ca",
                        }}
                      >
                        {job.applicants} Applied
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                      {job.views.toLocaleString()}
                    </div>

                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "50px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          background: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link
                        href={`/jobs/${job.id}`}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background: "rgba(79,70,229,0.08)",
                          border: "1px solid rgba(79,70,229,0.2)",
                          color: "#4338ca",
                          fontSize: "0.78rem",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => openEditModal(job)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background: "rgba(2,132,199,0.08)",
                          border: "1px solid rgba(2,132,199,0.2)",
                          color: "#0369a1",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background: "rgba(220,38,38,0.08)",
                          border: "1px solid rgba(220,38,38,0.2)",
                          color: "#b91c1c",
                          fontSize: "0.78rem",
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

      {/* Footer Info */}
      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {jobs.length} job postings
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
              borderRadius: "24px",
              padding: "32px",
              width: "100%",
              maxWidth: "560px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
              border: "1px solid var(--border)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            className="animate-fade-in-up"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)", margin: 0 }}>
                  Publish Job Posting
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Create and post a new opportunity to receive applicant profiles
                </p>
              </div>
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
                  marginBottom: "18px",
                  background: modalMsg.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
                  color: modalMsg.type === "success" ? "#047857" : "#b91c1c",
                  border: `1px solid ${modalMsg.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                {modalMsg.type === "success" ? "✅ " : "⚠️ "}{modalMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateJob} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco or Remote"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    placeholder="130000"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "12px", padding: "10px" }}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Experience Level
                  </label>
                  <select
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "12px", padding: "10px" }}
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, TypeScript"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Job Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of expectations, role requirements, and company mission…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px", resize: "vertical" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  What You Will Do (Responsibilities)
                </label>
                <textarea
                  rows={3}
                  placeholder="Key day-to-day responsibilities and projects…"
                  value={whatYouWillDo}
                  onChange={(e) => setWhatYouWillDo(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: "12px", padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{ borderRadius: "12px", padding: "10px 26px", opacity: isSubmitting ? 0.6 : 1, fontWeight: 700 }}
                >
                  {isSubmitting ? "Publishing…" : "Publish Job →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && (
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
              borderRadius: "24px",
              padding: "32px",
              width: "100%",
              maxWidth: "560px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
              border: "1px solid var(--border)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            className="animate-fade-in-up"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)", margin: 0 }}>
                  Edit Job Posting
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Update posting details, salary, requirements, or status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {editModalMsg && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "18px",
                  background: editModalMsg.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
                  color: editModalMsg.type === "success" ? "#047857" : "#b91c1c",
                  border: `1px solid ${editModalMsg.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                {editModalMsg.type === "success" ? "✅ " : "⚠️ "}{editModalMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateJob} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="search-input"
                    style={{ borderRadius: "12px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "12px", padding: "10px" }}
                  >
                    <option value="Published">Active / Published</option>
                    <option value="Paused">Paused</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Job Type
                  </label>
                  <select
                    value={editJobType}
                    onChange={(e) => setEditJobType(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "12px", padding: "10px" }}
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Experience
                  </label>
                  <select
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    className="filter-select"
                    style={{ width: "100%", borderRadius: "12px", padding: "10px" }}
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Job Description *
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px", resize: "vertical" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  What You Will Do (Responsibilities)
                </label>
                <textarea
                  rows={3}
                  value={editWhatYouWillDo}
                  onChange={(e) => setEditWhatYouWillDo(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                  style={{ borderRadius: "12px", padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isUpdating}
                  style={{ borderRadius: "12px", padding: "10px 26px", opacity: isUpdating ? 0.6 : 1, fontWeight: 700 }}
                >
                  {isUpdating ? "Saving Changes…" : "Save Changes →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
