"use client";

import { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "fadeout">("enter");
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Phase 1: enter animation (0 → visible)
    const enterTimer = setTimeout(() => setPhase("visible"), 50);

    // Phase 2: animate progress bar
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 8 + 3;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
      }
      setProgress(prog);
    }, 80);

    // Phase 3: start fade out after 2.2s
    const fadeTimer = setTimeout(() => setPhase("fadeout"), 2200);

    // Phase 4: fully hidden after fade (300ms transition)
    const doneTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 2600);

    return () => {
      clearTimeout(enterTimer);
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "linear-gradient(135deg, #05080f 0%, #0f172a 45%, #1a1040 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "fadeout" ? 0 : phase === "enter" ? 0 : 1,
        transform: phase === "fadeout" ? "scale(1.03)" : "scale(1)",
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "all",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          opacity: 0.6,
        }}
      />

      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "splashPulse 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: "translate(120px, -80px)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          transform: phase === "enter" ? "translateY(20px)" : "translateY(0)",
          transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            position: "relative",
            width: "88px",
            height: "88px",
          }}
        >
          {/* Pulsing ring */}
          <div
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "28px",
              border: "2px solid rgba(99, 102, 241, 0.3)",
              animation: "splashRing 2s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 50px rgba(99, 102, 241, 0.5), 0 0 100px rgba(99, 102, 241, 0.2)",
              fontSize: "2.6rem",
            }}
          >
            ⚡
          </div>
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
              fontSize: "3rem",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1,
              background: "linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Jobify
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
              fontWeight: 500,
              marginTop: "8px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Connecting Talent · Opportunity
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "200px",
            height: "3px",
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: "100px",
            overflow: "hidden",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #6366f1, #38bdf8, #6366f1)",
              backgroundSize: "200% 100%",
              borderRadius: "100px",
              transition: "width 0.12s ease-out",
              animation: "splashShimmer 1.5s linear infinite",
            }}
          />
        </div>

        {/* Loading text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#6366f1",
              animation: "splashDot 1.4s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#6366f1",
              animation: "splashDot 1.4s ease-in-out 0.2s infinite",
            }}
          />
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#6366f1",
              animation: "splashDot 1.4s ease-in-out 0.4s infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "#475569",
              fontWeight: 600,
              letterSpacing: "0.05em",
              marginLeft: "4px",
            }}
          >
            Preparing your workspace...
          </span>
        </div>
      </div>

      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes splashRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes splashDot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes splashShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
