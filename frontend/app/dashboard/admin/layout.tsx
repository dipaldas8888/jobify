"use client";

import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard/admin": "Platform Overview",
  "/dashboard/admin/users": "User Management",
  "/dashboard/admin/jobs": "Job Listings",
  "/dashboard/admin/companies": "Companies",
  "/dashboard/admin/reports": "Reports & Analytics",
  "/dashboard/admin/settings": "Platform Settings",
  "/dashboard/admin/system": "System Health",
};

function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin Console";
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <header
      style={{
        height: "64px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div>
        <h1 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>{title}</h1>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{now}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Alert indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            background: "rgba(217,119,6,0.08)",
            border: "1px solid rgba(217,119,6,0.2)",
            fontSize: "0.75rem",
            color: "#b45309",
            fontWeight: 600,
          }}
        >
          ⚠️ 3 items need review
        </div>

        {/* Notification bell */}
        <button
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "#ffffff",
            border: "1px solid var(--border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            position: "relative",
            color: "var(--text-secondary)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
          aria-label="Notifications"
          type="button"
        >
          🔔
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #ffffff",
            }}
          />
        </button>

        {/* Admin Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "white",
            cursor: "pointer",
            border: "2px solid rgba(239,68,68,0.3)",
            boxShadow: "0 2px 6px rgba(239,68,68,0.25)",
          }}
          aria-label="Admin menu"
          role="button"
          tabIndex={0}
        >
          AD
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminSidebar />
      <div style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminHeader />
        <div style={{ flex: 1, padding: "28px", overflowX: "hidden" }}>{children}</div>
      </div>
    </div>
  );
}
