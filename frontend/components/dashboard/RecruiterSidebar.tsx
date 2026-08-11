"use client";

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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RC";

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
        overflowY: "auto",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "white",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(79,70,229,0.25)",
            }}
          >
            ⚡
          </span>
          <div>
            <div className="logo-text" style={{ fontSize: "1.1rem" }}>Jobify</div>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4f46e5",
                marginTop: "1px",
              }}
            >
              Recruiter Portal
            </div>
          </div>
        </Link>
      </div>

      {/* Dynamic Live Recruiter & Company Profile Card */}
      <div
        style={{
          margin: "16px 12px",
          padding: "14px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(79,70,229,0.06), rgba(2,132,199,0.04))",
          border: "1px solid rgba(79,70,229,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={user?.name || "Recruiter"}
            >
              {user?.name || "Verified Recruiter"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={user?.email || "recruiter@jobify.com"}
            >
              {user?.email || "recruiter@jobify.com"}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
            fontSize: "0.72rem",
            color: "#059669",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#059669", display: "inline-block" }} />
          🏢 {user?.companyName ? user.companyName : "Independent Employer"}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: "8px 12px" }} aria-label="Recruiter navigation">
        <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", padding: "8px 8px 6px", marginBottom: "4px" }}>
          Main Menu
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                marginBottom: "2px",
                textDecoration: "none",
                background: active ? "rgba(79, 70, 229, 0.08)" : "transparent",
                border: active ? "1px solid rgba(79, 70, 229, 0.15)" : "1px solid transparent",
                color: active ? "#4338ca" : "var(--text-secondary)",
                fontWeight: active ? 600 : 500,
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
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
                    height: "20px",
                    background: "var(--primary)",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action Links & Logout Button */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "4px" }}>
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "10px",
              textDecoration: "none",
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Sidebar Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            background: "rgba(220, 38, 38, 0.05)",
            color: "#dc2626",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "6px",
            transition: "all 0.2s ease",
          }}
        >
          <span>🚪</span>
          <span>Logout / Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
