"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";

const initialPlatformStats = [
  { label: "Total Users", value: "10.2M", change: "+48K", icon: "👥", color: "#4f46e5" },
  { label: "Active Jobs", value: "52,411", change: "+1,240", icon: "💼", color: "#0284c7" },
  { label: "Companies", value: "25,341", change: "+312", icon: "🏢", color: "#059669" },
  { label: "Monthly Revenue", value: "$2.4M", change: "+$180K", icon: "💰", color: "#d97706" },
  { label: "Applications Today", value: "18,430", change: "+2,100", icon: "📋", color: "#db2777" },
  { label: "Hires This Month", value: "4,218", change: "+634", icon: "🎉", color: "#7c3aed" },
];

const fallbackUsers = [
  { name: "Arjun Mehta", email: "arjun@acmecorp.com", role: "Recruiter", plan: "Pro", joined: "2 min ago", status: "Active" },
  { name: "Lisa Chen", email: "lchen@techstartup.io", role: "Job Seeker", plan: "Free", joined: "8 min ago", status: "Active" },
  { name: "David Park", email: "dpark@globaltech.com", role: "Recruiter", plan: "Enterprise", joined: "15 min ago", status: "Pending" },
  { name: "Fatima Al-Rashid", email: "fatima@design.co", role: "Job Seeker", plan: "Free", joined: "22 min ago", status: "Active" },
  { name: "Tom Bridges", email: "tbridges@recruiter.net", role: "Recruiter", plan: "Pro", joined: "31 min ago", status: "Active" },
];

const pendingReview = [
  { type: "Company Verification", name: "NovaTech Solutions", submitted: "1 hr ago", priority: "High" },
  { type: "Job Flag", name: "Software Engineer @ XYZ", submitted: "2 hr ago", priority: "Medium" },
  { type: "Abuse Report", name: "User #482910", submitted: "3 hr ago", priority: "High" },
];

const platformHealth = [
  { name: "API Response Time", value: "124ms", status: "good", target: "<200ms" },
  { name: "DB Query Time", value: "18ms", status: "good", target: "<50ms" },
  { name: "Search Latency", value: "380ms", status: "warn", target: "<250ms" },
  { name: "CDN Cache Hit Rate", value: "94%", status: "good", target: ">90%" },
  { name: "Error Rate", value: "0.04%", status: "good", target: "<0.1%" },
];

function StatCard({ stat }: { stat: typeof initialPlatformStats[0] }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "22px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: stat.color, borderRadius: "16px 16px 0 0" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }}>{stat.label}</p>
          <p style={{ fontFamily: "var(--font-display,'Outfit',sans-serif)", fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{stat.value}</p>
          <p style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600, marginTop: "6px" }}>{stat.change} today</p>
        </div>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${stat.color}10`, border: `1px solid ${stat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [platformStats, setPlatformStats] = useState(initialPlatformStats);
  const [recentUsers, setRecentUsers] = useState(fallbackUsers);

  useEffect(() => {
    adminApi.getAnalytics().then((res) => {
      if (res.success && res.analytics) {
        const a = res.analytics;
        setPlatformStats([
          { label: "Total Users", value: String(a.totalUsers || 0), change: "+2", icon: "👥", color: "#4f46e5" },
          { label: "Active Jobs", value: String(a.totalJobs || 0), change: "+1", icon: "💼", color: "#0284c7" },
          { label: "Companies", value: String(a.totalCompanies || 0), change: "+1", icon: "🏢", color: "#059669" },
          { label: "Monthly Revenue", value: "$2.4M", change: "+$180K", icon: "💰", color: "#d97706" },
          { label: "Applications Total", value: String(a.totalApplications || 0), change: "+3", icon: "📋", color: "#db2777" },
          { label: "Reports Flagged", value: String(a.totalReports || 0), change: "0", icon: "🚩", color: "#7c3aed" },
        ]);
      }
    });

    adminApi.getUsers().then((res) => {
      if (res.success && Array.isArray(res.users)) {
        setRecentUsers(
          res.users.slice(0, 5).map((u: any) => ({
            name: u.name,
            email: u.email,
            role: u.role === "recruiter" ? "Recruiter" : u.role === "admin" ? "Admin" : "Job Seeker",
            plan: u.role === "recruiter" ? "Pro" : "Free",
            joined: new Date(u.createdAt).toLocaleDateString(),
            status: u.isBanned ? "Banned" : u.isVerified ? "Active" : "Pending",
          }))
        );
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Alert Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(217,119,6,0.06), rgba(220,38,38,0.04))",
          border: "1px solid rgba(217,119,6,0.2)",
          borderRadius: "14px",
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.25rem" }}>⚠️</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#b45309" }}>3 items require your attention</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>2 company verifications, 1 abuse report pending review</p>
          </div>
        </div>
        <Link href="/dashboard/admin/users" style={{ padding: "8px 18px", borderRadius: "8px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.25)", color: "#b45309", textDecoration: "none", fontSize: "0.825rem", fontWeight: 700 }}>
          Review Now →
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        {platformStats.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>

        {/* Recent Users */}
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>Recent Registrations</h3>
            <Link href="/dashboard/admin/users" style={{ fontSize: "0.8rem", color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
          </div>
          {recentUsers.map((u, i) => (
            <div
              key={u.email}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 22px",
                borderBottom: i < recentUsers.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `hsl(${i * 60}, 70%, 45%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                {u.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{u.name}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.email}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: u.role === "Recruiter" ? "#4f46e5" : "var(--text-secondary)", marginBottom: "2px" }}>{u.role}</span>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{u.joined}</span>
              </div>
              <span style={{
                padding: "3px 8px", borderRadius: "50px", fontSize: "0.68rem", fontWeight: 700,
                background: u.status === "Active" ? "rgba(5,150,105,0.08)" : "rgba(217,119,6,0.08)",
                color: u.status === "Active" ? "#047857" : "#b45309",
                border: `1px solid ${u.status === "Active" ? "rgba(5,150,105,0.2)" : "rgba(217,119,6,0.2)"}`,
                flexShrink: 0,
              }}>
                {u.status}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Pending Review */}
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "14px" }}>Pending Review</h3>
            {pendingReview.map((item) => (
              <div key={item.name} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>{item.type}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: 600, marginTop: "2px" }}>{item.name}</p>
                    <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>{item.submitted}</p>
                  </div>
                  <span style={{
                    padding: "3px 8px", borderRadius: "50px", fontSize: "0.65rem", fontWeight: 700,
                    background: item.priority === "High" ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)",
                    color: item.priority === "High" ? "#b91c1c" : "#b45309",
                    border: `1px solid ${item.priority === "High" ? "rgba(220,38,38,0.2)" : "rgba(217,119,6,0.2)"}`,
                    flexShrink: 0,
                  }}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Health */}
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "14px" }}>Platform Health</h3>
            {platformHealth.map((h) => (
              <div key={h.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{h.name}</span>
                <span style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: h.status === "good" ? "#047857" : "#b45309",
                }}>
                  {h.status === "good" ? "●" : "⚠"} {h.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
