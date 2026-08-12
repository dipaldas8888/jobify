"use client";

import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const alreadyShown = sessionStorage.getItem("jobify_splash_shown");
    if (alreadyShown) {
      setIsVisible(false);
      return;
    }

    // Start fade out after 1.2s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1200);

    // Completely remove after 1.6s
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("jobify_splash_shown", "true");
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: isFadingOut ? 0 : 1,
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isFadingOut ? "none" : "all",
      }}
    >
      {/* Glow ambient circle */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Brand Icon & Logo */}
      <div
        className="splash-logo-glow"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "22px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.4rem",
            color: "white",
            boxShadow: "0 0 35px rgba(99, 102, 241, 0.6)",
          }}
        >
          ⚡
        </div>

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Outfit', sans-serif)",
              fontSize: "2.4rem",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Jobify
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              fontWeight: 500,
              marginTop: "6px",
              letterSpacing: "0.04em",
            }}
          >
            Connecting Talent with Opportunity
          </p>
        </div>
      </div>

      {/* Loading Bar & Spinner */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated Loading Bar */}
        <div
          style={{
            width: "160px",
            height: "4px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "60%",
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #38bdf8)",
              borderRadius: "50px",
              animation: "skeletonShimmer 1.2s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            className="splash-spinner"
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.15)",
              borderTopColor: "#6366f1",
            }}
          />
          <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>Loading workspace...</span>
        </div>
      </div>
    </div>
  );
}
