"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";

const navItems = [
  { href: "/dashboard/recruiter", label: "Overview", icon: "📊", exact: true },
  { href: "/dashboard/recruiter/jobs", label: "Job Postings", icon: "💼" },
  { href: "/dashboard/recruiter/applications", label: "Applications", icon: "📋" },
  { href: "/dashboard/recruiter/candidates", label: "Candidates", icon: "👥" },
  { href: "/dashboard/recruiter/analytics", label: "Analytics", icon: "📈" },
];

const bottomItems = [
  { href: "/dashboard/recruiter/settings", label: "Settings", icon: "⚙️" },
  { href: "/", label: "Back to Main Site", icon: "🌐" },
];

export default function RecruiterSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const initials =
    mounted && user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "RC";

  const displayName = mounted && user?.name ? user.name : "Verified Recruiter";
  const displayEmail = mounted && user?.email ? user.email : "recruiter@jobify.com";
  const displayCompany = mounted && user?.companyName ? user.companyName : "Independent Employer";

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #090d16 0%, #0d1322 100%)",
        borderRight: "1px solid rgba(255, 255, 255, 0.07)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        overflowY: "auto",
        boxShadow: "4px 0 25px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Logo / Brand Header */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "19px",
              color: "white",
              flexShrink: 0,
              boxShadow: "0 0 16px rgba(99, 102, 241, 0.5)",
            }}
          >
            ⚡
          </span>
          <div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
              }}
            >
              Jobify
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#818cf8",
                marginTop: "1px",
              }}
            >
              Recruiter Portal
            </div>
          </div>
        </Link>
      </div>

      {/* Recruiter Dark Profile Card */}
      <div
        style={{
          margin: "16px 12px",
          padding: "14px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 165, 233, 0.06) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.95rem",
              fontWeight: 800,
              color: "white",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)",
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#f8fafc",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={displayName}
            >
              {displayName}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={displayEmail}
            >
              {displayEmail}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
            fontSize: "0.72rem",
            color: "#34d399",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span
            className="pulsing-dot"
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#34d399",
              display: "inline-block",
            }}
          />
          🏢 {displayCompany}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: "8px 12px" }} aria-label="Recruiter navigation">
        <div
          style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#64748b",
            padding: "8px 10px 6px",
            marginBottom: "4px",
          }}
        >
          Main Menu
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "" : "dark-sidebar-nav-item"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "12px",
                marginBottom: "4px",
                textDecoration: "none",
                background: active
                  ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                  : "transparent",
                border: active
                  ? "1px solid rgba(165, 180, 252, 0.3)"
                  : "1px solid transparent",
                color: active ? "#ffffff" : "#94a3b8",
                fontWeight: active ? 700 : 500,
                fontSize: "0.875rem",
                boxShadow: active ? "0 4px 16px rgba(99, 102, 241, 0.4)" : "none",
                position: "relative",
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "22px",
                    background: "#a5b4fc",
                    borderRadius: "0 3px 3px 0",
                    boxShadow: "0 0 8px #a5b4fc",
                  }}
                />
              )}
              <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action Links & Logout Button */}
      <div
        style={{
          padding: "14px 12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="dark-sidebar-nav-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#94a3b8",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "1.05rem" }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Dark Animated Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="dark-logout-btn"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.2))",
            color: "#fca5a5",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "6px",
          }}
        >
          <span style={{ fontSize: "1.05rem" }}>🚪</span>
          <span>Logout / Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
