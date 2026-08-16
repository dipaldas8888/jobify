"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StickerPeelLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function StickerPeelLogo({
  href = "/",
  size = "md",
  showText = true,
  className = "",
}: StickerPeelLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Dimensions
  const dimensionMap = {
    sm: { box: 34, icon: 16, text: "1.1rem" },
    md: { box: 40, icon: 20, text: "1.35rem" },
    lg: { box: 52, icon: 26, text: "1.75rem" },
  };

  const dims = dimensionMap[size];

  const logoContent = (
    <div
      className={`sticker-peel-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        userSelect: "none",
        textDecoration: "none",
      }}
    >
      {/* 3D Peel Sticker Wrapper */}
      <div
        style={{
          position: "relative",
          width: `${dims.box}px`,
          height: `${dims.box}px`,
          perspective: "600px",
        }}
      >
        {/* Sticker Shadow Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            background: "rgba(79, 70, 229, 0.35)",
            filter: "blur(6px)",
            transform: isHovered
              ? "translate3d(4px, 8px, -10px) scale(0.92)"
              : "translate3d(1px, 3px, 0px) scale(0.96)",
            opacity: isHovered ? 0.8 : 0.4,
            transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />

        {/* Front Sticker Card with Peel Effect */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 900,
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
            transformStyle: "preserve-3d",
            transform: isHovered
              ? "rotateX(12deg) rotateY(-14deg) rotateZ(-3deg) translate3d(-2px, -4px, 12px) scale(1.05)"
              : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate3d(0, 0, 0)",
            transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            overflow: "hidden",
          }}
        >
          {/* Glossy Overlay Reflection */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
              transform: isHovered ? "translate(15%, 15%)" : "translate(0, 0)",
              transition: "transform 0.4s ease",
              pointerEvents: "none",
            }}
          />

          {/* Corner Peel Fold Backing */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: isHovered ? "18px" : "0px",
              height: isHovered ? "18px" : "0px",
              background: "linear-gradient(225deg, #e0e7ff 0%, #cbd5e1 100%)",
              borderBottomLeftRadius: "6px",
              boxShadow: "-2px 2px 5px rgba(0,0,0,0.2)",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Logo Icon */}
          <span
            style={{
              fontSize: `${dims.icon}px`,
              lineHeight: 1,
              transform: isHovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
              transition: "transform 0.3s ease",
              zIndex: 2,
            }}
          >
            ⚡
          </span>
        </div>
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-display, 'Outfit', sans-serif)",
            fontSize: dims.text,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Jobify
          <span
            style={{
              color: "#4f46e5",
              fontSize: "1.2em",
              lineHeight: 0,
              marginLeft: "1px",
            }}
          >
            .
          </span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
