"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import TextType from "@/components/TextType";
import JobDetailPanel from "@/components/JobDetailPanel";
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const activeFilterCount =
    selectedTypes.length +
    (selectedExp ? 1 : 0) +
    (minSalaryFilter ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (locationQuery ? 1 : 0);


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

      // Job type filter (normalized)
      if (selectedTypes.length > 0) {
        const normJobType = job.type.toLowerCase().replace(/[^a-z]/g, "");
        const matchesType = selectedTypes.some(
          (t) => t.toLowerCase().replace(/[^a-z]/g, "") === normJobType
        );
        if (!matchesType) return false;
      }

      // Experience level filter (normalized)
      if (selectedExp) {
        const normExp = job.experience.toLowerCase().replace(/[^a-z]/g, "");
        const normSelected = selectedExp.toLowerCase().replace(/[^a-z]/g, "");
        if (!normExp.includes(normSelected) && !normSelected.includes(normExp)) return false;
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

  const toggleJobType = (t: JobType) => {
    setCurrentPage(1);
    if (selectedTypes.includes(t)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== t));
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSelectedTypes([]);
    setSelectedExp("");
    setMinSalaryFilter("");
    setCurrentPage(1);
  };

  return (
    <div style={{ background: "#f8fafc", height: "100dvh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* ========================================================
          1. TOP INDEED-STYLE UNIFIED SEARCH & FILTER HEADER
         ======================================================== */}
      <div
        style={{
          background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
          borderBottom: "1px solid #e2e8f0",
          padding: "24px 20px 20px",
        }}
      >
        <div className="container-main" style={{ maxWidth: "1200px" }}>
          {/* Animated Headline with TextType */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                margin: "0 0 8px",
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
              }}
            >
              Find your next{" "}
              <TextType
                text={["Software Engineer", "Frontend Developer", "Product Manager", "Data Analyst", "DevOps Engineer"]}
                className="gradient-text"
              />{" "}
              job
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
              Discover top opportunities matched to your skills and preferences
            </p>
          </div>

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

          {/* Desktop Interactive Filter Pills & Dropdowns Row */}
          <div
            className="desktop-filter-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* Job Types Pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {JOB_TYPES.map((t) => {
                const isActive = selectedTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleJobType(t)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "50px",
                      fontSize: "0.825rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#2563eb" : "#475569",
                      background: isActive ? "rgba(37, 99, 235, 0.1)" : "#ffffff",
                      border: isActive ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid #cbd5e1",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: isActive ? "0 2px 6px rgba(37, 99, 235, 0.15)" : "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    {isActive ? "✓ " : ""}{t}
                  </button>
                );
              })}
            </div>

            {/* Experience Level Dropdown */}
            <select
              value={selectedExp}
              onChange={(e) => {
                setSelectedExp(e.target.value as ExperienceLevel | "");
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "50px",
                fontSize: "0.825rem",
                fontWeight: selectedExp ? 700 : 500,
                color: selectedExp ? "#2563eb" : "#475569",
                background: selectedExp ? "rgba(37, 99, 235, 0.1)" : "#ffffff",
                border: selectedExp ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid #cbd5e1",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              <option value="">Experience: All</option>
              {EXPERIENCE_LEVELS.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>

            {/* Minimum Salary Dropdown */}
            <select
              value={minSalaryFilter}
              onChange={(e) => {
                setMinSalaryFilter(e.target.value ? Number(e.target.value) : "");
                setCurrentPage(1);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "50px",
                fontSize: "0.825rem",
                fontWeight: minSalaryFilter ? 700 : 500,
                color: minSalaryFilter ? "#2563eb" : "#475569",
                background: minSalaryFilter ? "rgba(37, 99, 235, 0.1)" : "#ffffff",
                border: minSalaryFilter ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid #cbd5e1",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              <option value="">Salary: All Ranges</option>
              <option value="50000">$50,000+ / yr</option>
              <option value="80000">$80,000+ / yr</option>
              <option value="100000">$100,000+ / yr</option>
              <option value="120000">$120,000+ / yr</option>
            </select>

            {/* Clear All Filters Button */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                style={{
                  padding: "6px 14px",
                  borderRadius: "50px",
                  fontSize: "0.825rem",
                  fontWeight: 700,
                  color: "#dc2626",
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                ✕ Clear All
              </button>
            )}
          </div>

          {/* Small Screen Filter Trigger Button */}
          <div className="mobile-filter-trigger-bar" style={{ display: "none", marginTop: "14px" }}>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "11px 18px",
                borderRadius: "14px",
                background: "#ffffff",
                border: activeFilterCount > 0 ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                color: activeFilterCount > 0 ? "#2563eb" : "#1e293b",
                fontWeight: 700,
                fontSize: "0.925rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              <span>🎛️</span> All Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    borderRadius: "50px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    marginLeft: "4px",
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>



      {/* ========================================================
          2. MAIN CONTENT AREA: SPLIT SCREEN — flex fills remaining viewport
         ======================================================== */}
      <div
        className="container-main"
        style={{
          maxWidth: "1280px",
          marginTop: "16px",
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          paddingBottom: "0",
        }}
      >
        {/* Match count row — compact, no wasted space */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexShrink: 0 }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
            {filteredJobs.length} jobs for you
          </span>
        </div>

        {/* 2-COLUMN SPLIT GRID — fills all remaining height; left scrolls, right stays fixed */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
            gap: "20px",
            overflow: "hidden",
          }}
          className="indeed-jobs-split-grid"
        >

          {/* LEFT COLUMN — independent scroll */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "6px",
              paddingBottom: "20px",
              height: "100%",
              minHeight: 0,
            }}
            className="jobs-left-col"
          >

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
                      padding: "20px 20px 20px 24px",
                      border: isSelected
                        ? "1.5px solid rgba(79, 70, 229, 0.4)"
                        : "1px solid #e2e8f0",
                      boxShadow: isSelected
                        ? "0 0 0 3px rgba(79, 70, 229, 0.08), 0 8px 24px rgba(79, 70, 229, 0.06)"
                        : "0 2px 6px rgba(0, 0, 0, 0.03)",
                      cursor: "pointer",
                      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    className="job-item-card"
                  >
                    {/* Left Active Glow Accent Bar */}
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          background: "linear-gradient(180deg, #4f46e5, #6366f1)",
                          borderRadius: "0 4px 4px 0",
                        }}
                      />
                    )}

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

          {/* RIGHT COLUMN — fixed height, never blank */}
          <div
            className="desktop-detail-panel"
            style={{ height: "100%", overflow: "hidden" }}
          >
            <JobDetailPanel
              selectedJob={selectedJob}
              hasApplied={Boolean(selectedJob && appliedJobIds.has(String(selectedJob.id)))}
              isSaved={Boolean(selectedJob && savedJobIds.has(String(selectedJob.id)))}
              onApply={handleApplyClick}
              onToggleSave={handleToggleSave}
              onDislike={handleDislikeJob}
              onShare={handleShareJob}
            />
          </div>


        </div>
      </div>

      {/* ========================================================
          3. MOBILE "ALL FILTERS" SIDE DRAWER POPUP MODAL
         ======================================================== */}
      {mobileFilterOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              width: "100%",
              maxWidth: "400px",
              height: "100vh",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "24px",
              animation: "filterSlideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>🎛️</span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Filter Jobs
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    fontSize: "1.1rem",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 4px 16px 0", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Section 1: Job Types */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
                  Job Type
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {JOB_TYPES.map((t) => {
                    const isActive = selectedTypes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleJobType(t)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#2563eb" : "#475569",
                          background: isActive ? "rgba(37, 99, 235, 0.1)" : "#f8fafc",
                          border: isActive ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                          cursor: "pointer",
                        }}
                      >
                        {isActive ? "✓ " : ""}{t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Experience Level */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
                  Experience Level
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedExp("")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: !selectedExp ? 700 : 500,
                      color: !selectedExp ? "#2563eb" : "#475569",
                      background: !selectedExp ? "rgba(37, 99, 235, 0.1)" : "#f8fafc",
                      border: !selectedExp ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    All Levels
                  </button>
                  {EXPERIENCE_LEVELS.map((exp) => {
                    const isActive = selectedExp === exp;
                    return (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => setSelectedExp(exp)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#2563eb" : "#475569",
                          background: isActive ? "rgba(37, 99, 235, 0.1)" : "#f8fafc",
                          border: isActive ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                          cursor: "pointer",
                        }}
                      >
                        {isActive ? "✓ " : ""}{exp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Salary Expectation */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>
                  Minimum Salary
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { label: "All Ranges", val: "" },
                    { label: "$50,000+", val: 50000 },
                    { label: "$80,000+", val: 80000 },
                    { label: "$100,000+", val: 100000 },
                    { label: "$120,000+", val: 120000 },
                  ].map((sal) => {
                    const isActive = minSalaryFilter === sal.val;
                    return (
                      <button
                        key={sal.label}
                        type="button"
                        onClick={() => setMinSalaryFilter(sal.val as any)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#2563eb" : "#475569",
                          background: isActive ? "rgba(37, 99, 235, 0.1)" : "#f8fafc",
                          border: isActive ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                          cursor: "pointer",
                        }}
                      >
                        {isActive ? "✓ " : ""}{sal.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Apply Footer */}
            <div style={{ paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                }}
              >
                Show Results ({filteredJobs.length} Jobs)
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================
          4. MOBILE / SMALL SCREEN JOB DETAIL OVERLAY MODAL
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
        @keyframes filterSlideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (max-width: 960px) {
          .indeed-jobs-split-grid {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          .jobs-left-col {
            height: auto !important;
            overflow-y: visible !important;
          }
          .desktop-detail-panel {
            display: none !important;
          }
        }

        /* slim scrollbar for left job cards column */
        .jobs-left-col {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .jobs-left-col::-webkit-scrollbar {
          width: 5px;
        }
        .jobs-left-col::-webkit-scrollbar-track {
          background: transparent;
        }
        .jobs-left-col::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .jobs-left-col::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ── CRITICAL: prevent flex from compressing cards ── */
        .jobs-left-col > * {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .desktop-filter-row {
            display: none !important;
          }
          .mobile-filter-trigger-bar {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          .unified-search-box {
            border-radius: 18px !important;
            padding: 14px 16px !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .search-divider {
            display: none !important;
          }
          .find-jobs-btn {
            width: 100% !important;
            border-radius: 12px !important;
            padding: 12px !important;
            margin-top: 4px !important;
          }
        /* ── RIGHT panel inner body: slim custom scrollbar ── */
        .indeed-detail-scroll-body {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .indeed-detail-scroll-body::-webkit-scrollbar {
          width: 4px;
        }
        .indeed-detail-scroll-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .indeed-detail-scroll-body::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .indeed-detail-scroll-body::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

    </div>
  );
}

