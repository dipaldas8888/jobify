"use client";

import { useState } from "react";

const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const stageColors: Record<string, { bg: string; text: string; border: string }> = {
  Applied: { bg: "rgba(79,70,229,0.08)", text: "#4338ca", border: "rgba(79,70,229,0.2)" },
  Screening: { bg: "rgba(2,132,199,0.08)", text: "#0369a1", border: "rgba(2,132,199,0.2)" },
  Interview: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Offer: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Hired: { bg: "rgba(16,185,129,0.12)", text: "#065f46", border: "rgba(16,185,129,0.25)" },
  Rejected: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

const applications = [
  { id: 1, name: "Jordan Lee", role: "Senior Frontend Engineer", stage: "Interview", applied: "Aug 1, 2026", experience: "5 yrs", match: 94, avatar: "JL" },
  { id: 2, name: "Maya Patel", role: "Product Manager", stage: "Offer", applied: "Jul 31, 2026", experience: "7 yrs", match: 91, avatar: "MP" },
  { id: 3, name: "Chris Nguyen", role: "Backend Developer", stage: "Screening", applied: "Aug 2, 2026", experience: "3 yrs", match: 82, avatar: "CN" },
  { id: 4, name: "Aisha Johnson", role: "UX Designer", stage: "Applied", applied: "Aug 3, 2026", experience: "4 yrs", match: 78, avatar: "AJ" },
  { id: 5, name: "Ryan Chen", role: "Senior Frontend Engineer", stage: "Hired", applied: "Jul 20, 2026", experience: "6 yrs", match: 96, avatar: "RC" },
  { id: 6, name: "Sofia Rodriguez", role: "DevOps Engineer", stage: "Rejected", applied: "Jul 25, 2026", experience: "2 yrs", match: 61, avatar: "SR" },
  { id: 7, name: "Marcus Williams", role: "Product Manager", stage: "Interview", applied: "Jul 29, 2026", experience: "8 yrs", match: 89, avatar: "MW" },
  { id: 8, name: "Emma Wilson", role: "UX Designer", stage: "Screening", applied: "Aug 1, 2026", experience: "5 yrs", match: 85, avatar: "EW" },
  { id: 9, name: "Liam O'Brien", role: "Backend Developer", stage: "Applied", applied: "Aug 3, 2026", experience: "4 yrs", match: 74, avatar: "LO" },
  { id: 10, name: "Priya Sharma", role: "Senior Frontend Engineer", stage: "Applied", applied: "Aug 4, 2026", experience: "6 yrs", match: 88, avatar: "PS" },
];

const avatarColors = ["linear-gradient(135deg,#4f46e5,#6366f1)", "linear-gradient(135deg,#0284c7,#0ea5e9)", "linear-gradient(135deg,#059669,#10b981)", "linear-gradient(135deg,#d97706,#f59e0b)", "linear-gradient(135deg,#db2777,#ec4899)"];

export default function ApplicationsPage() {
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = applications.filter((a) => {
    const matchStage = selectedStage === "All" || a.stage === selectedStage;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  const stageCounts = Object.fromEntries(stages.map((s) => [s, applications.filter(a => a.stage === s).length]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Stage pills */}
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
          const sc = stageColors[stage];
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

      {/* Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <input
          type="text"
          placeholder="Search applicants or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ maxWidth: "300px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search applications"
        />
        <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>{filtered.length} results</p>
      </div>

      {/* Applications Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 180px 100px 80px 120px 140px",
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
            background: "#f8fafc",
          }}
        >
          {["Applicant", "Role", "Experience", "Match", "Stage", "Actions"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {col}
            </div>
          ))}
        </div>

        {filtered.map((app, i) => {
          const sc = stageColors[app.stage];
          const matchColor = app.match >= 90 ? "#047857" : app.match >= 75 ? "#b45309" : "#b91c1c";
          return (
            <div
              key={app.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px 100px 80px 120px 140px",
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: avatarColors[i % avatarColors.length],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {app.avatar}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{app.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Applied {app.applied}</p>
                </div>
              </div>
              <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>{app.role}</div>
              <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>{app.experience}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: matchColor,
                }}
              >
                {app.match}%
              </div>
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
                {app.stage}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  style={{
                    padding: "5px 10px",
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
                <button
                  type="button"
                  style={{
                    padding: "5px 10px",
                    borderRadius: "7px",
                    background: "#f1f5f9",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ···
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
