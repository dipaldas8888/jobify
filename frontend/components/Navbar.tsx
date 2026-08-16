"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setAuthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardHref = () => {
    if (!user) return "/auth/login";
    if (user.role === "recruiter") return "/dashboard/recruiter";
    if (user.role === "admin") return "/dashboard/admin";
    return "/jobs";
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    router.push("/");
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container-main">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "68px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="logo-text" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
                }}
              >
                ⚡
              </span>
              Jobify
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#4f46e5" : "var(--text-secondary)",
                    textDecoration: "none",
                    background: isActive ? "rgba(79, 70, 229, 0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(79, 70, 229, 0.15)" : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      (e.currentTarget as HTMLElement).style.background = "#f1f5f9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>          {/* Desktop CTA & User Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="desktop-auth-controls">
              {!mounted ? null : isAuthenticated && user ? (

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Dashboard Button (Matching Image 1) */}
                  <Link
                    href={getDashboardHref()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "7px 16px",
                      borderRadius: "50px",
                      background: "#ffffff",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,70,229,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#ffffff";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>📊</span>
                    <span>Dashboard</span>
                  </Link>

                  {/* Avatar Button & Profile Dropdown (Matching Image 1: [D] Dipal) */}
                  <div style={{ position: "relative" }} ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "5px 12px 5px 5px",
                        borderRadius: "50px",
                        background: "#ffffff",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease",
                      }}
                      aria-expanded={profileDropdownOpen}
                      aria-label="User menu"
                    >
                      <span
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {firstLetter}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {user.name.split(" ")[0]}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {profileDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 8px)",
                          width: "220px",
                          background: "#ffffff",
                          border: "1px solid var(--border)",
                          borderRadius: "16px",
                          padding: "8px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                          zIndex: 110,
                        }}
                        className="animate-fade-in-up"
                      >
                        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", marginBottom: "4px" }}>
                          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>{user.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "6px",
                              padding: "2px 8px",
                              borderRadius: "50px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              background: "rgba(79,70,229,0.08)",
                              color: "#4f46e5",
                              textTransform: "capitalize",
                            }}
                          >
                            {user.role}
                          </span>
                        </div>

                        <Link
                          href={getDashboardHref()}
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            color: "var(--text-primary)",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          className="dropdown-item-hover"
                        >
                          <span>📊</span> Dashboard
                        </Link>

                        <Link
                          href="/jobs"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            color: "var(--text-primary)",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          className="dropdown-item-hover"
                        >
                          <span>💼</span> Browse Jobs
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
                              padding: "9px 12px",
                              borderRadius: "10px",
                              fontSize: "0.85rem",
                              color: "#dc2626",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 600,
                              textAlign: "left",
                            }}
                          >
                            <span>🚪</span> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* NOT LOGGED IN STATE - Internshala Style Dropdown (Matching 3rd Screenshot / Image 2) */
                <div style={{ position: "relative" }} ref={authDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    onMouseEnter={() => setAuthDropdownOpen(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 18px",
                      borderRadius: "8px",
                      background: "rgba(2, 132, 199, 0.08)",
                      border: "1px solid rgba(2, 132, 199, 0.25)",
                      color: "#0284c7",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span>Login / Register</span>
                    <span style={{ fontSize: "0.75rem" }}>{authDropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {/* Internshala Style Dropdown Menu */}
                  {authDropdownOpen && (
                    <div
                      onMouseLeave={() => setAuthDropdownOpen(false)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 4px)",
                        width: "220px",
                        background: "#ffffff",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "8px 0",
                        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.12)",
                        zIndex: 110,
                      }}
                      className="animate-fade-in-up"
                    >
                      <Link
                        href="/auth/register?role=candidate"
                        onClick={() => setAuthDropdownOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 18px",
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          fontWeight: 500,
                          transition: "background 0.15s, color 0.15s",
                        }}
                        className="dropdown-item-hover"
                      >
                        Register as a candidate
                      </Link>

                      <Link
                        href="/auth/register?role=recruiter"
                        onClick={() => setAuthDropdownOpen(false)}
                        style={{
                          display: "block",
                          padding: "10px 18px",
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          fontWeight: 500,
                          transition: "background 0.15s, color 0.15s",
                        }}
                        className="dropdown-item-hover"
                      >
                        Register as an employer
                      </Link>

                      <div style={{ borderTop: "1px solid var(--border)", marginTop: "4px", paddingTop: "4px" }}>
                        <Link
                          href="/auth/login"
                          onClick={() => setAuthDropdownOpen(false)}
                          style={{
                            display: "block",
                            padding: "10px 18px",
                            fontSize: "0.875rem",
                            color: "#4f46e5",
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                          className="dropdown-item-hover"
                        >
                          Login
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "var(--text-primary)",
                flexDirection: "column",
                gap: "5px",
              }}
              className="mobile-menu-btn"
            >
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "currentColor",
                  borderRadius: "2px",
                  transition: "transform 0.3s",
                  transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "currentColor",
                  borderRadius: "2px",
                  opacity: mobileOpen ? 0 : 1,
                  transition: "opacity 0.3s",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  background: "currentColor",
                  borderRadius: "2px",
                  transition: "transform 0.3s",
                  transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              background: "#ffffff",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#4f46e5" : "var(--text-secondary)",
                    textDecoration: "none",
                    background: isActive ? "rgba(79, 70, 229, 0.08)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", paddingLeft: "4px" }}>
              {!mounted ? null : isAuthenticated && user ? (

                <>
                  <Link href={getDashboardHref()} className="btn-primary" style={{ padding: "10px", textAlign: "center", fontSize: "0.875rem" }}>
                    Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn-secondary" style={{ padding: "10px", fontSize: "0.875rem" }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/register?role=candidate" className="btn-secondary" style={{ padding: "10px", textAlign: "center", fontSize: "0.875rem" }}>
                    Register as Candidate
                  </Link>
                  <Link href="/auth/register?role=recruiter" className="btn-secondary" style={{ padding: "10px", textAlign: "center", fontSize: "0.875rem" }}>
                    Register as Employer
                  </Link>
                  <Link href="/auth/login" className="btn-primary" style={{ padding: "10px", textAlign: "center", fontSize: "0.875rem" }}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .dropdown-item-hover:hover {
          background-color: #f1f5f9 !important;
          color: #4f46e5 !important;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth-controls { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
