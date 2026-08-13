"use client";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "var(--bg-base)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Animated Glowing Logo */}
        <div
          className="splash-logo-glow"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.8rem",
            color: "white",
            boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)",
          }}
        >
          ⚡
        </div>

        {/* Shimmering Progress Bar */}
        <div
          style={{
            width: "180px",
            height: "4px",
            background: "#e2e8f0",
            borderRadius: "50px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #0284c7)",
              borderRadius: "50px",
              animation: "skeletonShimmer 1.4s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500, margin: 0 }}>
          Loading page content...
        </p>

        {/* Skeletons preview */}
        <div style={{ width: "100%", marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="skeleton-box" style={{ width: "100%", height: "48px", borderRadius: "12px" }} />
          <div className="skeleton-box" style={{ width: "100%", height: "80px", borderRadius: "12px" }} />
        </div>
      </div>
    </div>
  );
}
