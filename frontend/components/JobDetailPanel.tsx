"use client";

import React from "react";
import { type Job } from "@/data/mockJobs";

interface JobDetailPanelProps {
  selectedJob: Job | null;
  hasApplied: boolean;
  isSaved: boolean;
  onApply: (job: Job) => void;
  onToggleSave: (jobId: string, e?: React.MouseEvent) => void;
  onDislike: (jobId: string, e?: React.MouseEvent) => void;
  onShare: (jobId: string, e?: React.MouseEvent) => void;
}

// Helper to format recruiter description into clean structured sections with bullets
function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections: { title?: string; items: string[] }[] = [];
  let currentSection: { title?: string; items: string[] } = { items: [] };

  lines.forEach((line) => {
    const isHeader =
      line.endsWith(":") ||
      /^(what you|responsibilities|requirements|qualifications|about the role|overview|perks|benefits|skills|who you are|program highlights|highlights)/i.test(
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {sections.map((sec, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {sec.title && (
            <h4
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#1e293b",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>📌</span> {sec.title}
            </h4>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {sec.items.map((item, i) => {
              const cleanItem = item.replace(/^[-•*]\s*/, "");

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "#475569",
                    lineHeight: 1.6,
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#2563eb",
                      marginTop: "9px",
                      flexShrink: 0,
                    }}
                  />
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

export default function JobDetailPanel({
  selectedJob,
  hasApplied,
  isSaved,
  onApply,
  onToggleSave,
  onDislike,
  onShare,
}: JobDetailPanelProps) {
  if (!selectedJob) {
    return (
      <div
        style={{
          height: "100%",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          textAlign: "center",
          color: "#94a3b8",
          boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "3rem", opacity: 0.4 }}>💼</div>
        <p style={{ fontSize: "1rem", fontWeight: 600, color: "#64748b", margin: 0 }}>
          Select a job to view details
        </p>
        <p style={{ fontSize: "0.825rem", color: "#94a3b8", margin: 0 }}>
          Click any job card on the left to see the full description, salary info, and apply.
        </p>
      </div>
    );
  }


  return (
    <div
      style={{
        height: "100%",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        padding: "24px 28px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >

      {/* 1. FIXED TOP HEADER & RECRUITER METADATA */}
      <div style={{ flexShrink: 0, borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "16px" }}>
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 6px",
            fontFamily: "var(--font-display, 'Outfit', sans-serif)",
          }}
        >
          {selectedJob.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.875rem", color: "#64748b", flexWrap: "wrap", marginBottom: "16px" }}>
          <a
            href={`/jobs/${selectedJob.id}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontWeight: 700, color: "#2563eb", textDecoration: "underline" }}
          >
            {selectedJob.company} ↗
          </a>
          <span>•</span>
          <span>📍 {selectedJob.location}</span>
          <span>•</span>
          <span>💼 {selectedJob.experience}</span>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {hasApplied ? (
            <button
              disabled
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                background: "rgba(34, 197, 94, 0.12)",
                color: "#15803d",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "default",
              }}
            >
              ✓ Applied
            </button>
          ) : (
            <button
              onClick={() => onApply(selectedJob)}
              className="btn-primary"
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                fontSize: "0.9rem",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
              }}
            >
              Apply with Jobify →
            </button>
          )}

          <button
            type="button"
            onClick={(e) => onToggleSave(String(selectedJob.id), e)}
            style={{
              padding: "9px 13px",
              borderRadius: "10px",
              background: isSaved ? "rgba(37,99,235,0.1)" : "#f8fafc",
              border: "1px solid #cbd5e1",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title={isSaved ? "Saved" : "Save job"}
          >
            {isSaved ? "🔖" : "📑"}
          </button>

          <button
            type="button"
            onClick={(e) => onDislike(String(selectedJob.id), e)}
            style={{
              padding: "9px 13px",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              cursor: "pointer",
              color: "#94a3b8",
            }}
            title="Hide job"
          >
            👎
          </button>

          <button
            type="button"
            onClick={(e) => onShare(String(selectedJob.id), e)}
            style={{
              padding: "9px 13px",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            title="Share job link"
          >
            📤
          </button>
        </div>
      </div>

      {/* 2. INTERNAL SCROLLABLE JOB DETAILS BODY */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "6px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
        className="indeed-detail-scroll-body"
      >
        {/* Recruiter Details Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>
              Pay / Salary
            </span>
            <strong style={{ fontSize: "0.9rem", color: "#166534", fontWeight: 700 }}>
              {selectedJob.salary}
            </strong>
          </div>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>
              Job Type
            </span>
            <strong style={{ fontSize: "0.9rem", color: "#2563eb", fontWeight: 700 }}>
              {selectedJob.type}
            </strong>
          </div>
        </div>

        {/* Full Job Description Section */}
        <div>
          <h4 style={{ fontSize: "0.975rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
            Full job description
          </h4>

          <FormattedDescription text={selectedJob.description} />
        </div>

        {/* Required Skills */}
        {selectedJob.tags && selectedJob.tags.length > 0 && (
          <div style={{ paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "0.825rem", fontWeight: 700, color: "#64748b", marginBottom: "8px" }}>
              Required Skills & Technologies:
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {selectedJob.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.775rem",
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Location Footer */}
        <div style={{ paddingTop: "10px", paddingBottom: "16px", fontSize: "0.825rem", color: "#64748b" }}>
          <strong>Work Location:</strong> {selectedJob.location}
        </div>
      </div>
    </div>
  );
}
