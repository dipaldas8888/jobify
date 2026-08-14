"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { jobsApi } from "@/lib/api";
import { mockJobs, type Job } from "@/data/mockJobs";
import { useAppSelector } from "@/lib/redux/store";

// Helper component to format recruiter description into structured, beautiful sections
function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;

  // Split text by double newlines or lines that look like headings
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const sections: { title?: string; items: string[] }[] = [];
  let currentSection: { title?: string; items: string[] } = { items: [] };

  lines.forEach((line) => {
    // Detect section headers ending with ":" or starting with common header titles
    const isHeader =
      line.endsWith(":") ||
      /^(what you|responsibilities|requirements|qualifications|about the role|overview|perks|benefits|skills|who you are)/i.test(
        line
      );

    if (isHeader && currentSection.items.length > 0) {
      sections.push(currentSection);
      currentSection = { title: line.replace(/:$/, ""), items: [] };
    } else if (isHeader) {
      currentSection.title = line.replace(/:$/, "");
    } else {
      currentSection.items.push(line);
    }
  });

  if (currentSection.items.length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  // Helper for header icon
  const getHeaderIcon = (title?: string) => {
    if (!title) return "📝";
    const t = title.toLowerCase();
    if (t.includes("do") || t.includes("responsibilit")) return "🎯";
    if (t.includes("require") || t.includes("qualificat") || t.includes("skill")) return "⚡";
    if (t.includes("benefit") || t.includes("perk")) return "🎁";
    if (t.includes("about") || t.includes("overview")) return "💡";
    return "📌";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {sections.map((sec, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sec.title && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "rgba(79,70,229,0.08)",
                  border: "1px solid rgba(79,70,229,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                {getHeaderIcon(sec.title)}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {sec.title}
              </h3>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: sec.title ? "4px" : "0" }}>
            {sec.items.map((item, i) => {
              const isBullet = item.startsWith("-") || item.startsWith("•") || item.startsWith("*");
              const cleanItem = item.replace(/^[-•*]\s*/, "");

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                  }}
                >
                  {isBullet ? (
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "rgba(79,70,229,0.1)",
                        color: "#4f46e5",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 900,
                        marginTop: "4px",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  ) : null}
                  <p style={{ margin: 0, flex: 1 }}>{cleanItem}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAppSelector((state) => state.auth);

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await jobsApi.getJobById(id);
      if (res.success && res.data) {
        const j = res.data;
        const formattedJob: Job = {
          id: j._id || j.id,
          title: j.title,
          company: j.company || (j.recruiter?.companyName) || "Jobify Employer Partner",
          location: j.location || "Remote",
          type: j.jobType || "Full-time",
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive Salary",
          experience: j.experience || "Mid Level",
          description: j.description || "No description provided.",
          tags: j.skillsRequired || ["Engineering"],
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
          companyLogo: (j.company || "J").charAt(0).toUpperCase(),
          companyColor: "linear-gradient(135deg, #4f46e5, #6366f1)",
          applicants: j.applicantsCount || 1,
          featured: j.status === "Published",
        };
        setJob(formattedJob);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.log("Backend job fetch error, checking mock fallback:", err);
    }

    const foundMock = mockJobs.find((m) => String(m.id) === String(id));
    if (foundMock) {
      setJob(foundMock);
    } else {
      setError("Job posting not found.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 68px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="glow-orb glow-orb-primary" style={{ width: "80px", height: "80px", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#ffffff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "550px", width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
            Job Posting Not Found
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
            The job listing you are looking for may have expired or been removed by the employer.
          </p>
          <Link href="/jobs" className="btn-primary" style={{ padding: "12px 32px", borderRadius: "50px", textDecoration: "none" }}>
            Browse All Jobs →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, var(--bg-base) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "36px 0 28px",
        }}
        className="bg-grid"
      >
        <div className="container-main">
          {/* Breadcrumb Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/jobs" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Jobs</Link>
            <span>/</span>
            <span style={{ color: "#4f46e5", fontWeight: 600 }}>{job.title}</span>
          </div>

          {/* Job Banner Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "22px",
              padding: "32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              position: "relative",
            }}
            className="animate-fade-in-up"
          >
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Monogram Logo */}
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "18px",
                  background: job.companyColor || "linear-gradient(135deg, #4f46e5, #6366f1)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.9rem",
                  fontWeight: 800,
                  boxShadow: "0 8px 20px rgba(79,70,229,0.25)",
                  flexShrink: 0,
                }}
              >
                {job.companyLogo || job.company.charAt(0)}
              </div>

              {/* Job Title & Info */}
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <h1
                    style={{
                      fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                      fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span style={{ padding: "4px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#b45309", border: "1px solid rgba(245,158,11,0.25)" }}>
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.95rem", color: "var(--text-secondary)", flexWrap: "wrap", marginBottom: "18px" }}>
                  <span style={{ fontWeight: 800, color: "#4f46e5" }}>🏢 {job.company}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span>📍 {job.location}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span>📅 Posted {job.postedAt}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span>👥 {job.applicants} {job.applicants === 1 ? "Applicant" : "Applicants"}</span>
                </div>

                {/* Badges Bar */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="badge badge-primary" style={{ padding: "5px 14px", borderRadius: "50px", fontSize: "0.825rem", fontWeight: 700 }}>
                    {job.type}
                  </span>
                  <span className="badge badge-accent" style={{ padding: "5px 14px", borderRadius: "50px", fontSize: "0.825rem", fontWeight: 700 }}>
                    {job.experience}
                  </span>
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: "50px",
                      fontSize: "0.825rem",
                      fontWeight: 700,
                      background: "rgba(5,150,105,0.08)",
                      color: "#047857",
                      border: "1px solid rgba(5,150,105,0.2)",
                    }}
                  >
                    💰 {job.salary}
                  </span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  style={{
                    padding: "13px 20px",
                    borderRadius: "14px",
                    background: isSaved ? "rgba(79,70,229,0.08)" : "#ffffff",
                    border: "1px solid var(--border)",
                    color: isSaved ? "#4f46e5" : "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  {isSaved ? "♥ Saved" : "♡ Save"}
                </button>

                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="btn-primary"
                  style={{
                    padding: "13px 32px",
                    borderRadius: "14px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 6px 18px rgba(79,70,229,0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Apply For Job →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container-main" style={{ marginTop: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px" }} className="job-detail-layout">

          {/* Left Column: Recruiter Content & Skills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Recruiter Description Section */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "36px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "24px",
                  paddingBottom: "14px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Job Details & Description
              </h2>

              <FormattedDescription text={job.description} />
            </div>

            {/* Required Skills & Expertise */}
            {job.tags && job.tags.length > 0 && (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "32px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    ⚡
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Required Skills & Technologies
                  </h2>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {job.tags.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        padding: "9px 18px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Overview Card & Company Spotlight */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Quick Overview Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "26px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "20px",
                }}
              >
                Job Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(79,70,229,0.08)",
                      color: "#4f46e5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    💼
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>JOB TYPE</p>
                    <p style={{ fontSize: "0.925rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>{job.type}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(2,132,199,0.08)",
                      color: "#0284c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    📍
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>LOCATION</p>
                    <p style={{ fontSize: "0.925rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>{job.location}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(5,150,105,0.08)",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    💰
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>SALARY</p>
                    <p style={{ fontSize: "0.925rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>{job.salary}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(217,119,6,0.08)",
                      color: "#d97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>EXPERIENCE</p>
                    <p style={{ fontSize: "0.925rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>{job.experience}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(124,58,237,0.08)",
                      color: "#7c3aed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    📅
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>DATE POSTED</p>
                    <p style={{ fontSize: "0.925rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>{job.postedAt}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="btn-primary"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "13px",
                    borderRadius: "12px",
                    fontSize: "0.925rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                  }}
                >
                  Apply For Job Now →
                </Link>
              </div>
            </div>

            {/* Employer Spotlight */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "26px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: job.companyColor || "linear-gradient(135deg, #4f46e5, #6366f1)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {job.companyLogo || job.company.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {job.company}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
                    ✓ Verified Employer Partner
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
