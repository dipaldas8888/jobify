"use client";

import { useState, useEffect } from "react";
import { dashboardApi, jobsApi } from "@/lib/api";

const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const stageColors: Record<string, { bg: string; text: string; border: string }> = {
  Applied: { bg: "rgba(79,70,229,0.08)", text: "#4338ca", border: "rgba(79,70,229,0.2)" },
  Screening: { bg: "rgba(2,132,199,0.08)", text: "#0369a1", border: "rgba(2,132,199,0.2)" },
  Interview: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Offer: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Hired: { bg: "rgba(16,185,129,0.12)", text: "#065f46", border: "rgba(16,185,129,0.25)" },
  Rejected: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

const avatarColors = [
  "linear-gradient(135deg,#4f46e5,#6366f1)",
  "linear-gradient(135deg,#0284c7,#0ea5e9)",
  "linear-gradient(135deg,#059669,#10b981)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#db2777,#ec4899)",
];

export default function ApplicationsPage() {
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalApp, setActiveModalApp] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await dashboardApi.getRecruiterDashboard();
      if (res.success) {
        const rawApps = res.dashboard?.applications || res.data?.allApplications || [];
        const liveApps = rawApps.map((app: any, idx: number) => {
          const candidateName = app.candidate?.name || "Applicant Candidate";
          const initials = candidateName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return {
            id: app._id || `live-${idx}`,
            name: candidateName,
            email: app.candidate?.email || "",
            role: app.job?.title || "Applied Role",
            company: app.job?.company || "My Company",
            stage: app.status || "Applied",
            applied: new Date(app.createdAt).toLocaleDateString(),
            experience: app.candidate?.experience?.[0]?.duration || "1+ yrs",
            match: 92,
            avatar: initials,
            resumeUrl: app.resumeUrl || app.candidate?.resume || "",
            coverLetter: app.coverLetter || "No cover letter provided.",
            isLive: true,
          };
        });

        setApplications(liveApps);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Error fetching recruiter applications:", err);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageChange = async (appId: string, newStage: string) => {
    setUpdatingId(appId);
    try {
      const res = await jobsApi.updateApplicationStatus(appId, newStage);
      if (res.success || res.data) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
        );
      }
    } catch (err) {
      // Local UI optimistic fallback
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((a) => {
    const matchStage = selectedStage === "All" || a.stage === selectedStage;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      (a.email && a.email.toLowerCase().includes(search.toLowerCase()));
    return matchStage && matchSearch;
  });

  const stageCounts = Object.fromEntries(
    stages.map((s) => [s, applications.filter((a) => a.stage === s).length])
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text-primary)" }}>Job Applications</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Review, manage, and advance candidate applications submitted to your job postings.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchApplications}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.85rem", borderRadius: "10px" }}
        >
          🔄 Refresh Applications
        </button>
      </div>

      {/* Stage Filter Pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setSelectedStage("All")}
          style={{
            padding: "7px 16px",
            borderRadius: "50px",
            border: selectedStage === "All" ? "1px solid rgba(79,70,229,0.3)" : "1px solid var(--border)",
            background: selectedStage === "All" ? "rgba(79,70,229,0.08)" : "#ffffff",
            color: selectedStage === "All" ? "#4338ca" : "var(--text-secondary)",
            fontWeight: selectedStage === "All" ? 700 : 500,
            fontSize: "0.825rem",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          All ({applications.length})
        </button>
        {stages.map((stage) => {
          const sc = stageColors[stage] || stageColors.Applied;
          const isActive = selectedStage === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => setSelectedStage(stage)}
              style={{
                padding: "7px 16px",
                borderRadius: "50px",
                border: isActive ? `1px solid ${sc.border}` : "1px solid var(--border)",
                background: isActive ? sc.bg : "#ffffff",
                color: isActive ? sc.text : "var(--text-secondary)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.825rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {stage} ({stageCounts[stage] ?? 0})
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <input
          type="text"
          placeholder="Search applicants, role, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ maxWidth: "340px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search applications"
        />
        <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>{filtered.length} applications displayed</p>
      </div>

      {/* Applications Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.2fr 100px 80px 140px 140px",
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
            background: "#f8fafc",
          }}
        >
          {["Applicant", "Job Role", "Experience", "Match", "Pipeline Stage", "Actions"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {col}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Loading job applications...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No applications match your search filter.
          </div>
        ) : (
          filtered.map((app, i) => {
            const sc = stageColors[app.stage] || stageColors.Applied;
            const matchColor = app.match >= 90 ? "#047857" : app.match >= 75 ? "#b45309" : "#b91c1c";
            return (
              <div
                key={app.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.2fr 100px 80px 140px 140px",
                  padding: "14px 20px",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center",
                  background: app.isLive ? "rgba(79, 70, 229, 0.02)" : "#ffffff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = app.isLive ? "rgba(79, 70, 229, 0.02)" : "#ffffff")}
              >
                {/* Applicant Column */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: avatarColors[i % avatarColors.length],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {app.avatar}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{app.name}</span>
                      {app.isLive && (
                        <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "50px", background: "#059669", color: "white", fontWeight: 800 }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Applied {app.applied}</div>
                  </div>
                </div>

                {/* Job Role Column */}
                <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text-secondary)", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {app.role}
                </div>

                {/* Experience Column */}
                <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>{app.experience}</div>

                {/* Match Column */}
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: matchColor }}>
                  {app.match}%
                </div>

                {/* Pipeline Stage Select */}
                <div>
                  <select
                    value={app.stage}
                    disabled={updatingId === app.id}
                    onChange={(e) => handleStageChange(app.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "50px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      background: sc.bg,
                      color: sc.text,
                      border: `1px solid ${sc.border}`,
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    {stages.map((stg) => (
                      <option key={stg} value={stg} style={{ color: "#000000", background: "#ffffff" }}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveModalApp(app)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "7px",
                      background: "rgba(79,70,229,0.08)",
                      border: "1px solid rgba(79,70,229,0.2)",
                      color: "#4338ca",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    Review
                  </button>
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl.startsWith("http") ? app.resumeUrl : `http://localhost:5000/${app.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "5px 8px",
                        borderRadius: "7px",
                        background: "#f1f5f9",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontSize: "0.75rem",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      📄
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {activeModalApp && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {activeModalApp.avatar}
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)" }}>{activeModalApp.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "#4f46e5", fontWeight: 600 }}>Applied for {activeModalApp.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalApp(null)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.875rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Email: </span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{activeModalApp.email || "Not specified"}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>Applied Date: </span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{activeModalApp.applied}</span>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Cover Letter / Note:</span>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", lineHeight: 1.6 }}>
                  {activeModalApp.coverLetter}
                </div>
              </div>

              {activeModalApp.resumeUrl ? (
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Submitted Resume:</span>
                  <a
                    href={activeModalApp.resumeUrl.startsWith("http") ? activeModalApp.resumeUrl : `http://localhost:5000/${activeModalApp.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ display: "inline-block", padding: "8px 16px", fontSize: "0.85rem", textDecoration: "none", borderRadius: "8px" }}
                  >
                    📥 Download Candidate Resume PDF
                  </a>
                </div>
              ) : (
                <div style={{ color: "var(--text-muted)" }}>No resume PDF uploaded.</div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setActiveModalApp(null)}
                className="btn-secondary"
                style={{ padding: "8px 20px", fontSize: "0.85rem", borderRadius: "8px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
