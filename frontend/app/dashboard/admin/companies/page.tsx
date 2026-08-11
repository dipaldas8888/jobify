"use client";

import { useState } from "react";

const companies = [
  { id: 1, name: "Stripe", industry: "Fintech", size: "2K–5K", plan: "Enterprise", jobs: 12, status: "Verified", joined: "Jan 2023" },
  { id: 2, name: "Vercel", industry: "Dev Tools", size: "200–500", plan: "Enterprise", jobs: 8, status: "Verified", joined: "Mar 2023" },
  { id: 3, name: "NovaTech Solutions", industry: "SaaS", size: "50–200", plan: "Pro", jobs: 3, status: "Pending", joined: "Aug 2026" },
  { id: 4, name: "Anthropic", industry: "AI Research", size: "500–1K", plan: "Enterprise", jobs: 24, status: "Verified", joined: "Jun 2022" },
  { id: 5, name: "Design Studio Co", industry: "Design", size: "10–50", plan: "Free", jobs: 1, status: "Unverified", joined: "Jul 2026" },
  { id: 6, name: "Airbnb", industry: "Travel", size: "5K+", plan: "Enterprise", jobs: 67, status: "Verified", joined: "Feb 2022" },
  { id: 7, name: "Random Startup", industry: "Unknown", size: "1–10", plan: "Free", jobs: 2, status: "Flagged", joined: "Aug 2026" },
  { id: 8, name: "GitHub", industry: "Dev Tools", size: "1K–2K", plan: "Enterprise", jobs: 15, status: "Verified", joined: "Apr 2022" },
];

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Verified: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Pending: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Unverified: { bg: "rgba(100,116,139,0.08)", text: "#64748b", border: "rgba(100,116,139,0.2)" },
  Flagged: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

const logoColors = [
  "linear-gradient(135deg,#635bff,#4f46e5)",
  "linear-gradient(135deg,#000,#333)",
  "linear-gradient(135deg,#4f46e5,#7c3aed)",
  "linear-gradient(135deg,#ea580c,#dc2626)",
  "linear-gradient(135deg,#d97706,#b45309)",
  "linear-gradient(135deg,#dc2626,#991b1b)",
  "linear-gradient(135deg,#ef4444,#dc2626)",
  "linear-gradient(135deg,#24292e,#586069)"
];

export default function AdminCompaniesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = companies.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Total Companies", value: "25,341", color: "#4f46e5" },
          { label: "Verified", value: "18,402", color: "#059669" },
          { label: "Pending Verify", value: "4,820", color: "#d97706" },
          { label: "Flagged", value: "119", color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontFamily: "var(--font-display,'Outfit',sans-serif)", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["All", "Verified", "Pending", "Unverified", "Flagged"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              style={{
                padding: "7px 14px",
                borderRadius: "50px",
                border: statusFilter === f ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
                background: statusFilter === f ? "rgba(220,38,38,0.08)" : "#ffffff",
                color: statusFilter === f ? "#b91c1c" : "var(--text-secondary)",
                fontWeight: statusFilter === f ? 700 : 500,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ marginLeft: "auto", width: "220px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search companies"
        />
      </div>

      {/* Companies Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px 100px 70px 120px 130px", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
          {["Company", "Industry", "Size", "Plan", "Jobs", "Status", "Actions"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
          ))}
        </div>

        {filtered.map((co, i) => {
          const sc = statusColors[co.status];
          return (
            <div
              key={co.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 80px 100px 70px 120px 130px",
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: logoColors[i % logoColors.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {co.name[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{co.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Since {co.joined}</p>
                </div>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{co.industry}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{co.size}</span>
              <span style={{ fontSize: "0.825rem", fontWeight: 700, color: co.plan === "Enterprise" ? "#b45309" : co.plan === "Pro" ? "#4338ca" : "var(--text-muted)" }}>{co.plan}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{co.jobs}</span>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "50px", fontSize: "0.68rem", fontWeight: 700, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, width: "fit-content" }}>{co.status}</span>
              <div style={{ display: "flex", gap: "5px" }}>
                {co.status === "Pending" && (
                  <button type="button" style={{ padding: "5px 9px", borderRadius: "7px", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", color: "#047857", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>Verify</button>
                )}
                <button type="button" style={{ padding: "5px 9px", borderRadius: "7px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>View</button>
                <button type="button" style={{ padding: "5px 9px", borderRadius: "7px", background: "#f1f5f9", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}>···</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
