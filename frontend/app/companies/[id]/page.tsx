"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COMPANIES_DATA, type Company } from "@/data/companiesData";


import { jobsApi } from "@/lib/api";
import { mockJobs, type Job } from "@/data/mockJobs";

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.id;

  const [company, setCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "culture">("overview");

  useEffect(() => {
    const found = COMPANIES_DATA.find((c) => c.id === companyId);
    if (found) {
      setCompany(found);
    } else {
      // Fallback generator for custom companies
      setCompany({
        id: companyId,
        name: companyId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        tagline: "Building revolutionary products for businesses and consumers.",
        industry: "Technology & Software",
        location: "San Francisco, CA",
        employees: "100 - 500",
        openJobsCount: 4,
        rating: 4.8,
        reviewsCount: 88,
        logo: companyId.charAt(0).toUpperCase(),
        logoBg: "linear-gradient(135deg, #4f46e5, #6366f1)",
        description:
          "We are a team of passionate engineers, designers, and thinkers crafting software that shapes the future. We value transparency, high autonomy, and continuous learning.",
        perks: ["Remote Work", "Health & Dental", "Equity", "Flexible Hours", "Learning Allowance"],
      });
    }
  }, [companyId]);

  useEffect(() => {
    if (!company) return;

    // Fetch matching jobs
    jobsApi.getJobs().then((res) => {
      const raw = Array.isArray(res.data) ? res.data : Array.isArray(res.jobs) ? res.jobs : [];
      const dbJobs: Job[] = raw
        .filter((j: any) => (j.company || "").toLowerCase().includes(company.name.toLowerCase()))
        .map((j: any) => ({
          id: j._id || j.id,
          title: j.title,
          company: j.company || company.name,
          location: j.location || company.location,
          type: j.jobType || "Full-time",
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive",
          experience: j.experience || "Mid Level",
          description: j.description || "",
          tags: j.skillsRequired || ["Engineering"],
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
          companyLogo: company.logo,
          companyColor: company.logoBg,
          applicants: j.applicantsCount || 0,
        }));

      const mockMatches = mockJobs.filter((j) =>
        j.company.toLowerCase().includes(company.name.toLowerCase())
      );

      const combined = [...dbJobs, ...mockMatches];
      setCompanyJobs(combined.length > 0 ? combined : mockJobs.slice(0, 3));
    });
  }, [company]);

  if (!company) return null;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Banner Header */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "40px 0 30px",
        }}
      >
        <div className="container-main">
          <Link
            href="/companies"
            style={{
              textDecoration: "none",
              color: "#4f46e5",
              fontWeight: 600,
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "24px",
            }}
          >
            ← Back to Companies
          </Link>

          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Logo */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: company.logoBg,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                fontWeight: 800,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                flexShrink: 0,
              }}
            >
              {company.logo}
            </div>

            {/* Main Info */}
            <div style={{ flex: 1, minWidth: "280px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{company.name}</h1>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "rgba(79,70,229,0.1)",
                    color: "#4f46e5",
                  }}
                >
                  {company.industry}
                </span>
              </div>

              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                {company.tagline}
              </p>

              {/* Meta Badges */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  flexWrap: "wrap",
                }}
              >
                <span>📍 {company.location}</span>
                <span>•</span>
                <span>👥 {company.employees} Employees</span>
                <span>•</span>
                <span style={{ color: "#d97706", fontWeight: 700 }}>
                  ★ {company.rating} ({company.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ textDecoration: "none", padding: "10px 20px", fontSize: "0.9rem", borderRadius: "10px" }}
              >
                Visit Website ↗
              </a>
              <a
                href="#open-jobs"
                onClick={() => setActiveTab("jobs")}
                className="btn-primary"
                style={{ textDecoration: "none", padding: "10px 24px", fontSize: "0.9rem", borderRadius: "10px" }}
              >
                View Jobs ({companyJobs.length})
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              borderBottom: "1px solid var(--border)",
              marginTop: "36px",
            }}
          >
            {[
              { id: "overview", label: "Overview & About" },
              { id: "jobs", label: `Open Jobs (${companyJobs.length})` },
              { id: "culture", label: "Culture & Perks" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  padding: "12px 4px",
                  fontSize: "0.95rem",
                  fontWeight: activeTab === t.id ? 700 : 500,
                  color: activeTab === t.id ? "#4f46e5" : "var(--text-secondary)",
                  borderBottom: activeTab === t.id ? "3px solid #4f46e5" : "3px solid transparent",
                  background: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="container-main" style={{ padding: "40px 20px 80px" }}>
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
            {/* Left Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* About Section */}
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
                }}
              >
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                  About {company.name}
                </h2>
                <p style={{ fontSize: "0.975rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
                  {company.description}
                </p>
                <p style={{ fontSize: "0.975rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  We believe in building software with craftsmanship, empathy, and speed. Our team works iteratively, encouraging team members to take initiative and champion new ideas that impact millions of users worldwide.
                </p>
              </div>

              {/* Tech Stack / Highlights */}
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid var(--border)",
                }}
              >
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                  🛠️ Core Tech Stack & Tools
                </h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Next.js", "AWS Cloud", "Docker", "Kubernetes", "Tailwind CSS"].map(
                    (tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          background: "#f1f5f9",
                          color: "#334155",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar Widget */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid var(--border)",
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                  Company Snapshot
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Industry</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{company.industry}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Company Size</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{company.employees}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Headquarters</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{company.location}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Founded</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>2018</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Open Positions</span>
                    <span style={{ fontWeight: 700, color: "#059669" }}>{companyJobs.length} Jobs</span>
                  </div>
                </div>
              </div>

              {/* Employee Perks */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(79,70,229,0.04), rgba(2,132,199,0.03))",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid rgba(79,70,229,0.15)",
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#4f46e5", marginBottom: "12px" }}>
                  🎁 Key Employee Benefits
                </h3>
                <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  {company.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div id="open-jobs" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              Current Job Openings at {company.name} ({companyJobs.length})
            </h2>

            {companyJobs.map((job) => (
              <div
                key={job.id}
                className="job-card"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
                    <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      {job.title}
                    </Link>
                  </h3>
                  <div style={{ display: "flex", gap: "12px", fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <span>📍 {job.location}</span>
                    <span>•</span>
                    <span style={{ color: "#059669", fontWeight: 600 }}>{job.type}</span>
                    <span>•</span>
                    <span>💰 {job.salary}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="btn-secondary"
                    style={{ padding: "8px 18px", fontSize: "0.85rem", textDecoration: "none", borderRadius: "8px" }}
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/jobs/${job.id}/apply`}
                    className="btn-primary"
                    style={{ padding: "8px 20px", fontSize: "0.85rem", textDecoration: "none", borderRadius: "8px" }}
                  >
                    Apply Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "culture" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid var(--border)",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
                Company Culture & Work Environment
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {[
                  { title: "🏡 Work Flexibility", desc: "Remote-first or hybrid environment with flexible hours and focus time." },
                  { title: "🌱 Growth & Ownership", desc: "High trust and autonomy. Every employee shapes product strategy." },
                  { title: "🤝 Collaborative Team", desc: "Inclusive workplace culture with mentorship and cross-functional teams." },
                  { title: "⚖️ Work-Life Harmony", desc: "Generous PTO, mental health days, and wellness stipends." },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      padding: "20px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
