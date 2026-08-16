"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface ScrollExpandProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function ScrollExpand({
  title = "Experience the Future of Recruitment",
  subtitle = "Seamless matching powered by intelligent filtering and instant candidate-recruiter workflows.",
  badge = "✨ Platform Showcase",
  className = "",
}: ScrollExpandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress between when container enters middle of screen vs reaches top
      const totalDistance = windowHeight * 0.8;
      const currentPos = windowHeight - rect.top;

      let rawProgress = currentPos / totalDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setProgress(clamped);
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // Initial calculate

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Dynamic values derived from scroll progress (0 -> 1)
  const widthPercent = 75 + progress * 25; // 75% -> 100%
  const borderRadius = 32 - progress * 20; // 32px -> 12px
  const scale = 0.92 + progress * 0.08; // 0.92 -> 1.0
  const shadowSpread = 10 + progress * 20;

  return (
    <section
      ref={containerRef}
      className={`scroll-expand-wrapper ${className}`}
      style={{
        padding: "80px 0 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container-main" style={{ textAlign: "center", marginBottom: "40px" }}>
        {badge && (
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "50px",
              fontSize: "0.825rem",
              fontWeight: 700,
              background: "rgba(79, 70, 229, 0.08)",
              color: "#4f46e5",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              marginBottom: "16px",
            }}
          >
            {badge}
          </span>
        )}
        <h2
          style={{
            fontFamily: "var(--font-display, 'Outfit', sans-serif)",
            fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          {title}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
          {subtitle}
        </p>
      </div>

      {/* Expandable Container */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: `${widthPercent}%`,
            borderRadius: `${borderRadius}px`,
            transform: `scale(${scale})`,
            transition: "width 0.1s ease-out, border-radius 0.1s ease-out, transform 0.1s ease-out",
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
            color: "#ffffff",
            padding: "48px 36px",
            boxShadow: `0 ${shadowSpread}px 40px rgba(79, 70, 229, 0.25)`,
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          {/* Subtle Glass Backdrop Orbs */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(0,0,0,0) 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Platform Preview Interface Mockup */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px", alignItems: "center" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "1.5rem" }}>⚡</span>
                <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "#ffffff" }}>Jobify Ecosystem</span>
              </div>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "14px", color: "#ffffff" }}>
                Empowering Top Talent & Global Hiring Teams
              </h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.6, marginBottom: "24px" }}>
                From instant 1-click candidate applications with binary resume upload to comprehensive recruiter analytics and company profiles.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link
                  href="/jobs"
                  className="btn-primary"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    color: "#4f46e5",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  }}
                >
                  Explore Jobs →
                </Link>
                <Link
                  href="/dashboard/recruiter"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#ffffff",
                    fontWeight: 700,
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Employer Portal
                </Link>
              </div>
            </div>

            {/* Stat Counters inside Expand Card */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#60a5fa" }}>98.4%</div>
                <div style={{ fontSize: "0.825rem", opacity: 0.85, marginTop: "2px" }}>Candidate Match Rate</div>
              </div>

              <div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#34d399" }}>&lt; 24h</div>
                <div style={{ fontSize: "0.825rem", opacity: 0.85, marginTop: "2px" }}>Avg Recruiter Response</div>
              </div>

              <div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#f472b6" }}>50,000+</div>
                <div style={{ fontSize: "0.825rem", opacity: 0.85, marginTop: "2px" }}>Active Job Postings</div>
              </div>

              <div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fbbf24" }}>25,000+</div>
                <div style={{ fontSize: "0.825rem", opacity: 0.85, marginTop: "2px" }}>Verified Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
