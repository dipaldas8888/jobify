"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import StickerPeelLogo from "@/components/StickerPeelLogo";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { logout } from "@/lib/redux/slices/authSlice";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/jobs", label: "Find Jobs", icon: "💼" },
  { href: "/companies", label: "Companies", icon: "🏢" },
  { href: "/about", label: "About", icon: "✨" },
];

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    setProfileDropdownOpen(false);
    setAuthDropdownOpen(false);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(79, 70, 229, 0.12)" : "1px solid var(--border)",
        boxShadow: scrolled
          ? "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(79, 70, 229, 0.05)"
          : "0 1px 4px rgba(0, 0, 0, 0.03)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "68px",
          }}
        >
          {/* Logo with Hover Bounce */}
          <div className="navbar-logo-wrap">
            <StickerPeelLogo size="md" />
          </div>

          {/* Desktop Nav Links with Floating Pill Effect */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(241, 245, 249, 0.6)",
              padding: "4px 8px",
              borderRadius: "50px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-item-link ${isActive ? "active" : ""}`}
                  style={{
                    position: "relative",
                    padding: "7px 18px",
                    borderRadius: "50px",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? "700" : "500",
                    color: isActive ? "#4f46e5" : "var(--text-secondary)",
                    textDecoration: "none",
                    background: isActive ? "#ffffff" : "transparent",
                    boxShadow: isActive ? "0 2px 8px rgba(79, 70, 229, 0.12)" : "none",
                    border: isActive ? "1px solid rgba(79, 70, 229, 0.2)" : "1px solid transparent",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "0.95rem" }}>{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "12px",
                        height: "3px",
                        borderRadius: "50px",
                        background: "#4f46e5",
                        boxShadow: "0 0 8px #4f46e5",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA & User Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="desktop-auth-controls">
              {!mounted ? null : isAuthenticated && user ? (

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Portal Action Pill */}
                  <Link
                    href={user.role === "recruiter" ? "/dashboard/recruiter" : user.role === "admin" ? "/dashboard/admin" : "/profile"}
                    className="portal-badge-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 18px",
                      borderRadius: "50px",
                      background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(99, 102, 241, 0.12) 100%)",
                      border: "1px solid rgba(79, 70, 229, 0.25)",
                      color: "#4f46e5",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 2px 6px rgba(79, 70, 229, 0.08)",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>
                      {user.role === "recruiter" ? "🏢" : user.role === "admin" ? "⚡" : "👤"}
                    </span>
                    <span>
                      {user.role === "recruiter" ? "Recruiter Portal" : user.role === "admin" ? "Admin Panel" : "My Profile"}
                    </span>
                  </Link>

                  {/* Avatar Button & Profile Dropdown */}
                  <div style={{ position: "relative" }} ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="nav-avatar-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "5px 14px 5px 5px",
                        borderRadius: "50px",
                        background: profileDropdownOpen ? "#f1f5f9" : "#ffffff",
                        border: profileDropdownOpen ? "1px solid rgba(79, 70, 229, 0.3)" : "1px solid var(--border)",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        transition: "all 0.25s ease",
                      }}
                      aria-expanded={profileDropdownOpen}
                      aria-label="User menu"
                    >
                      <span
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: 800,
                          boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
                        }}
                      >
                        {firstLetter}
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {user.name.split(" ")[0]}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          transform: profileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.25s ease",
                          display: "inline-block",
                        }}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "calc(100% + 10px)",
                          width: "230px",
                          background: "#ffffff",
                          border: "1px solid rgba(226, 232, 240, 0.9)",
                          borderRadius: "18px",
                          padding: "10px",
                          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(79, 70, 229, 0.08)",
                          zIndex: 1100,
                          animation: "navDropdownEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                          transformOrigin: "top right",
                        }}
                      >
                        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", marginBottom: "6px" }}>
                          <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)", margin: 0 }}>{user.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "8px",
                              padding: "3px 10px",
                              borderRadius: "50px",
                              fontSize: "0.675rem",
                              fontWeight: 800,
                              background: "rgba(79, 70, 229, 0.1)",
                              color: "#4f46e5",
                              border: "1px solid rgba(79, 70, 229, 0.2)",
                              textTransform: "capitalize",
                            }}
                          >
                            {user.role}
                          </span>
                        </div>

                        {user.role === "recruiter" && (
                          <Link
                            href="/dashboard/recruiter"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="nav-dropdown-item"
                          >
                            <span>🏢</span> Recruiter Portal
                          </Link>
                        )}

                        {user.role === "admin" && (
                          <Link
                            href="/dashboard/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="nav-dropdown-item"
                          >
                            <span>⚡</span> Admin Panel
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="nav-dropdown-item"
                        >
                          <span>👤</span> My Profile
                        </Link>

                        <Link
                          href="/saved-jobs"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="nav-dropdown-item"
                        >
                          <span>🔖</span> Saved Jobs
                        </Link>

                        <div style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "6px" }}>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="nav-dropdown-item"
                            style={{ width: "100%", color: "#dc2626", fontWeight: 700 }}
                          >
                            <span>🚪</span> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              ) : (
                /* NOT LOGGED IN STATE */
                <div style={{ position: "relative" }} ref={authDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    onMouseEnter={() => setAuthDropdownOpen(true)}
                    className="auth-dropdown-trigger-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 20px",
                      borderRadius: "50px",
                      background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "none",
                      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <span>Login / Register</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        transform: authDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                        display: "inline-block",
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Internshala Style Dropdown Menu with Smooth Entrance */}
                  {authDropdownOpen && (
                    <div
                      onMouseLeave={() => setAuthDropdownOpen(false)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: "230px",
                        background: "#ffffff",
                        border: "1px solid rgba(226, 232, 240, 0.9)",
                        borderRadius: "16px",
                        padding: "8px 0",
                        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.12)",
                        zIndex: 1100,
                        animation: "navDropdownEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        transformOrigin: "top right",
                      }}
                    >
                      <Link
                        href="/auth/register?role=candidate"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="nav-dropdown-item"
                      >
                        👤 Register as candidate
                      </Link>

                      <Link
                        href="/auth/register?role=recruiter"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="nav-dropdown-item"
                      >
                        🏢 Register as employer
                      </Link>

                      <div style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "6px" }}>
                        <Link
                          href="/auth/login"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="nav-dropdown-item"
                          style={{ color: "#4f46e5", fontWeight: 700 }}
                        >
                          🔑 Login
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button with Smooth Line Animations */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
              style={{
                display: "none",
                background: "rgba(241, 245, 249, 0.8)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                cursor: "pointer",
                padding: "10px",
                color: "var(--text-primary)",
                flexDirection: "column",
                gap: "5px",
                transition: "all 0.2s ease",
              }}
              className="mobile-menu-btn"
            >
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "2px",
                  background: "currentColor",
                  borderRadius: "2px",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "2px",
                  background: "currentColor",
                  borderRadius: "2px",
                  opacity: mobileOpen ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "20px",
                  height: "2px",
                  background: "currentColor",
                  borderRadius: "2px",
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown with Staggered Entrance */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "16px 8px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              background: "#ffffff",
              borderRadius: "0 0 16px 16px",
              animation: "navMobileSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
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
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? "700" : "500",
                    color: isActive ? "#4f46e5" : "var(--text-primary)",
                    textDecoration: "none",
                    background: isActive ? "rgba(79, 70, 229, 0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(79, 70, 229, 0.15)" : "1px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
              {!mounted ? null : isAuthenticated && user ? (
                <>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary"
                    style={{ padding: "12px", textAlign: "center", fontSize: "0.9rem", borderRadius: "12px" }}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ padding: "12px", fontSize: "0.9rem", borderRadius: "12px", color: "#dc2626", fontWeight: 700 }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register?role=candidate"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary"
                    style={{ padding: "12px", textAlign: "center", fontSize: "0.875rem", borderRadius: "12px" }}
                  >
                    Register as Candidate
                  </Link>
                  <Link
                    href="/auth/register?role=recruiter"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary"
                    style={{ padding: "12px", textAlign: "center", fontSize: "0.875rem", borderRadius: "12px" }}
                  >
                    Register as Employer
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary"
                    style={{ padding: "12px", textAlign: "center", fontSize: "0.9rem", borderRadius: "12px" }}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes navDropdownEntrance {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes navMobileSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-item-link:hover {
          color: #4f46e5 !important;
          background: rgba(79, 70, 229, 0.06) !important;
          transform: translateY(-1px);
        }

        .portal-badge-btn:hover {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.14) 0%, rgba(99, 102, 241, 0.2) 100%) !important;
          border-color: rgba(79, 70, 229, 0.4) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.18) !important;
        }

        .nav-avatar-btn:hover {
          border-color: rgba(79, 70, 229, 0.3) !important;
          background: #f8fafc !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
        }

        .auth-dropdown-trigger-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4) !important;
        }

        .nav-dropdown-item {
          display: flex;
          align.items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.875rem;
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .nav-dropdown-item:hover {
          background: rgba(79, 70, 229, 0.07) !important;
          color: #4f46e5 !important;
          padding-left: 18px !important;
        }

        .navbar-logo-wrap {
          transition: transform 0.25s ease;
        }

        .navbar-logo-wrap:hover {
          transform: scale(1.03);
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
