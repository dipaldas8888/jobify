"use client";

import { useState } from "react";

const candidates = [
  { id: 1, name: "Jordan Lee", role: "Frontend Engineer", experience: "5 yrs", location: "San Francisco, CA", skills: ["React", "TypeScript", "GraphQL"], status: "Available", match: 94, avatar: "JL", salary: "$140k" },
  { id: 2, name: "Maya Patel", role: "Product Manager", experience: "7 yrs", location: "New York, NY", skills: ["Strategy", "Analytics", "Roadmap"], status: "Open to offers", match: 91, avatar: "MP", salary: "$160k" },
  { id: 3, name: "Ryan Chen", role: "Backend Developer", experience: "4 yrs", location: "Remote", skills: ["Go", "PostgreSQL", "gRPC"], status: "Available", match: 88, avatar: "RC", salary: "$130k" },
  { id: 4, name: "Sofia Rodriguez", role: "UX Designer", experience: "6 yrs", location: "Austin, TX", skills: ["Figma", "User Research", "Prototyping"], status: "Hired", match: 86, avatar: "SR", salary: "$120k" },
  { id: 5, name: "Marcus Williams", role: "DevOps Engineer", experience: "8 yrs", location: "Seattle, WA", skills: ["Kubernetes", "AWS", "Terraform"], status: "Open to offers", match: 83, avatar: "MW", salary: "$155k" },
  { id: 6, name: "Priya Sharma", role: "Data Scientist", experience: "5 yrs", location: "Remote", skills: ["Python", "PyTorch", "Spark"], status: "Available", match: 81, avatar: "PS", salary: "$145k" },
  { id: 7, name: "Emma Wilson", role: "iOS Developer", experience: "3 yrs", location: "San Jose, CA", skills: ["Swift", "SwiftUI", "Core Data"], status: "Available", match: 79, avatar: "EW", salary: "$125k" },
  { id: 8, name: "Liam O'Brien", role: "Security Engineer", experience: "6 yrs", location: "Remote", skills: ["Cryptography", "Rust", "Pentesting"], status: "Not looking", match: 76, avatar: "LO", salary: "$165k" },
];

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
  "linear-gradient(135deg,#ea580c,#f97316)",
  "linear-gradient(135deg,#0d9488,#14b8a6)",
];

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by name, role, or skill…"
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
          style={{ minWidth: "160px", borderRadius: "10px" }}
          aria-label="Filter by status"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Open to offers">Open to offers</option>
          <option value="Hired">Hired</option>
          <option value="Not looking">Not looking</option>
        </select>
        <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {filtered.length} candidates
        </p>
      </div>

      {/* Candidate Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
        {filtered.map((c, i) => {
          const sc = statusColors[c.status];
          const matchColor = c.match >= 90 ? "#047857" : c.match >= 80 ? "#0369a1" : "#b45309";
          return (
            <div
              key={c.id}
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "20px",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--shadow-card)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,70,229,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(79,70,229,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
              }}
            >
              {/* Match score badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: `${matchColor}10`,
                  border: `2px solid ${matchColor}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: matchColor,
                }}
                title={`${c.match}% match score`}
              >
                {c.match}%
              </div>

              {/* Header */}
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingRight: "52px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: gradients[i % gradients.length],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {c.avatar}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "2px" }}>{c.name}</h3>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>{c.role}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>📍 {c.location}</p>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "flex", gap: "12px", marginTop: "14px", marginBottom: "14px" }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{c.experience}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Experience</p>
                </div>
                <div style={{ width: "1px", background: "var(--border)" }} />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>{c.salary}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Expected</p>
                </div>
                <div style={{ width: "1px", background: "var(--border)" }} />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: "50px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      background: sc.bg,
                      color: sc.text,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                {c.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "50px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: "rgba(2,132,199,0.08)",
                      color: "#0369a1",
                      border: "1px solid rgba(2,132,199,0.2)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, padding: "8px", fontSize: "0.8rem", borderRadius: "8px" }}
                  disabled={c.status === "Not looking"}
                >
                  Reach Out
                </button>
                <button
                  type="button"
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
