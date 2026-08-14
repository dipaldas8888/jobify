"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { jobsApi } from "@/lib/api";
import { type Job, jobCategories } from "@/data/mockJobs";

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);

  useEffect(() => {
    jobsApi.getJobs().then((res) => {
      const rawList = Array.isArray(res.data) ? res.data : Array.isArray(res.jobs) ? res.jobs : [];
      if (res.success && rawList.length > 0) {
        const formatted: Job[] = rawList.map((j: any) => ({
          id: j._id || j.id,
          title: j.title,
          company: j.company || j.recruiter?.companyName || "Jobify Recruiter",
          location: j.location || "Remote",
          type: j.jobType || "Full-time",
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive Salary",
          experience: j.experience || "Mid Level",
          description: j.description || "",
          tags: j.skillsRequired && j.skillsRequired.length > 0 ? j.skillsRequired : ["Engineering"],
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
          companyLogo: (j.company || "J").charAt(0),
          companyColor: "linear-gradient(135deg, #4f46e5, #6366f1)",
          applicants: j.applicantsCount || 0,
          featured: true,
        }));
        setFeaturedJobs(formatted.slice(0, 3));
      }
    }).catch(() => {});
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--bg-base)" }}>
      {/* ===================== HERO SECTION ===================== */}
      <section
        aria-label="Hero"
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
        className="bg-grid"
      >
        {/* Decorative glow orbs */}
        <div
          className="glow-orb glow-orb-primary"
          style={{ width: "600px", height: "600px", top: "-100px", left: "-150px" }}
        />
        <div
          className="glow-orb glow-orb-accent"
          style={{ width: "500px", height: "500px", bottom: "-50px", right: "-100px" }}
        />
        <div
          className="glow-orb glow-orb-pink"
          style={{ width: "300px", height: "300px", top: "30%", right: "20%" }}
        />

        <div className="container-main" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "50px",
                background: "rgba(79,70,229,0.08)",
                border: "1px solid rgba(79,70,229,0.2)",
                fontSize: "0.825rem",
                fontWeight: 600,
                color: "#4338ca",
                marginBottom: "28px",
                animation: "fadeIn 0.6s ease forwards",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#059669", display: "inline-block", animation: "pulse-orb 2s infinite" }} />
              🎉 50,000+ jobs from 25,000+ companies
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "24px",
              }}
              className="animate-fade-in-up"
            >
              Find your dream job
              <br />
              <span className="gradient-text">faster than ever</span>
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: "560px",
                margin: "0 auto 40px",
              }}
              className="animate-fade-in-up delay-100"
            >
              Connect with top companies hiring right now. Thousands of remote,
              full-time, and contract roles — all in one place.
            </p>

            {/* Search Bar */}
            <div
              className="hero-search animate-fade-in-up delay-200"
              style={{ maxWidth: "640px", margin: "0 auto 20px" }}
              role="search"
            >
              <span style={{ fontSize: "1.25rem", paddingLeft: "8px" }}>🔍</span>
              <input
                type="text"
                placeholder='Search "Frontend Engineer", "Remote Design", "AI Engineer"...'
                aria-label="Job search"
                id="hero-search-input"
              />
              <Link
                href="/jobs"
                className="btn-primary"
                style={{ borderRadius: "10px", whiteSpace: "nowrap" }}
              >
                Search Jobs
              </Link>
            </div>

            {/* Popular Searches */}
            <div
              className="animate-fade-in-up delay-300"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                marginBottom: "64px",
              }}
            >
              <span style={{ fontSize: "0.825rem", color: "var(--text-muted)", alignSelf: "center" }}>
                Popular:
              </span>
              {["React Developer", "UI/UX Designer", "Python Engineer", "Remote Jobs", "AI Engineer"].map((term) => (
                <Link
                  key={term}
                  href={`/jobs?q=${encodeURIComponent(term)}`}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "50px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    background: "#ffffff",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#4f46e5";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,70,229,0.3)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(79,70,229,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.background = "#ffffff";
                  }}
                >
                  {term}
                </Link>
              ))}
            </div>

            {/* Stat Row */}
            <div
              className="animate-fade-in-up delay-400"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "48px",
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "50K+", label: "Active Jobs" },
                { value: "25K+", label: "Companies" },
                { value: "10M+", label: "Job Seekers" },
                { value: "98%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                    }}
                    className="gradient-text"
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background: "linear-gradient(transparent, var(--bg-base))",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ===================== JOB CATEGORIES ===================== */}
      <section
        aria-labelledby="categories-heading"
        style={{ padding: "80px 0" }}
      >
        <div className="container-main">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              id="categories-heading"
              style={{
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Browse by category
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Explore thousands of opportunities in every field
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {jobCategories.map((cat, i) => (
              <Link
                key={cat.label}
                href={`/jobs?category=${encodeURIComponent(cat.label)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="stat-card"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    animation: `fadeInUp 0.5s ease forwards`,
                    animationDelay: `${i * 0.07}s`,
                    opacity: 0,
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{cat.icon}</div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                      marginBottom: "6px",
                    }}
                  >
                    {cat.label}
                  </h3>
                  <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                    {cat.count.toLocaleString()} open roles
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== FEATURED JOBS ===================== */}
      <section aria-labelledby="featured-heading" style={{ padding: "80px 0" }}>
        <div className="container-main">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h2
                id="featured-heading"
                style={{
                  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                }}
              >
                Featured opportunities
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                Hand-picked roles from top-tier companies
              </p>
            </div>
            <Link href="/jobs" className="btn-secondary">
              View all jobs →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {featuredJobs.map((job, i) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="job-card"
                  style={{
                    animation: `fadeInUp 0.5s ease forwards`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Company Logo */}
                    <div
                      className="company-logo"
                      style={{ background: job.companyColor, color: "white" }}
                    >
                      {job.companyLogo}
                    </div>

                    {/* Job Info */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {job.title}
                        </h3>
                        {job.featured && (
                          <span className="badge badge-primary">⭐ Featured</span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap",
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#4f46e5" }}>{job.company}</span>
                        <span>📍 {job.location}</span>
                        <span>🕐 {job.postedAt}</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {job.tags.map((tag) => (
                          <span key={tag} className="badge badge-accent">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Side */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "10px",
                        minWidth: "160px",
                      }}
                    >
                      <span className="badge badge-success">{job.type}</span>
                      <span
                        style={{
                          fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {job.salary}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          background: "#f1f5f9",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {job.experience}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/jobs" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 36px" }}>
              Explore all 50,000+ jobs →
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== HOW IT WORKS ===================== */}
      <section aria-labelledby="how-heading" style={{ padding: "80px 0" }}>
        <div className="container-main">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              id="how-heading"
              style={{
                fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              How Jobify works
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
              Land your perfect role in three simple steps
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                step: "01",
                icon: "🎯",
                title: "Create your profile",
                description:
                  "Set up your profile in minutes. Add your skills, experience, and what you're looking for in your next role.",
              },
              {
                step: "02",
                icon: "🔍",
                title: "Discover matching jobs",
                description:
                  "Our smart matching algorithm surfaces the most relevant opportunities based on your skills and preferences.",
              },
              {
                step: "03",
                icon: "🚀",
                title: "Apply with one click",
                description:
                  "Apply to multiple positions instantly. Track your applications and get real-time updates from employers.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="glass-card"
                style={{
                  padding: "36px 28px",
                  position: "relative",
                  animation: `fadeInUp 0.6s ease forwards`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0,
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: "var(--primary)",
                    marginBottom: "16px",
                    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  }}
                >
                  STEP {item.step}
                </div>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{item.icon}</div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "var(--text-primary)",
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===================== CTA BANNER ===================== */}
      <section aria-labelledby="cta-heading" style={{ padding: "80px 0" }}>
        <div className="container-main">
          <div
            style={{
              borderRadius: "24px",
              padding: "64px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(2,132,199,0.04) 50%, rgba(219,39,119,0.03) 100%)",
              border: "1px solid rgba(79,70,229,0.15)",
              boxShadow: "0 10px 30px -5px rgba(79,70,229,0.08)",
            }}
          >
            <div
              className="glow-orb glow-orb-primary"
              style={{ width: "400px", height: "400px", top: "-100px", left: "10%", opacity: 0.2 }}
            />
            <div
              className="glow-orb glow-orb-accent"
              style={{ width: "300px", height: "300px", bottom: "-80px", right: "10%", opacity: 0.15 }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                id="cta-heading"
                style={{
                  fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                }}
              >
                Ready to find your{" "}
                <span className="gradient-text">next opportunity?</span>
              </h2>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                  marginBottom: "36px",
                  maxWidth: "520px",
                  margin: "0 auto 36px",
                }}
              >
                Join 10 million professionals who trust Jobify to find their perfect match.
                It&apos;s free to get started.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/auth/register"
                  className="btn-primary"
                  style={{ fontSize: "1rem", padding: "14px 36px" }}
                >
                  🚀 Create free account
                </Link>
                <Link href="/jobs" className="btn-secondary" style={{ fontSize: "1rem", padding: "14px 36px" }}>
                  Browse jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
