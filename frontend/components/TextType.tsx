"use client";

import React, { useState, useEffect } from "react";

interface TextTypeProps {
  text: string | string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TextType({
  text,
  speed = 80,
  deleteSpeed = 50,
  pauseDuration = 1500,
  loop = true,
  cursor = "|",
  className = "",
  style = {},
}: TextTypeProps) {
  const textArray = Array.isArray(text) ? text : [text];
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (textArray.length === 0) return;

    const currentString = textArray[textIndex % textArray.length];

    if (!isDeleting && charIndex < currentString.length) {
      const timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex === currentString.length) {
      if (!loop && textIndex === textArray.length - 1) return;
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, deleteSpeed);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % textArray.length);
    }
  }, [charIndex, isDeleting, textIndex, textArray, speed, deleteSpeed, pauseDuration, loop]);

  const currentText = textArray[textIndex % textArray.length];
  const displayed = currentText.slice(0, charIndex);

  return (
    <span className={`text-type-container ${className}`} style={{ display: "inline-block", ...style }}>
      <span>{displayed}</span>
      <span
        style={{
          display: "inline-block",
          marginLeft: "2px",
          fontWeight: 700,
          opacity: 0.8,
          animation: "blink-cursor 0.8s infinite",
        }}
      >
        {cursor}
      </span>
      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
