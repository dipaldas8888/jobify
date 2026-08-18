"use client";

import { useState, useRef, useEffect } from "react";
import RecruiterSidebar from "@/components/dashboard/RecruiterSidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[pathname] ?? "Dashboard";
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "RC";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("jobify_splash_shown", "true");
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (err) {}
    }
    dispatch(logout());
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

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

        {/* User Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "50px",
              padding: "4px 12px 4px 4px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "white",
              }}
            >
              {initials}
            </div>
            <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {user?.name || "Recruiter"}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>▼</span>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "220px",
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                padding: "8px",
                zIndex: 50,
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", marginBottom: "4px" }}>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{user?.name || "Recruiter"}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</p>
              </div>

              <Link
                href="/dashboard/recruiter/company-profile"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "0.825rem",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
                className="dropdown-item-hover"
              >
                🏢 Company Profile
              </Link>

              <Link
                href="/dashboard/recruiter/settings"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "0.825rem",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
                className="dropdown-item-hover"
              >
                ⚙️ Settings
              </Link>

              <div style={{ borderTop: "1px solid var(--border)", marginTop: "4px", paddingTop: "4px" }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "0.825rem",
                    color: "#dc2626",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    textAlign: "left",
                  }}
                  className="dropdown-item-hover"
                >
                  🚪 Logout / Sign Out
                </button>
              </div>
            </div>
          )}
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
