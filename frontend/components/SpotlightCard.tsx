"use client";

import React, { useState, useRef } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  spotlightColor?: string;
  onClick?: () => void;
}

export default function SpotlightCard({
  children,
  className = "",
  style = {},
  spotlightColor = "rgba(99, 102, 241, 0.15)",
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={{
        position: "relative",
        borderRadius: "20px",
        background: "#ffffff",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        ...style,
      }}
    >
      {/* React Bits Mouse Following Spotlight Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isFocused ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 40%)`,
          zIndex: 1,
        }}
      />

      {/* Spotlight Border Highlight */}
      <div
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "inherit",
          opacity: isFocused ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.4), transparent 40%)`,
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
