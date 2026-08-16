"use client";

import RecruiterSidebar from "@/components/dashboard/RecruiterSidebar";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard/recruiter": "Overview",
  "/dashboard/recruiter/jobs": "Job Postings",
  "/dashboard/recruiter/applications": "Applications",
  "/dashboard/recruiter/candidates": "Candidates",
  "/dashboard/recruiter/analytics": "Analytics",
  "/dashboard/recruiter/company-profile": "Company Profile",
  "/dashboard/recruiter/settings": "Settings",
};


function DashboardHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";
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



        {/* Avatar */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4f46e5, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "white",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(79,70,229,0.25)",
          }}
          aria-label="User menu"
          role="button"
          tabIndex={0}
        >
          SR
        </div>
      </div>
    </header>
  );
}

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <RecruiterSidebar />
      <div className="dashboard-main" style={{ display: "flex", flexDirection: "column" }}>
        <DashboardHeader />
        <div style={{ flex: 1, padding: "28px", overflowX: "hidden" }}>{children}</div>
      </div>
    </div>
  );
}
