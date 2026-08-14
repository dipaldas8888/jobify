"use client";

import Link from "next/link";

const footerLinks = {
  "For Job Seekers": [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Companies", href: "/companies" },
    { label: "Career Advice", href: "/blog" },
    { label: "Resume Builder", href: "/tools/resume" },
    { label: "Salary Calculator", href: "/tools/salary" },
  ],
  "For Employers": [
    { label: "Post a Job", href: "/post-job" },
    { label: "Talent Search", href: "/talent" },
    { label: "Pricing", href: "/pricing" },
    { label: "Recruiter Tools", href: "/recruiter" },
    { label: "Success Stories", href: "/stories" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Security", href: "/security" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

const socials = [
  { label: "Twitter / X", icon: "𝕏", href: "#" },
  { label: "LinkedIn", icon: "in", href: "#" },
  { label: "GitHub", icon: "⌥", href: "#" },
  { label: "YouTube", icon: "▶", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#ffffff",
        borderTop: "1px solid var(--border)",
        marginTop: "auto",
      }}
      role="contentinfo"
    >
      {/* Newsletter CTA */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(2,132,199,0.03) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container-main" style={{ padding: "48px 24px", textAlign: "center" }}>
          <h3
            style={{
              fontFamily: "var(--font-display, 'Outfit', sans-serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "8px",
            }}
          >
            Never miss a great opportunity
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              marginBottom: "24px",
              maxWidth: "480px",
              margin: "0 auto 24px",
            }}
          >
            Get the latest job listings from top companies delivered to your inbox weekly.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: "flex",
              gap: "8px",
              maxWidth: "440px",
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="search-input"
              style={{ flex: "1", minWidth: "180px", maxWidth: "100%", borderRadius: "50px" }}
              aria-label="Email address for newsletter"
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-main" style={{ padding: "60px 24px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
          }}
        >
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
                }}
              >
                ⚡
              </span>
              <span className="logo-text">Jobify</span>
            </Link>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: "1.7",
                marginTop: "16px",
                maxWidth: "280px",
              }}
            >
              The modern job platform connecting top talent with innovative companies across the globe.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#4f46e5";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,70,229,0.3)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(79,70,229,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "24px", marginTop: "28px" }}>
              {[
                { value: "50K+", label: "Jobs Posted" },
                { value: "10M+", label: "Job Seekers" },
                { value: "25K+", label: "Companies" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#4f46e5" }}>{stat.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
            }}
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "16px",
                  }}
                >
                  {category}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "#4f46e5";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 24px",
          background: "#f8fafc",
        }}
      >
        <div
          className="container-main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
            © {currentYear} Jobify, Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  fontSize: "0.825rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#4f46e5")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
              >
                {item}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.825rem", color: "var(--text-muted)" }}>
            Made with{" "}
            <span style={{ color: "#ef4444" }}>♥</span>
            {" "}for developers
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          footer > div:nth-child(2) > div > div:first-child {
            grid-column: span 1;
          }
          footer > div:nth-child(2) > div {
            grid-template-columns: 300px 1fr !important;
          }
          footer > div:nth-child(2) > div > div:last-child {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  );
}
