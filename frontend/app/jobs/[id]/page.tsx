"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { jobsApi } from "@/lib/api";
import { mockJobs, type Job } from "@/data/mockJobs";
import { useAppSelector } from "@/lib/redux/store";

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

    // First try backend API
    try {
      const res = await jobsApi.getJobById(id);
      if (res.success && res.data) {
        const j = res.data;
        const formattedJob: Job = {
          id: j._id || j.id,
          title: j.title,
          company: j.company || (j.recruiter?.companyName) || "Jobify Partner",
          location: j.location || "Remote",
          type: j.jobType || "Full-time",
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive Salary",
          experience: j.experience || "Mid Level",
          description: j.description || "No description provided.",
          tags: j.skillsRequired || ["Engineering"],
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
          companyLogo: (j.company || "J").charAt(0),
          companyColor: "linear-gradient(135deg, #4f46e5, #6366f1)",
          applicants: j.applicantsCount || 12,
          featured: j.status === "Published",
        };
        setJob(formattedJob);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.log("Backend job fetch error, falling back to mock data check:", err);
    }

    // Fallback to mockJobs if backend ID not found or mock ID used
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
          <div className="glow-orb glow-orb-primary" style={{ width: "100px", height: "100px", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-secondary)" }}>
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
          minHeight: "calc(100vh - 68px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "var(--shadow-card)",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Job Not Found
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.9rem" }}>
            The job posting you are looking for may have expired or been removed.
          </p>
          <Link href="/jobs" className="btn-primary" style={{ padding: "12px 24px", borderRadius: "12px" }}>
            ← Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Glow Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, var(--bg-base) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "40px 0 32px",
        }}
        className="bg-grid"
      >
        <div className="container-main">
          {/* Breadcrumbs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px" }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/jobs" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Jobs</Link>
            <span>/</span>
            <span style={{ color: "#4f46e5", fontWeight: 600 }}>{job.title}</span>
          </div>

          {/* Job Main Banner Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "var(--shadow-card)",
              position: "relative",
            }}
            className="animate-fade-in-up"
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Company Logo Monogram */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: job.companyColor || "linear-gradient(135deg, #4f46e5, #6366f1)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  boxShadow: "0 6px 16px rgba(79,70,229,0.25)",
                  flexShrink: 0,
                }}
              >
                {job.companyLogo || job.company.charAt(0)}
              </div>

              {/* Title & Info */}
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <h1
                    style={{
                      fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                      fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                    }}
                  >
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="badge badge-accent" style={{ background: "rgba(245,158,11,0.1)", color: "#b45309", border: "1px solid rgba(245,158,11,0.25)" }}>
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.95rem", color: "var(--text-secondary)", flexWrap: "wrap", marginBottom: "16px" }}>
                  <span style={{ fontWeight: 700, color: "#4f46e5" }}>{job.company}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span>📍 {job.location}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span>🕐 Posted {job.postedAt}</span>
                  <span style={{ color: "var(--text-muted)" }}>•</span>
                  <span>👥 {job.applicants} Applicants</span>
                </div>

                {/* Tag Pills */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="badge badge-primary">{job.type}</span>
                  <span className="badge badge-accent">{job.experience}</span>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "50px",
                      fontSize: "0.85rem",
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

              {/* Action CTA Buttons */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: "12px",
                    background: isSaved ? "rgba(79,70,229,0.08)" : "#ffffff",
                    border: "1px solid var(--border)",
                    color: isSaved ? "#4f46e5" : "var(--text-primary)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                >
                  {isSaved ? "♥ Saved" : "♡ Save"}
                </button>

                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="btn-primary"
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
                  }}
                >
                  Apply For This Job →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="container-main" style={{ marginTop: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>

          {/* Left Column: Full Description & Requirements */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Overview */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
                Job Description
              </h2>
              <div
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                  whiteSpace: "pre-line",
                }}
              >
                {job.description}
              </div>
            </div>

            {/* Skills Required */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
                Required Skills & Expertise
              </h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {job.tags.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      background: "#f1f5f9",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    ⚡ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities & Benefits */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
                What You&apos;ll Do
              </h2>
              <ul style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem", paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>Collaborate with cross-functional product and design teams to build user-facing features.</li>
                <li style={{ marginBottom: "8px" }}>Design, develop, and test high quality scalable frontend code and integrations.</li>
                <li style={{ marginBottom: "8px" }}>Optimize web applications for maximum speed, scalability, and cross-browser accessibility.</li>
                <li style={{ marginBottom: "8px" }}>Participate in peer code reviews and contribute to architecture design documents.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Summary Card & Recruiter Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Job Summary Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "18px" }}>
                Job Overview
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(79,70,229,0.08)", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                    📅
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>POSTED ON</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{job.postedAt}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(2,132,199,0.08)", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                    📍
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>LOCATION</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{job.location}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(5,150,105,0.08)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                    💰
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>SALARY</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{job.salary}</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.08)", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                    💼
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>JOB TYPE</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{job.type}</p>
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
                    padding: "12px",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Apply Now →
                </Link>
              </div>
            </div>

            {/* Company Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
                About {job.company}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                {job.company} is a leading innovator building modern software products for high-growth tech companies worldwide.
              </p>
              <Link
                href="/companies"
                style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}
              >
                View Company Profile →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
