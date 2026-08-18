"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useDeferredValue } from "react";

import TextType from "@/components/TextType";
import { mockJobs, type Job, type JobType, type ExperienceLevel } from "@/data/mockJobs";
import { jobsApi } from "@/lib/api";
import { useAppSelector } from "@/lib/redux/store";


const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Director",
];

function JobCard({ job, hasApplied, onApply }: { job: Job; hasApplied?: boolean; onApply?: (job: Job) => void }) {
  const router = useRouter();

  return (
    <div
      className="job-card"
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      {job.featured && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#b45309",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            padding: "3px 10px",
            borderRadius: "50px",
          }}
        >
          ⭐ Featured
        </div>
      )}

      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        {/* Logo */}
        <div
          className="company-logo"
          style={{ background: job.companyColor || "linear-gradient(135deg, #4f46e5, #6366f1)", color: "white", flexShrink: 0 }}
        >
          {job.companyLogo || job.company.charAt(0)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
              marginBottom: "4px",
              paddingRight: job.featured ? "80px" : "0",
            }}
            className="hover-underline"
          >
            {job.title}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.825rem",
              color: "var(--text-secondary)",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 600, color: "#4f46e5" }}>{job.company}</span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span>📍 {job.location}</span>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <span>🕐 {job.postedAt}</span>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {job.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {/* Tags */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {job.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="badge badge-accent">
                  {tag}
                </span>
              ))}
              {job.tags.length > 3 && (
                <span className="badge" style={{ background: "#f1f5f9", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  +{job.tags.length - 3}
                </span>
              )}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  background: "#f1f5f9",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              >
                {job.experience}
              </span>
              <span className="badge badge-success">{job.type}</span>
              <span
                style={{
                  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {job.salary}
              </span>

              {hasApplied ? (
                <button
                  type="button"
                  disabled
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.8rem",
                    borderRadius: "8px",
                    background: "rgba(34, 197, 94, 0.12)",
                    color: "#15803d",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    cursor: "default",
                    fontWeight: 700,
                  }}
                >
                  ✓ Applied
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/jobs/${job.id}/apply`);
                  }}
                  className="btn-primary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem", borderRadius: "8px" }}
                >
                  Apply Now
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function JobCardSkeleton() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px 24px",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Logo box skeleton */}
        <div className="skeleton-box" style={{ width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title skeleton */}
          <div className="skeleton-box" style={{ width: "45%", height: "20px", marginBottom: "10px" }} />

          {/* Meta skeleton */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
            <div className="skeleton-box" style={{ width: "110px", height: "14px" }} />
            <div className="skeleton-box" style={{ width: "90px", height: "14px" }} />
            <div className="skeleton-box" style={{ width: "70px", height: "14px" }} />
          </div>

          {/* Description skeleton */}
          <div className="skeleton-box" style={{ width: "95%", height: "14px", marginBottom: "8px" }} />
          <div className="skeleton-box" style={{ width: "70%", height: "14px", marginBottom: "18px" }} />

          {/* Tags + Actions skeleton */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="skeleton-box" style={{ width: "65px", height: "24px", borderRadius: "50px" }} />
              <div className="skeleton-box" style={{ width: "75px", height: "24px", borderRadius: "50px" }} />
              <div className="skeleton-box" style={{ width: "60px", height: "24px", borderRadius: "50px" }} />
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div className="skeleton-box" style={{ width: "80px", height: "24px", borderRadius: "6px" }} />
              <div className="skeleton-box" style={{ width: "90px", height: "34px", borderRadius: "8px" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedExp, setSelectedExp] = useState<ExperienceLevel | "">("");
  const [sortBy, setSortBy] = useState<"recent" | "salary" | "applicants">("recent");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 10;

  const [backendJobs, setBackendJobs] = useState<Job[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Apply Modal state
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
          companyColor: "linear-gradient(135deg, #4f46e5, #6366f1)",
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

  const allJobsList = useMemo(() => {
    return backendJobs;
  }, [backendJobs]);

  const toggleType = (type: JobType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const deferredSearch = useDeferredValue(searchQuery);
  const deferredLocation = useDeferredValue(locationQuery);

  const filteredJobs = useMemo(() => {
    let jobs = [...allJobsList];

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (deferredLocation.trim()) {
      const loc = deferredLocation.toLowerCase();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (selectedTypes.length > 0) {
      jobs = jobs.filter((j) => selectedTypes.includes(j.type));
    }

    if (selectedExp) {
      jobs = jobs.filter((j) => j.experience === selectedExp);
    }

    if (sortBy === "applicants") {
      jobs.sort((a, b) => b.applicants - a.applicants);
    }

    return jobs;
  }, [allJobsList, searchQuery, locationQuery, selectedTypes, selectedExp, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedTypes([]);
    setSelectedExp("");
    setSortBy("recent");
    setCurrentPage(1);
  };

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, locationQuery, selectedTypes, selectedExp, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const paginatedJobs = useMemo(
    () => filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE),
    [filteredJobs, currentPage, JOBS_PER_PAGE]
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build page number array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const clearAllFilters = clearFilters;

  const hasActiveFilters =
    searchQuery || locationQuery || selectedTypes.length > 0 || selectedExp;

  const handleApplyClick = (job: Job) => {
    router.push(`/jobs/${job.id}/apply`);
  };


  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    if (!user) {
      setAppMessage({ type: "error", text: "Please sign in to your account first to submit job applications." });
      return;
    }

    setIsSubmittingApp(true);
    setAppMessage(null);

    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);

      const res = await jobsApi.applyJob(String(applyingJob.id), formData);
      if (res.success) {
        setAppMessage({ type: "success", text: "Application submitted successfully to the employer!" });
        setTimeout(() => {
          setApplyingJob(null);
        }, 1500);
      } else {
        setAppMessage({ type: "error", text: res.message || "Failed to submit application." });
      }
    } catch (err: any) {
      setAppMessage({ type: "error", text: err.message || "Application submission error." });
    } finally {
      setIsSubmittingApp(false);
    }
  };

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", position: "relative" }}>
      {/* Glow effects */}
      <div
        className="glow-orb glow-orb-primary"
        style={{ width: "400px", height: "400px", top: "-50px", right: "-100px", opacity: 0.15 }}
      />

      {/* ===================== PAGE HEADER ===================== */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, var(--bg-base) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "48px 0 0",
        }}
        className="bg-grid"
      >
        <div className="container-main" style={{ paddingBottom: "32px" }}>
          {/* Title */}
          <div style={{ marginBottom: "28px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              Find your next{" "}
              <span className="gradient-text">
                <TextType
                  text={["opportunity", "tech role", "career move", "remote job"]}
                  speed={80}
                  deleteSpeed={50}
                  pauseDuration={1600}
                />
              </span>
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              {filteredJobs.length.toLocaleString()} jobs available right now
            </p>
          </div>

          {/* Search Bar */}
          <div className="jobs-search-bar" role="search">
            <div className="search-row" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
              <span style={{ fontSize: "1.1rem" }}>🔍</span>
              <input
                type="text"
                placeholder="Job title, company, or skill…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search jobs"
                id="jobs-search-input"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div
              className="search-divider"
              style={{ width: "1px", height: "32px", background: "var(--border)" }}
            />

            <div className="search-row" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
              <span style={{ fontSize: "1.1rem" }}>📍</span>
              <input
                type="text"
                placeholder="Location or Remote…"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                aria-label="Filter by location"
                id="jobs-location-input"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <button
              className="btn-primary"
              style={{ borderRadius: "10px", whiteSpace: "nowrap" }}
              onClick={() => {}}
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="container-main" style={{ padding: "32px 24px" }}>
        {/* Mobile filter toggle — only visible on mobile via CSS */}
        <button
          className="filter-toggle-btn"
          onClick={() => setFilterOpen(true)}
          type="button"
          aria-label="Open filters"
          style={{ marginBottom: "16px" }}
        >
          <span>🔧</span>
          <span>Filters</span>
          {hasActiveFilters && (
            <span style={{
              background: "#4f46e5",
              color: "white",
              borderRadius: "50px",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "2px 7px",
              marginLeft: "4px",
            }}>
              {selectedTypes.length + (selectedExp ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Sidebar overlay (mobile) */}
        <div
          className={`sidebar-overlay${filterOpen ? " active" : ""}`}
          onClick={() => setFilterOpen(false)}
          aria-hidden="true"
        />

        <div className="jobs-layout">
          {/* ===== SIDEBAR FILTERS ===== */}
          <aside
            aria-label="Job filters"
            className={`jobs-filter-sidebar${filterOpen ? " open" : ""}`}
            style={{ background: "#ffffff" }}
          >
            {/* Mobile drawer header with close button */}
            <div className="drawer-header-mobile" style={{
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 16px 12px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "8px",
              width: "100%",
              boxSizing: "border-box" as const,
            }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>🔧 Filters</span>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                style={{
                  background: "rgba(79,70,229,0.08)",
                  border: "1px solid rgba(79,70,229,0.2)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#4f46e5",
                  fontFamily: "inherit",
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-card)",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--text-primary)",
                  }}
                >
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "#4f46e5",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      transition: "background 0.2s",
                    }}
                    type="button"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Job Type */}
              <div style={{ marginBottom: "28px" }}>
                <h3
                  style={{
                    fontSize: "0.775rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                  }}
                >
                  Job Type
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {JOB_TYPES.map((type) => (
                    <label
                      key={type}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        color: selectedTypes.includes(type)
                          ? "#4f46e5"
                          : "var(--text-secondary)",
                        fontWeight: selectedTypes.includes(type) ? 600 : 400,
                        transition: "color 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        style={{ accentColor: "#4f46e5", width: "15px", height: "15px" }}
                        aria-label={`Filter by ${type}`}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div style={{ marginBottom: "28px" }}>
                <h3
                  style={{
                    fontSize: "0.775rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                  }}
                >
                  Experience Level
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <label
                      key={level}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        color: selectedExp === level ? "#4f46e5" : "var(--text-secondary)",
                        fontWeight: selectedExp === level ? 600 : 400,
                        transition: "color 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="experience"
                        checked={selectedExp === level}
                        onChange={() => setSelectedExp(selectedExp === level ? "" : level)}
                        style={{ accentColor: "#4f46e5", width: "15px", height: "15px" }}
                        aria-label={`Filter by ${level} experience`}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3
                  style={{
                    fontSize: "0.775rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                  }}
                >
                  Quick Filters
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "🌍 Remote only", action: () => setLocationQuery("Remote") },
                    { label: "⭐ Featured jobs", action: () => {} },
                    { label: "🆕 Posted today", action: () => {} },
                  ].map((qf) => (
                    <button
                      key={qf.label}
                      onClick={qf.action}
                      type="button"
                      style={{
                        background: "#ffffff",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                        transition: "all 0.2s ease",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "#4f46e5";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,70,229,0.3)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(79,70,229,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLElement).style.background = "#ffffff";
                      }}
                    >
                      {qf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close button for mobile filter sidebar */}
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 0" }}>
              <button
                className="filter-toggle-btn"
                onClick={() => setFilterOpen(false)}
                type="button"
                style={{ fontSize: "0.8rem", padding: "8px 14px" }}
              >
                ✕ Close Filters
              </button>
            </div>
          </aside>

          {/* ===== JOBS LIST ===== */}
          <div>
            {/* Sort + Result Count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                {filteredJobs.length === 0 ? (
                  "No results"
                ) : (
                  <>
                    Showing{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {(currentPage - 1) * JOBS_PER_PAGE + 1}–{Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)}
                    </strong>
                    {" "}of{" "}
                    <strong style={{ color: "var(--text-primary)" }}>{filteredJobs.length}</strong>{" "}results
                  </>
                )}
                {hasActiveFilters && (
                  <span style={{ color: "#4f46e5", fontWeight: 600 }}> (filtered)</span>
                )}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label
                  htmlFor="sort-select"
                  style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                >
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  style={{ minWidth: "150px" }}
                >
                  <option value="recent">Most Recent</option>
                  <option value="applicants">Most Applied</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                {searchQuery && (
                  <span className="badge badge-primary">
                    🔍 {searchQuery}{" "}
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: "4px", fontSize: "0.9rem" }}
                      type="button"
                      aria-label="Remove search filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {locationQuery && (
                  <span className="badge badge-accent">
                    📍 {locationQuery}{" "}
                    <button
                      onClick={() => setLocationQuery("")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: "4px", fontSize: "0.9rem" }}
                      type="button"
                      aria-label="Remove location filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedTypes.map((t) => (
                  <span key={t} className="badge badge-success">
                    {t}{" "}
                    <button
                      onClick={() => toggleType(t)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginLeft: "4px", fontSize: "0.9rem" }}
                      type="button"
                      aria-label={`Remove ${t} filter`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Jobs list */}
            {isLoadingBackend ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <JobCardSkeleton key={n} />
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "48px",
                  textAlign: "center",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                  No Jobs Found
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "450px", margin: "0 auto 20px" }}>
                  {hasActiveFilters
                    ? "Try adjusting or clearing your search filters to see more job listings."
                    : "No recruiter job postings are currently published. Check back soon!"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="btn-secondary"
                    type="button"
                    style={{ padding: "8px 18px", borderRadius: "10px", fontSize: "0.85rem" }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {paginatedJobs.map((job) => (
                  <div key={job.id}>
                    <JobCard job={job} hasApplied={appliedJobIds.has(String(job.id))} onApply={handleApplyClick} />
                  </div>
                ))}
              </div>

            )}

            {/* ── Pagination ── */}
            {!isLoadingBackend && filteredJobs.length > JOBS_PER_PAGE && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "32px",
                  flexWrap: "wrap",
                }}
              >
                {/* Prev button */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: currentPage === 1 ? "#f8fafc" : "#ffffff",
                    color: currentPage === 1 ? "var(--text-muted)" : "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: "all 0.15s ease",
                    boxShadow: currentPage === 1 ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  ← Prev
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      style={{ padding: "8px 4px", color: "var(--text-muted)", fontSize: "0.9rem" }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p as number)}
                      style={{
                        minWidth: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        border: currentPage === p ? "none" : "1px solid var(--border)",
                        background:
                          currentPage === p
                            ? "linear-gradient(135deg, #4f46e5, #6366f1)"
                            : "#ffffff",
                        color: currentPage === p ? "#ffffff" : "var(--text-primary)",
                        fontWeight: currentPage === p ? 700 : 500,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        boxShadow:
                          currentPage === p
                            ? "0 4px 14px rgba(79,70,229,0.35)"
                            : "0 1px 3px rgba(0,0,0,0.06)",
                        transform: currentPage === p ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: currentPage === totalPages ? "#f8fafc" : "#ffffff",
                    color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: "all 0.15s ease",
                    boxShadow: currentPage === totalPages ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  Next →
                </button>

                {/* Page info text */}
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>{/* end jobs column */}
        </div>{/* end jobs-layout */}
      </div>

      {/* Application Modal */}
      {applyingJob && (
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
              maxWidth: "500px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              border: "1px solid var(--border)",
            }}
            className="animate-fade-in-up"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text-primary)" }}>
                  Apply to {applyingJob.company}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#4f46e5", fontWeight: 600 }}>{applyingJob.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {appMessage && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "16px",
                  background: appMessage.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
                  color: appMessage.type === "success" ? "#047857" : "#b91c1c",
                  border: `1px solid ${appMessage.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                {appMessage.type === "success" ? "✅ " : "⚠️ "}{appMessage.text}
              </div>
            )}

            {!user && (
              <div style={{ marginBottom: "16px", padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                💡 You are currently not signed in. <Link href="/auth/login" style={{ color: "#4f46e5", fontWeight: 700 }}>Click here to sign in</Link> first.
              </div>
            )}

            <form onSubmit={handleApplicationSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Cover Letter / Introduction
                </label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px", resize: "vertical" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="btn-secondary"
                  style={{ borderRadius: "10px", padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmittingApp || !user}
                  style={{ borderRadius: "10px", padding: "10px 24px", opacity: isSubmittingApp || !user ? 0.6 : 1 }}
                >
                  {isSubmittingApp ? "Submitting..." : "Submit Application →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
