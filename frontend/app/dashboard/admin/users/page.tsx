"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface UserItem {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  isBanned?: boolean;
  isVerified?: boolean;
  companyName?: string;
  createdAt: string;
}

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  recruiter: { bg: "rgba(79,70,229,0.08)", text: "#4338ca", border: "rgba(79,70,229,0.2)" },
  candidate: { bg: "rgba(2,132,199,0.08)", text: "#0369a1", border: "rgba(2,132,199,0.2)" },
  admin: { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<"All" | "recruiter" | "candidate" | "admin">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getUsers();
      if (res.success) {
        const list = res.data || res.users || [];
        setUsers(list);
      }
    } catch (err) {
      console.error("Error fetching admin users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBan = async (user: UserItem) => {
    if (user.role === "admin") {
      alert("Admin users cannot be banned.");
      return;
    }
    const action = user.isBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      const res = await adminApi.toggleUserBan(user._id || user.id || "");
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => ((u._id || u.id) === (user._id || user.id) ? { ...u, isBanned: !u.isBanned } : u))
        );
      } else {
        alert(res.message || `Failed to ${action} user.`);
      }
    } catch (err: any) {
      alert(err.message || `Failed to ${action} user.`);
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (user.role === "admin") {
      alert("Admin accounts cannot be deleted directly.");
      return;
    }
    if (!confirm(`Permanently delete account for ${user.name}? This action cannot be undone.`)) return;

    try {
      const res = await adminApi.deleteUser(user._id || user.id || "");
      if (res.success) {
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== (user._id || user.id)));
      } else {
        alert(res.message || "Failed to delete user.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(search.toLowerCase()));
    return matchRole && matchSearch;
  });

  const counts = {
    All: users.length,
    candidate: users.filter((u) => u.role === "candidate").length,
    recruiter: users.filter((u) => u.role === "recruiter").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>User Management</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>View platform registered accounts, enforce ban moderation, or delete accounts.</p>
        </div>
      </div>

      {/* Summary Chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
        {[
          { label: "Total Users", value: users.length, icon: "👥", color: "#4f46e5" },
          { label: "Candidates", value: counts.candidate, icon: "🔍", color: "#0284c7" },
          { label: "Recruiters", value: counts.recruiter, icon: "🏢", color: "#059669" },
          { label: "Banned", value: users.filter((u) => u.isBanned).length, icon: "🚫", color: "#dc2626" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "18px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontFamily: "var(--font-display,'Outfit',sans-serif)", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div className="recruiter-jobs-header">
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", maxWidth: "100%" }}>
          {(["All", "candidate", "recruiter", "admin"] as const).map((f) => (
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
                textTransform: "capitalize",
                whiteSpace: "nowrap",
              }}
            >
              {f === "candidate" ? "Candidates" : f === "recruiter" ? "Recruiters" : f === "admin" ? "Admins" : "All"}{" "}
              <span style={{ opacity: 0.7 }}>({counts[f as keyof typeof counts] ?? users.length})</span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search name, email, or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ width: "240px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search users"
        />
      </div>

      {/* User Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="table-responsive-wrapper">
          <div className="table-min-width">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 100px 110px 140px", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
              {["User", "Role", "Status", "Joined", "Actions"].map((col) => (
                <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
              ))}
            </div>

            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p style={{ fontWeight: 600 }}>Loading users list from server...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p>No user accounts found matching your filters.</p>
              </div>
            ) : (
              filtered.map((user, i) => {
                const rc = roleColors[user.role] || roleColors.candidate;
                const statusLabel = user.isBanned ? "Banned" : user.isVerified ? "Active" : "Unverified";
                const statusColor = user.isBanned ? { bg: "rgba(220,38,38,0.08)", text: "#b91c1c", border: "rgba(220,38,38,0.2)" } : user.isVerified ? { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" } : { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" };

                return (
                  <div
                    key={user._id || user.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 110px 100px 110px 140px",
                      padding: "14px 20px",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center",
                      background: user.isBanned ? "rgba(220,38,38,0.02)" : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{user.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {user.email} {user.companyName && `· 🏢 ${user.companyName}`}
                        </p>
                      </div>
                    </div>

                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 700, background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`, width: "fit-content", textTransform: "capitalize" }}>
                      {user.role}
                    </span>

                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 700, background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}`, width: "fit-content" }}>
                      {statusLabel}
                    </span>

                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}
                    </span>

                    {/* Action buttons: Ban/Unban, Delete ONLY */}
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {user.role !== "admin" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleBan(user)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "7px",
                              background: user.isBanned ? "rgba(5,150,105,0.08)" : "rgba(217,119,6,0.08)",
                              border: `1px solid ${user.isBanned ? "rgba(5,150,105,0.2)" : "rgba(217,119,6,0.2)"}`,
                              color: user.isBanned ? "#047857" : "#b45309",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            {user.isBanned ? "Unban" : "Ban"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            style={{ padding: "5px 10px", borderRadius: "7px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.72rem", cursor: "pointer", fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Protected Admin</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {users.length} users
      </p>
    </div>
  );
}
