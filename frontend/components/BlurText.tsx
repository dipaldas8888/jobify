"use client";

import React, { useState, useEffect, useRef } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}


export default function BlurText({
  text,
  delay = 50,
  className = "",
  style = {},
  as: Component = "h2",
}: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref as any}
      className={`blur-text ${className}`}
      style={{
        display: "inline-block",
        ...style,
      }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            filter: isVisible ? "blur(0px)" : "blur(12px)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            transition: `filter 0.5s ease ${index * delay}ms, opacity 0.5s ease ${index * delay}ms, transform 0.5s ease ${index * delay}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
