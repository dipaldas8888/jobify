"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { mockJobs, type Job, type JobType, type ExperienceLevel } from "@/data/mockJobs";
import { jobsApi, authApi, apiRequest } from "@/lib/api";
import { useAppSelector } from "@/lib/redux/store";
import { toast } from "react-toastify";

const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Director",
];

// Helper to format recruiter description into clean structured sections with bullets
function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections: { title?: string; items: string[] }[] = [];
  let currentSection: { title?: string; items: string[] } = { items: [] };

  lines.forEach((line) => {
    const isHeader =
      line.endsWith(":") ||
      /^(what you|responsibilities|requirements|qualifications|about the role|overview|perks|benefits|skills|who you are|program highlights|highlights)/i.test(
        line
      );

    if (isHeader && currentSection.items.length > 0) {
      sections.push(currentSection);
      currentSection = { title: line.replace(/:$/, ""), items: [] };
    } else if (isHeader) {
      currentSection.title = line.replace(/:$/, "");
    } else {
      currentSection.items.push(line);
    }
  });

  if (currentSection.items.length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {sections.map((sec, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sec.title && (
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1e293b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📌</span> {sec.title}
            </h4>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sec.items.map((item, i) => {
              const isBullet = item.startsWith("-") || item.startsWith("•") || item.startsWith("*");
              const cleanItem = item.replace(/^[-•*]\s*/, "");

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#475569",
                    lineHeight: 1.6,
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#2563eb",
                      marginTop: "9px",
                      flexShrink: 0,
                    }}
                  />
                  <p style={{ margin: 0, flex: 1 }}>{cleanItem}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ width: "30%", height: "16px", background: "#e2e8f0", borderRadius: "6px" }} />
        <div style={{ width: "20px", height: "20px", background: "#e2e8f0", borderRadius: "4px" }} />
      </div>
      <div style={{ width: "65%", height: "22px", background: "#e2e8f0", borderRadius: "6px", marginBottom: "10px" }} />
      <div style={{ width: "45%", height: "16px", background: "#e2e8f0", borderRadius: "6px", marginBottom: "14px" }} />
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "80px", height: "24px", background: "#e2e8f0", borderRadius: "6px" }} />
        <div style={{ width: "70px", height: "24px", background: "#e2e8f0", borderRadius: "6px" }} />
      </div>
    </div>
  );
}

export default function JobsPage() {

  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedExp, setSelectedExp] = useState<ExperienceLevel | "">("");
  const [minSalaryFilter, setMinSalaryFilter] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"recent" | "salary" | "applicants">("recent");

  // Selection & UI State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [dislikedJobIds, setDislikedJobIds] = useState<Set<string>>(new Set());
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [showMobileDetailModal, setShowMobileDetailModal] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 10;

  // Backend Data State
  const [backendJobs, setBackendJobs] = useState<Job[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Apply Modal State
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appMessage, setAppMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchBackendJobs();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyApplications();
      fetchSavedJobs();
    }
  }, [user]);

  const fetchMyApplications = async () => {
    try {
      const res = await jobsApi.getMyApplications();
      if (res.success && Array.isArray(res.data)) {
        const ids = new Set<string>();
        res.data.forEach((app: any) => {
          const appId = typeof app.job === "object" ? (app.job._id || app.job.id) : app.job;
          if (appId) ids.add(String(appId));
        });
        setAppliedJobIds(ids);
      }
    } catch (err) {
      console.error("Failed to load user applications:", err);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.success && res.data && Array.isArray(res.data.savedJobs)) {
        const ids = new Set<string>();
        res.data.savedJobs.forEach((j: any) => {
          const savedId = typeof j === "object" ? (j._id || j.id) : j;
          if (savedId) ids.add(String(savedId));
        });
        setSavedJobIds(ids);
      }
    } catch (err) {
      console.log("Error loading saved jobs:", err);
    }
  };

  const fetchBackendJobs = async () => {
    setIsLoadingBackend(true);
    try {
      const res = await jobsApi.getJobs();
      const rawList = Array.isArray(res.data) ? res.data : Array.isArray(res.jobs) ? res.jobs : [];
      if (res.success && rawList.length > 0) {
        const formatted: Job[] = rawList.map((j: any) => ({
          id: j._id || j.id,
          title: j.title,
          company: j.company || (j.recruiter?.companyName) || "Jobify Recruiter",
          location: j.location || "Remote",
          type: (j.jobType as JobType) || "Full-time",
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive Salary",
          experience: (j.experience as ExperienceLevel) || "Mid Level",
          description: j.description || "",
          tags: j.skillsRequired && j.skillsRequired.length > 0 ? j.skillsRequired : ["Engineering"],
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
          companyLogo: (j.company || "J").charAt(0),
          companyColor: "linear-gradient(135deg, #2563eb, #4f46e5)",
          applicants: j.applicantsCount || 0,
          featured: j.status === "Published",
        }));
        setBackendJobs(formatted);
      }
    } catch (err) {
      console.error("Failed to load backend jobs:", err);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  // Combine backend + fallback mock jobs
  const allJobsList = useMemo(() => {
    if (backendJobs.length > 0) return backendJobs;
    return mockJobs;
  }, [backendJobs]);

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    return allJobsList.filter((job) => {
      // Exclude disliked/hidden jobs
      if (dislikedJobIds.has(String(job.id))) return false;

      // Search query (title, company, skills)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
      }

      // Location query
      if (locationQuery.trim()) {
        const loc = locationQuery.toLowerCase();
        const matchesLocation = job.location.toLowerCase().includes(loc);
        if (!matchesLocation) return false;
      }

      // Job type filter
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(job.type)) return false;
      }

      // Experience level filter
      if (selectedExp) {
        if (job.experience !== selectedExp) return false;
      }

      // Salary filter
      if (minSalaryFilter && typeof minSalaryFilter === "number") {
        const numericSalary = parseInt(job.salary.replace(/[^0-9]/g, ""), 10) || 0;
        if (numericSalary < minSalaryFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "applicants") return b.applicants - a.applicants;
      return 0; // Default order
    });
  }, [allJobsList, searchQuery, locationQuery, selectedTypes, selectedExp, minSalaryFilter, sortBy, dislikedJobIds]);

  // Automatically select initial job if none selected
  useEffect(() => {
    if (filteredJobs.length > 0) {
      const exists = filteredJobs.some((j) => String(j.id) === String(selectedJobId));
      if (!exists) {
        setSelectedJobId(String(filteredJobs[0].id));
      }
    } else {
      setSelectedJobId(null);
    }
  }, [filteredJobs, selectedJobId]);

  // Resolved Selected Job
  const selectedJob = useMemo(() => {
    return filteredJobs.find((j) => String(j.id) === String(selectedJobId)) || filteredJobs[0] || null;
  }, [filteredJobs, selectedJobId]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
    if (typeof window !== "undefined" && window.innerWidth < 960) {
      setShowMobileDetailModal(true);
    }
  };

  const handleToggleSave = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      toast.info("Please sign in to save job postings.");
      return;
    }

    const isCurrentlySaved = savedJobIds.has(String(jobId));
    const nextSaved = new Set(savedJobIds);

    if (isCurrentlySaved) {
      nextSaved.delete(String(jobId));
      setSavedJobIds(nextSaved);
      toast.info("Job removed from saved items");
      try {
        await apiRequest(`/users/jobs/${jobId}/save`, { method: "DELETE" });
      } catch (err) {}
    } else {
      nextSaved.add(String(jobId));
      setSavedJobIds(nextSaved);
      toast.success("Job saved successfully!");
      try {
        await apiRequest(`/users/jobs/${jobId}/save`, { method: "POST" });
      } catch (err) {}
    }
  };

  const handleDislikeJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextDisliked = new Set(dislikedJobIds);
    nextDisliked.add(String(jobId));
    setDislikedJobIds(nextDisliked);
    toast.info("Job hidden from your feed");
  };

  const handleShareJob = (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/jobs/${jobId}`);
      toast.success("Job link copied to clipboard!");
    }
  };

  const handleApplyClick = (job: Job) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/jobs/${job.id}/apply`);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* ========================================================
          1. TOP INDEED-STYLE UNIFIED SEARCH HEADER
         ======================================================== */}
      <div
        style={{
          background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
          borderBottom: "1px solid #e2e8f0",
          padding: "24px 20px 20px",
        }}
      >
        <div className="container-main" style={{ maxWidth: "1200px" }}>
          {/* Main Rounded Search Bar */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "50px",
              border: "1px solid #cbd5e1",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "6px 8px 6px 20px",
              gap: "12px",
              maxWidth: "960px",
              margin: "0 auto",
              flexWrap: "wrap",
            }}
            className="unified-search-box"
          >
            {/* Input 1: Title / Company / Keyword */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "220px" }}>
              <span style={{ fontSize: "1.1rem", color: "#64748b" }}>🔍</span>
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  color: "#0f172a",
                  background: "transparent",
                }}
              />
            </div>

            {/* Divider Line */}
            <div style={{ width: "1px", height: "28px", background: "#cbd5e1" }} className="search-divider" />

            {/* Input 2: Location / Remote */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "180px" }}>
              <span style={{ fontSize: "1.1rem", color: "#64748b" }}>📍</span>
              <input
                type="text"
                placeholder="Location or Remote"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  color: "#0f172a",
                  background: "transparent",
                }}
              />
            </div>

            {/* Search Submit Button */}
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50px",
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              className="find-jobs-btn"
            >
              Find jobs
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MAIN CONTENT AREA: SPLIT SCREEN (DESKTOP) & STACKED (MOBILE)
         ======================================================== */}
      <div className="container-main" style={{ maxWidth: "1280px", marginTop: "24px" }}>
        {/* Welcome & Section Banner */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}>
            Welcome, {user?.name || "Job Seeker"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "10px",
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#1e293b",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              📷 ₹4L / yr
            </span>
            <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 600 }}>
              Showing {filteredJobs.length} matches
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
          Jobs for you
        </h3>

        {/* 2-COLUMN SPLIT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: "24px" }} className="indeed-jobs-split-grid">
          
          {/* ==========================================
              LEFT COLUMN: JOB CARDS LIST
             ========================================== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {isLoadingBackend ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[1, 2, 3, 4].map((n) => (
                  <JobCardSkeleton key={n} />
                ))}
              </div>

            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "40px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                  No Jobs Found
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 auto 16px" }}>
                  Try updating your search query or location.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setSelectedTypes([]);
                    setSelectedExp("");
                  }}
                  className="btn-secondary"
                  type="button"
                  style={{ padding: "8px 18px", borderRadius: "10px", fontSize: "0.85rem" }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              paginatedJobs.map((job) => {
                const isSelected = selectedJob && String(selectedJob.id) === String(job.id);
                const hasApplied = appliedJobIds.has(String(job.id));
                const isSaved = savedJobIds.has(String(job.id));

                return (
                  <div
                    key={job.id}
                    onClick={() => handleSelectJob(String(job.id))}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "20px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      boxShadow: isSelected
                        ? "0 8px 24px rgba(37, 99, 235, 0.12)"
                        : "0 2px 6px rgba(0, 0, 0, 0.03)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                    className="job-item-card"
                  >
                    {/* Top row badge + Bookmark & Dislike actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span
                        style={{
                          background: "rgba(37, 99, 235, 0.08)",
                          color: "#2563eb",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        Easily apply
                      </span>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(String(job.id), e)}
                          title={isSaved ? "Saved" : "Save job"}
                          style={{
                            background: isSaved ? "rgba(37,99,235,0.1)" : "none",
                            border: "none",
                            fontSize: "1.1rem",
                            cursor: "pointer",
                            padding: "4px 6px",
                            borderRadius: "6px",
                            color: isSaved ? "#2563eb" : "#64748b",
                          }}
                        >
                          {isSaved ? "🔖" : "📑"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDislikeJob(String(job.id), e)}
                          title="Hide this job"
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "1rem",
                            cursor: "pointer",
                            padding: "4px 6px",
                            color: "#94a3b8",
                          }}
                        >
                          👎
                        </button>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                      {job.title}
                    </h3>

                    {/* Company & Location */}
                    <p style={{ fontSize: "0.875rem", color: "#475569", margin: "0 0 10px", fontWeight: 500 }}>
                      {job.company} • <span style={{ color: "#64748b" }}>{job.location}</span>
                    </p>

                    {/* Green Check Badges */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <span
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          color: "#166534",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.775rem",
                          fontWeight: 700,
                        }}
                      >
                        ✓ {job.salary}
                      </span>
                      <span
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          color: "#166534",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.775rem",
                          fontWeight: 700,
                        }}
                      >
                        ✓ {job.type}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination Controls */}
            {!isLoadingBackend && filteredJobs.length > JOBS_PER_PAGE && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  ← Prev
                </button>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* ==========================================
              RIGHT COLUMN: STICKY JOB DETAIL PANEL (DESKTOP)
             ========================================== */}
          <div className="desktop-detail-panel">
            {selectedJob ? (
              <div
                style={{
                  position: "sticky",
                  top: "84px",
                  maxHeight: "calc(100vh - 104px)",
                  overflowY: "auto",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* Detail Header */}
                <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px", fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}>
                  {selectedJob.title}
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#64748b", flexWrap: "wrap", marginBottom: "20px" }}>
                  <a
                    href={`/jobs/${selectedJob.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontWeight: 700, color: "#2563eb", textDecoration: "underline" }}
                  >
                    {selectedJob.company} ↗
                  </a>
                  <span>•</span>
                  <span>{selectedJob.location}</span>
                  <span>•</span>
                  <span>{selectedJob.salary}</span>
                </div>

                {/* Primary Action Row */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #e2e8f0" }}>
                  {appliedJobIds.has(String(selectedJob.id)) ? (
                    <button
                      disabled
                      style={{
                        padding: "11px 24px",
                        borderRadius: "10px",
                        background: "rgba(34, 197, 94, 0.12)",
                        color: "#15803d",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        fontWeight: 700,
                        fontSize: "0.925rem",
                      }}
                    >
                      ✓ Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(selectedJob)}
                      className="btn-primary"
                      style={{
                        padding: "11px 26px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        fontSize: "0.925rem",
                        fontWeight: 700,
                      }}
                    >
                      Apply with Jobify →
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleToggleSave(String(selectedJob.id), e)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: savedJobIds.has(String(selectedJob.id)) ? "rgba(37,99,235,0.1)" : "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                    }}
                    title="Bookmark job"
                  >
                    {savedJobIds.has(String(selectedJob.id)) ? "🔖" : "📑"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDislikeJob(String(selectedJob.id), e)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                    }}
                    title="Hide job"
                  >
                    👎
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareJob(String(selectedJob.id), e)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                    }}
                    title="Share job"
                  >
                    📤
                  </button>
                </div>

                {/* Job Description Content Area */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    Job description:
                  </h4>

                  <FormattedDescription text={selectedJob.description} />

                  {selectedJob.tags && selectedJob.tags.length > 0 && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", marginBottom: "8px" }}>
                        Required Skills:
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {selectedJob.tags.map((t) => (
                          <span
                            key={t}
                            style={{
                              background: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              color: "#1e293b",
                              padding: "4px 12px",
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#64748b" }}>
                    <strong>Work Location:</strong> {selectedJob.location}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "20px",
                  padding: "40px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Select a job from the list to view full details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MOBILE / SMALL SCREEN JOB DETAIL OVERLAY MODAL
         ======================================================== */}
      {showMobileDetailModal && selectedJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px 24px 0 0",
              padding: "24px",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 -10px 30px rgba(0,0,0,0.15)",
            }}
            className="animate-fade-in-up"
          >
            {/* Header & Back Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setShowMobileDetailModal(false)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#2563eb",
                  cursor: "pointer",
                }}
              >
                ← Back to job list
              </button>
              <button
                type="button"
                onClick={() => setShowMobileDetailModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
              {selectedJob.title}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 16px" }}>
              {selectedJob.company} • {selectedJob.location} • {selectedJob.salary}
            </p>

            {/* Mobile Action Buttons */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              {appliedJobIds.has(String(selectedJob.id)) ? (
                <button
                  disabled
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    background: "rgba(34, 197, 94, 0.12)",
                    color: "#15803d",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    fontWeight: 700,
                  }}
                >
                  ✓ Applied
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileDetailModal(false);
                    handleApplyClick(selectedJob);
                  }}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    fontWeight: 700,
                  }}
                >
                  Apply with Jobify →
                </button>
              )}
            </div>

            <FormattedDescription text={selectedJob.description} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .indeed-jobs-split-grid {
            grid-template-columns: 1fr !important;
          }
          .desktop-detail-panel {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .unified-search-box {
            border-radius: 16px !important;
            padding: 12px !important;
          }
          .search-divider {
            display: none !important;
          }
          .find-jobs-btn {
            width: 100% !important;
            border-radius: 12px !important;
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
