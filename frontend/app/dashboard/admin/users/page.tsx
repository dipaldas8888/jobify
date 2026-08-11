"use client";

import { useState } from "react";

const users = [
  { id: 1, name: "Sarah Reynolds", email: "sreynolds@acmecorp.com", role: "Recruiter", plan: "Pro", status: "Active", joined: "Jan 12, 2025", jobs: 24 },
  { id: 2, name: "Jordan Lee", email: "jlee@gmail.com", role: "Job Seeker", plan: "Free", status: "Active", joined: "Mar 5, 2025", jobs: 0 },
  { id: 3, name: "David Park", email: "dpark@globaltech.com", role: "Recruiter", plan: "Enterprise", status: "Pending", joined: "Aug 4, 2026", jobs: 0 },
  { id: 4, name: "Maya Patel", email: "mpatel@startup.io", role: "Job Seeker", plan: "Free", status: "Active", joined: "Feb 20, 2025", jobs: 0 },
  { id: 5, name: "Alex Torres", email: "atorres@bigco.com", role: "Recruiter", plan: "Pro", status: "Suspended", joined: "Nov 8, 2024", jobs: 7 },
  { id: 6, name: "Emma Wilson", email: "ewilson@design.co", role: "Job Seeker", plan: "Free", status: "Active", joined: "Apr 14, 2026", jobs: 0 },
  { id: 7, name: "Marcus Kim", email: "mkim@techcorp.net", role: "Recruiter", plan: "Enterprise", status: "Active", joined: "Sep 3, 2024", jobs: 41 },
  { id: 8, name: "Priya Sharma", email: "psharma@freelance.dev", role: "Job Seeker", plan: "Free", status: "Active", joined: "Jun 1, 2026", jobs: 0 },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  Recruiter: { bg: "rgba(79,70,229,0.08)", text: "#4338ca" },
  "Job Seeker": { bg: "rgba(2,132,199,0.08)", text: "#0369a1" },
  Admin: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c" },
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Pending: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Suspended: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

const planColors: Record<string, string> = {
  Free: "var(--text-muted)",
  Pro: "#4338ca",
  Enterprise: "#b45309",
};

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    All: users.length,
    Recruiter: users.filter(u => u.role === "Recruiter").length,
    "Job Seeker": users.filter(u => u.role === "Job Seeker").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Summary Chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "Total Users", value: "10.2M", icon: "👥", color: "#4f46e5" },
          { label: "Recruiters", value: "84K", icon: "🏢", color: "#059669" },
          { label: "Job Seekers", value: "10.1M", icon: "🔍", color: "#0284c7" },
          { label: "Suspended", value: "1,204", icon: "🚫", color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontFamily: "var(--font-display,'Outfit',sans-serif)", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        {(["All", "Recruiter", "Job Seeker"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setRoleFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: "50px",
              border: roleFilter === f ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
              background: roleFilter === f ? "rgba(220,38,38,0.08)" : "#ffffff",
              color: roleFilter === f ? "#b91c1c" : "var(--text-secondary)",
              fontWeight: roleFilter === f ? 700 : 500,
              fontSize: "0.825rem",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            {f} ({counts[f as keyof typeof counts] ?? users.length})
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ width: "220px", padding: "9px 14px", borderRadius: "10px" }}
            aria-label="Search users"
          />
          <button type="button" style={{ padding: "9px 18px", borderRadius: "10px", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>
            + Invite User
          </button>
        </div>
      </div>

      {/* User Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 90px 100px 110px 130px", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
          {["User", "Role", "Plan", "Status", "Joined", "Actions"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
          ))}
        </div>

        {filtered.map((user, i) => {
          const rc = roleColors[user.role] ?? roleColors["Job Seeker"];
          const sc = statusColors[user.status];
          return (
            <div
              key={user.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 90px 100px 110px 130px",
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `hsl(${user.id * 47}, 65%, 45%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{user.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{user.email}</p>
                </div>
              </div>
              <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: "50px", fontSize: "0.68rem", fontWeight: 700, background: rc.bg, color: rc.text, width: "fit-content" }}>{user.role}</span>
              <span style={{ fontSize: "0.825rem", fontWeight: 700, color: planColors[user.plan] }}>{user.plan}</span>
              <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: "50px", fontSize: "0.68rem", fontWeight: 700, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, width: "fit-content" }}>{user.status}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.joined}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button type="button" style={{ padding: "5px 10px", borderRadius: "7px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>View</button>
                <button type="button" style={{ padding: "5px 10px", borderRadius: "7px", background: "#f1f5f9", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer", fontFamily: "inherit" }}>···</button>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {users.length} (sample data)
      </p>
    </div>
  );
}
