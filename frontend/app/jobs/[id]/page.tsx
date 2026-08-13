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
        <div style={{ maxWidth: "650px", width: "100%", margin: "0 auto" }}>
          {/* SVG Illustration */}
          <svg
            viewBox="0 0 800 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", maxHeight: "380px", marginBottom: "24px" }}
            aria-hidden="true"
          >
            <path d="M 230 100 L 244 114 M 244 100 L 230 114" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 535 180 L 549 194 M 549 180 L 535 194" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 235 350 L 249 364 M 249 350 L 235 364" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="220" y="150" width="100" height="70" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="220" y1="168" x2="320" y2="168" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="230" cy="159" r="2.5" fill="#cbd5e1" />
            <circle cx="238" cy="159" r="2.5" fill="#cbd5e1" />
            <circle cx="246" cy="159" r="2.5" fill="#cbd5e1" />
            <path d="M 260 195 L 270 185 M 264 189 A 5 5 0 0 1 271 182 L 275 186 A 5 5 0 0 1 268 193 M 262 197 A 5 5 0 0 1 255 190 L 259 186 A 5 5 0 0 1 266 193" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <rect x="420" y="80" width="100" height="60" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
            <path d="M 440 140 L 448 150 L 456 140 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
            <text x="470" y="122" textAnchor="middle" fill="#ef4444" fontSize="32" fontWeight="800" fontFamily="sans-serif">404</text>
            <line x1="240" y1="420" x2="570" y2="420" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
            <path d="M 280 420 L 295 290 M 295 290 L 320 420" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 520 420 L 510 290 M 510 290 L 540 420" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="245" y="285" width="330" height="8" rx="4" fill="#cbd5e1" />
            <rect x="275" y="240" width="45" height="45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
            <line x1="282" y1="250" x2="310" y2="250" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="282" y1="258" x2="312" y2="258" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="282" y1="266" x2="305" y2="266" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="272" y="275" width="50" height="10" rx="3" fill="#ef4444" opacity="0.8" />
            <rect x="450" y="195" width="95" height="75" rx="6" fill="#475569" />
            <rect x="455" y="200" width="85" height="65" rx="3" fill="#334155" />
            <polygon points="490,270 505,270 502,285 493,285" fill="#64748b" />
            <rect x="480" y="285" width="35" height="4" rx="2" fill="#64748b" />
            <line x1="465" y1="215" x2="505" y2="215" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="465" y1="225" x2="520" y2="225" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="465" y1="235" x2="495" y2="235" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
            <rect x="535" y="245" width="10" height="40" fill="#ef4444" rx="2" />
            <rect x="548" y="245" width="10" height="40" fill="#f87171" rx="2" />
            <polygon points="530,360 550,360 546,420 534,420" fill="#e2e8f0" />
            <path d="M 540 360 C 510 320, 520 290, 540 280 C 535 310, 540 340, 540 360 Z" fill="#86efac" />
            <path d="M 540 360 C 570 320, 560 290, 540 280 C 545 310, 540 340, 540 360 Z" fill="#4ade80" />
            <path d="M 540 360 C 520 330, 500 350, 540 360 Z" fill="#22c55e" />
            <rect x="295" y="235" width="55" height="80" rx="8" fill="#334155" />
            <rect x="290" y="300" width="65" height="15" rx="4" fill="#1e293b" />
            <rect x="317" y="315" width="10" height="60" fill="#64748b" />
            <path d="M 322 375 L 290 415 M 322 375 L 354 415 M 322 375 L 322 418" stroke="#475569" strokeWidth="4" />
            <circle cx="290" cy="416" r="5" fill="#1e293b" />
            <circle cx="354" cy="416" r="5" fill="#1e293b" />
            <circle cx="322" cy="419" r="5" fill="#1e293b" />
            <path d="M 320 310 L 375 310 L 385 410 L 355 410 L 350 350 L 335 350 L 330 410 L 305 410 Z" fill="#eab308" />
            <ellipse cx="300" cy="412" rx="12" ry="6" fill="#1e293b" />
            <ellipse cx="380" cy="412" rx="12" ry="6" fill="#1e293b" />
            <path d="M 294 409 Q 300 405 306 409" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 374 409 Q 380 405 386 409" stroke="#ffffff" strokeWidth="1.5" />
            <path d="M 320 250 Q 355 240 375 255 L 370 315 L 315 315 Z" fill="#8b5cf6" />
            <rect x="338" y="235" width="12" height="18" fill="#fed7aa" />
            <ellipse cx="344" cy="215" rx="16" ry="20" fill="#fed7aa" />
            <path d="M 328 215 C 328 195, 360 195, 360 215 C 355 205, 345 200, 335 205 Z" fill="#1e293b" />
            <circle cx="340" cy="212" r="2" fill="#1e293b" />
            <circle cx="350" cy="212" r="2" fill="#1e293b" />
            <path d="M 340 224 Q 345 220 350 224" stroke="#1e293b" strokeWidth="1.5" fill="none" />
            <path d="M 336 206 L 343 208" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 347 208 L 354 206" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 325 255 Q 310 270, 335 285" stroke="#8b5cf6" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M 365 255 Q 395 270, 365 285" stroke="#8b5cf6" strokeWidth="12" strokeLinecap="round" fill="none" />
            <circle cx="337" cy="285" r="7" fill="#fed7aa" />
            <circle cx="363" cy="285" r="7" fill="#fed7aa" />
            <line x1="335" y1="295" x2="335" y2="265" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
            <polygon points="335,263 333,267 337,267" fill="#1e293b" />
            <rect x="318" y="278" width="5" height="10" fill="#1e293b" rx="1" />
          </svg>

          <h2
            style={{
              fontFamily: "var(--font-inter, 'Inter', sans-serif)",
              fontSize: "1.35rem",
              fontWeight: 600,
              color: "#475569",
              marginBottom: "28px",
              lineHeight: 1.4,
            }}
          >
            Sorry, this job posting was not found or has been removed!
          </h2>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/jobs"
              style={{
                padding: "14px 42px",
                borderRadius: "50px",
                background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(239, 68, 68, 0.35)",
                transition: "all 0.25s ease",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              BROWSE JOBS
            </Link>

            <Link
              href="/"
              style={{
                padding: "14px 32px",
                borderRadius: "50px",
                background: "#ffffff",
                color: "#475569",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.25s ease",
              }}
            >
              Home Page 🏠
            </Link>
          </div>
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
