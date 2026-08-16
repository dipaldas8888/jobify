"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jobsApi } from "@/lib/api";
import { mockJobs, type Job } from "@/data/mockJobs";
import { useAppSelector } from "@/lib/redux/store";

export default function ApplyJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [job, setJob] = useState<Job | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState<boolean>(true);

  // Form State
  const [fullName, setFullName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    fetchJobInfo();
  }, [id]);

  const fetchJobInfo = async () => {
    setIsLoadingJob(true);
    try {
      const res = await jobsApi.getJobById(id);
      if (res.success && res.data) {
        const j = res.data;
        setJob({
          id: j._id || j.id,
          title: j.title,
          company: j.company || "Jobify Partner",
          location: j.location || "Remote",
          type: j.jobType || "Full-time",
          salary: j.salary ? `$${Number(j.salary).toLocaleString()}/yr` : "Competitive",
          experience: j.experience || "Mid Level",
          description: j.description || "",
          tags: j.skillsRequired || [],
          postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Recently",
          companyLogo: (j.company || "J").charAt(0),
          companyColor: "linear-gradient(135deg, #4f46e5, #6366f1)",
          applicants: 0,
          featured: j.status === "Published",
        });
        setIsLoadingJob(false);
        return;
      }
    } catch (err) {
      console.log("Error loading job for apply page:", err);
    }

    const mock = mockJobs.find((m) => String(m.id) === String(id));
    if (mock) {
      setJob(mock);
    }
    setIsLoadingJob(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!user) {
      setMessage({
        type: "error",
        text: "You must be signed in to submit a job application. Please log in first.",
      });
      return;
    }

    if (!coverLetter.trim()) {
      setMessage({ type: "error", text: "Please provide a cover letter or introductory statement." });
      return;
    }

    if (!resumeFile && !resumeUrl && !user?.photo) {
      // Check if user has uploaded resume
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      formData.append("phone", phone);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      } else if (resumeUrl) {
        formData.append("resumeUrl", resumeUrl);
      }


      const res = await jobsApi.applyJob(id, formData);

      if (res.success) {
        setMessage({
          type: "success",
          text: "🎉 Application submitted successfully! The recruiter will review your profile shortly.",
        });
        setTimeout(() => {
          router.push(`/jobs/${id}`);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to submit application. Please check your details.",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error submitting application.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 68px)",
        background: "var(--bg-base)",
        padding: "40px 20px",
        position: "relative",
      }}
      className="bg-grid"
    >
      <div
        className="glow-orb glow-orb-primary"
        style={{ width: "350px", height: "350px", top: "-50px", left: "-50px", opacity: 0.15 }}
      />

      <div className="container-main" style={{ maxWidth: "720px" }}>
        {/* Navigation back */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            href={`/jobs/${id}`}
            style={{ fontSize: "0.875rem", color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}
          >
            ← Back to Job Details
          </Link>
        </div>

        {/* Job Header Card */}
        {job && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "24px 28px",
              marginBottom: "24px",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
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

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                Apply for {job.title}
              </h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                <strong style={{ color: "#4f46e5" }}>{job.company}</strong> • 📍 {job.location} • 💰 {job.salary}
              </p>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "36px 32px",
            boxShadow: "var(--shadow-card)",
          }}
          className="animate-fade-in-up"
        >
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
            Submit Your Application
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
            Complete the fields below to apply directly to the employer.
          </p>

          {!user && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(217,119,6,0.08)",
                border: "1px solid rgba(217,119,6,0.2)",
                color: "#b45309",
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              💡 You are currently not signed in.{" "}
              <Link href="/auth/login" style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: 700 }}>
                Click here to sign in
              </Link>{" "}
              before applying.
            </div>
          )}

          {message && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "24px",
                background: message.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
                color: message.type === "success" ? "#047857" : "#b91c1c",
                border: `1px solid ${message.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Resume / CV File *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFile(e.target.files[0]);
                  }
                }}
                className="search-input"
                style={{ borderRadius: "12px", padding: "10px" }}
              />

              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Accepted formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Cover Letter / Personal Note *
              </label>
              <textarea
                rows={5}
                placeholder="Introduce yourself and explain why you're a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px", resize: "vertical" }}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
              <Link
                href={`/jobs/${id}`}
                className="btn-secondary"
                style={{ padding: "12px 24px", borderRadius: "12px", textDecoration: "none", fontSize: "0.9rem" }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !user}
                style={{
                  padding: "12px 32px",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  opacity: isSubmitting || !user ? 0.6 : 1,
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Application →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
