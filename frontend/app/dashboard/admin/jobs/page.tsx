"use client";

import { useState } from "react";

const jobs = [
  { id: 1, title: "Senior Frontend Engineer", company: "Stripe", status: "Active", applications: 48, posted: "Aug 3, 2026", flagged: false, plan: "Enterprise" },
  { id: 2, title: "AI Research Scientist", company: "Anthropic", status: "Active", applications: 234, posted: "Aug 2, 2026", flagged: false, plan: "Enterprise" },
  { id: 3, title: "Software Engineer Intern", company: "XYZ Corp", status: "Flagged", applications: 12, posted: "Aug 1, 2026", flagged: true, plan: "Free" },
  { id: 4, title: "Full Stack Developer", company: "Vercel", status: "Active", applications: 92, posted: "Jul 31, 2026", flagged: false, plan: "Pro" },
  { id: 5, title: "Product Manager", company: "Notion", status: "Pending", applications: 0, posted: "Aug 4, 2026", flagged: false, plan: "Pro" },
  { id: 6, title: "iOS Developer", company: "Spotify", status: "Active", applications: 73, posted: "Jul 30, 2026", flagged: false, plan: "Enterprise" },
  { id: 7, title: "Marketing Specialist", company: "Unknown Co", status: "Flagged", applications: 5, posted: "Jul 29, 2026", flagged: true, plan: "Free" },
  { id: 8, title: "Data Engineer", company: "Airbnb", status: "Active", applications: 55, posted: "Jul 28, 2026", flagged: false, plan: "Enterprise" },
];

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Pending: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Flagged: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
  Removed: { bg: "rgba(100,116,139,0.08)", text: "#64748b", border: "rgba(100,116,139,0.2)" },
};

export default function AdminJobsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = jobs.filter((j) => {
    const matchFilter = filter === "All" || j.status === filter;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: jobs.length,
    Active: jobs.filter(j => j.status === "Active").length,
    Pending: jobs.filter(j => j.status === "Pending").length,
    Flagged: jobs.filter(j => j.status === "Flagged").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Total Jobs", value: "52,411", color: "#4f46e5" },
          { label: "Active", value: "48,201", color: "#059669" },
          { label: "Pending Review", value: "1,840", color: "#d97706" },
          { label: "Flagged", value: "370", color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontFamily: "var(--font-display,'Outfit',sans-serif)", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Flagged Alert */}
      {jobs.some(j => j.flagged) && (
        <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.1rem" }}>🚩</span>
          <p style={{ fontSize: "0.875rem", color: "#b91c1c", fontWeight: 600 }}>
            {jobs.filter(j => j.flagged).length} flagged listings require review
          </p>
          <button
            type="button"
            onClick={() => setFilter("Flagged")}
            style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: "8px", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#b91c1c", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem", fontWeight: 700 }}
          >
            Review Flagged
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["All", "Active", "Pending", "Flagged"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 14px",
                borderRadius: "50px",
                border: filter === f ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
                background: filter === f ? "rgba(220,38,38,0.08)" : "#ffffff",
                color: filter === f ? "#b91c1c" : "var(--text-secondary)",
                fontWeight: filter === f ? 700 : 500,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {f} ({counts[f as keyof typeof counts] ?? jobs.length})
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search jobs or companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ marginLeft: "auto", width: "240px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search jobs"
        />
      </div>

      {/* Jobs Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 80px 110px 120px", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
          {["Job Title / Company", "Plan", "Applications", "Posted", "Status", "Actions"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
          ))}
        </div>

        {filtered.map((job, i) => {
          const sc = statusColors[job.status];
          return (
            <div
              key={job.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 80px 110px 120px",
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
                background: job.flagged ? "rgba(220,38,38,0.03)" : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = job.flagged ? "rgba(220,38,38,0.06)" : "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = job.flagged ? "rgba(220,38,38,0.03)" : "transparent")}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{job.title}</p>
                  {job.flagged && <span style={{ fontSize: "0.8rem" }}>🚩</span>}
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{job.company}</p>
              </div>
              <span style={{ fontSize: "0.825rem", fontWeight: 700, color: job.plan === "Enterprise" ? "#b45309" : job.plan === "Pro" ? "#4338ca" : "var(--text-muted)" }}>{job.plan}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{job.applications}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{job.posted.split(",")[0]}</span>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, width: "fit-content" }}>{job.status}</span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button type="button" style={{ padding: "5px 9px", borderRadius: "7px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>View</button>
                {job.flagged && <button type="button" style={{ padding: "5px 9px", borderRadius: "7px", background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)", color: "#991b1b", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Remove</button>}
                {!job.flagged && <button type="button" style={{ padding: "5px 9px", borderRadius: "7px", background: "#f1f5f9", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}>···</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
