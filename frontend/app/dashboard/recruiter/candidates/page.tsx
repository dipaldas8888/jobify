"use client";

import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";

const statusColors: Record<string, { bg: string; text: string }> = {
  Available: { bg: "rgba(5,150,105,0.08)", text: "#047857" },
  "Open to offers": { bg: "rgba(2,132,199,0.08)", text: "#0369a1" },
  Hired: { bg: "rgba(79,70,229,0.08)", text: "#4338ca" },
  "Not looking": { bg: "rgba(100,116,139,0.08)", text: "#64748b" },
};

const gradients = [
  "linear-gradient(135deg,#4f46e5,#6366f1)",
  "linear-gradient(135deg,#0284c7,#0ea5e9)",
  "linear-gradient(135deg,#059669,#10b981)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#db2777,#ec4899)",
  "linear-gradient(135deg,#7c3aed,#8b5cf6)",
];

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await dashboardApi.getRecruiterDashboard();
      if (res.success) {
        const rawApps = res.dashboard?.applications || res.data?.allApplications || [];
        if (Array.isArray(rawApps) && rawApps.length > 0) {
          const loaded: any[] = [];
          const seenIds = new Set();

          rawApps.forEach((app: any) => {
            if (app.candidate && !seenIds.has(app.candidate._id || app.candidate.id)) {
              seenIds.add(app.candidate._id || app.candidate.id);
              const cName = app.candidate.name || "Candidate User";
              const initials = cName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const skillNames = Array.isArray(app.candidate.skills)
                ? app.candidate.skills.map((s: any) => (typeof s === "string" ? s : s.skillName))
                : ["Engineering", "Software Development", "React", "Node.js"];

              loaded.push({
                id: app.candidate._id || app.candidate.id,
                name: cName,
                email: app.candidate.email || "candidate@jobify.com",
                role: app.job?.title || "Senior Developer",
                experience: app.candidate.experience?.[0]?.duration || "2+ yrs",
                location: app.candidate.location || app.job?.location || "Delhi, India",
                skills: skillNames.length > 0 ? skillNames : ["Software Development", "TypeScript", "Problem Solving"],
                status: "Available",
                match: 92,
                avatar: initials,
                salary: app.job?.salary ? `$${Number(app.job.salary).toLocaleString()}` : "$120,000/yr",
                resumeUrl: app.resumeUrl || app.candidate.resume || "",
                coverLetter: app.coverLetter || "Experienced software engineer dedicated to building scalable web applications.",
              });
            }
          });

          setCandidates(loaded);
        } else {
          setCandidates([]);
        }
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCleanUrl = (rawUrl: string) => {
    if (!rawUrl || typeof rawUrl !== "string") return "";
    let cleanPath = rawUrl.replace(/[\r\n\t]/g, "").trim().replace(/\\/g, "/");
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) return cleanPath;
    if (cleanPath.includes("uploads/")) {
      cleanPath = "uploads/" + cleanPath.split("uploads/")[1];
    } else {
      cleanPath = cleanPath.replace(/^public\//, "").replace(/^\//, "");
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://jobify-d6na.onrender.com";
    return `${baseUrl}/${cleanPath}`;
  };



  const handleViewResume = (candidate: any) => {
    const rawUrl = candidate.resumeUrl;
    const candidateName = candidate.name || "Candidate";

    if (rawUrl && typeof rawUrl === "string" && rawUrl.length > 3) {
      const fullUrl = getCleanUrl(rawUrl);
      window.open(fullUrl, "_blank");
      return;
    }

    alert(`No original resume file uploaded for ${candidateName}.`);
  };

  const handleDownloadResume = async (candidate: any) => {
    const rawUrl = candidate.resumeUrl;
    const candidateName = candidate.name || "Candidate";

    if (rawUrl && typeof rawUrl === "string" && rawUrl.length > 3) {
      const fullUrl = getCleanUrl(rawUrl);

      try {
        const response = await fetch(fullUrl);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          const ext = rawUrl.endsWith(".docx") ? ".docx" : ".pdf";
          a.download = `${candidateName.replace(/\s+/g, "_")}_Original_Resume${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          return;
        }
      } catch (err) {
        console.warn("Direct blob download failed, opening tab URL:", err);
      }

      window.open(fullUrl, "_blank");
      return;
    }

    alert(`No original uploaded file found for ${candidateName}.`);
  };


  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by candidate name, role, or skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1, minWidth: "240px", padding: "10px 16px", borderRadius: "10px" }}
          aria-label="Search candidates"
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: "10px" }}
          aria-label="Filter candidate status"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Open to offers">Open to offers</option>
          <option value="Hired">Hired</option>
        </select>

        <button
          type="button"
          onClick={fetchCandidates}
          className="btn-secondary"
          style={{ padding: "10px 16px", borderRadius: "10px", fontSize: "0.85rem" }}
        >
          🔄 Refresh
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading candidate profiles...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "48px",
            textAlign: "center",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👥</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
            No Candidates Found
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "450px", margin: "0 auto" }}>
            When candidates submit applications to your job postings, their talent profiles will automatically appear here.
          </p>
        </div>
      ) : (
        /* Candidates Grid */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filtered.map((c, i) => {
            return (
              <div
                key={c.id}
                className="job-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div>
                  {/* Top bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: gradients[i % gradients.length],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        {c.avatar}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "2px" }}>
                          {c.name}
                        </p>
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{c.role}</p>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "50px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: "rgba(5,150,105,0.08)",
                        color: "#047857",
                        border: "1px solid rgba(5,150,105,0.2)",
                      }}
                    >
                      {c.match}% Match
                    </span>
                  </div>

                  {/* Metadata */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      marginBottom: "14px",
                    }}
                  >
                    <span>📍 {c.location}</span>
                    <span>•</span>
                    <span>⏱️ {c.experience}</span>
                  </div>

                  {/* Skills badges */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {c.skills.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          background: "#f1f5f9",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    paddingTop: "14px",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                  }}
                >
                  <a
                    href={`mailto:${c.email}?subject=Job Opportunity for ${c.role}`}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      fontSize: "0.85rem",
                      borderRadius: "10px",
                      textAlign: "center",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Contact Candidate ✉️
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
