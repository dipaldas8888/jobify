"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "#ffffff",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "650px", width: "100%", margin: "0 auto" }}>
        {/* SVG Illustration matching screenshot layout */}
        <svg
          viewBox="0 0 800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", maxHeight: "380px", marginBottom: "24px" }}
          aria-hidden="true"
        >
          {/* Background Crosses */}
          <path d="M 230 100 L 244 114 M 244 100 L 230 114" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 535 180 L 549 194 M 549 180 L 535 194" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 235 350 L 249 364 M 249 350 L 235 364" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Top Left Window Graphic */}
          <rect x="220" y="150" width="100" height="70" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="220" y1="168" x2="320" y2="168" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="230" cy="159" r="2.5" fill="#cbd5e1" />
          <circle cx="238" cy="159" r="2.5" fill="#cbd5e1" />
          <circle cx="246" cy="159" r="2.5" fill="#cbd5e1" />
          {/* Link Icon inside window */}
          <path
            d="M 260 195 L 270 185 M 264 189 A 5 5 0 0 1 271 182 L 275 186 A 5 5 0 0 1 268 193 M 262 197 A 5 5 0 0 1 255 190 L 259 186 A 5 5 0 0 1 266 193"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Top Right 404 Speech Bubble */}
          <rect x="420" y="80" width="100" height="60" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M 440 140 L 448 150 L 456 140 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <text x="470" y="122" textAnchor="middle" fill="#ef4444" fontSize="32" fontWeight="800" fontFamily="sans-serif">
            404
          </text>

          {/* Desk Base & Floor Line */}
          <line x1="240" y1="420" x2="570" y2="420" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />

          {/* Desk Legs */}
          <path d="M 280 420 L 295 290 M 295 290 L 320 420" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 520 420 L 510 290 M 510 290 L 540 420" stroke="#cbd5e1" strokeWidth="2" />

          {/* Desk Surface */}
          <rect x="245" y="285" width="330" height="8" rx="4" fill="#cbd5e1" />

          {/* Stack of Documents on Desk */}
          <rect x="275" y="240" width="45" height="45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
          <line x1="282" y1="250" x2="310" y2="250" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="282" y1="258" x2="312" y2="258" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="282" y1="266" x2="305" y2="266" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="272" y="275" width="50" height="10" rx="3" fill="#ef4444" opacity="0.8" />

          {/* Computer Monitor */}
          <rect x="450" y="195" width="95" height="75" rx="6" fill="#475569" />
          <rect x="455" y="200" width="85" height="65" rx="3" fill="#334155" />
          <polygon points="490,270 505,270 502,285 493,285" fill="#64748b" />
          <rect x="480" y="285" width="35" height="4" rx="2" fill="#64748b" />
          {/* Monitor Screen code lines */}
          <line x1="465" y1="215" x2="505" y2="215" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="465" y1="225" x2="520" y2="225" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="465" y1="235" x2="495" y2="235" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />

          {/* Red Folders on Desk */}
          <rect x="535" y="245" width="10" height="40" fill="#ef4444" rx="2" />
          <rect x="548" y="245" width="10" height="40" fill="#f87171" rx="2" />

          {/* Potted Plant */}
          <polygon points="530,360 550,360 546,420 534,420" fill="#e2e8f0" />
          <path d="M 540 360 C 510 320, 520 290, 540 280 C 535 310, 540 340, 540 360 Z" fill="#86efac" />
          <path d="M 540 360 C 570 320, 560 290, 540 280 C 545 310, 540 340, 540 360 Z" fill="#4ade80" />
          <path d="M 540 360 C 520 330, 500 350, 540 360 Z" fill="#22c55e" />

          {/* Office Chair */}
          <rect x="295" y="235" width="55" height="80" rx="8" fill="#334155" />
          <rect x="290" y="300" width="65" height="15" rx="4" fill="#1e293b" />
          <rect x="317" y="315" width="10" height="60" fill="#64748b" />
          {/* Chair Base Wheels */}
          <path d="M 322 375 L 290 415 M 322 375 L 354 415 M 322 375 L 322 418" stroke="#475569" strokeWidth="4" />
          <circle cx="290" cy="416" r="5" fill="#1e293b" />
          <circle cx="354" cy="416" r="5" fill="#1e293b" />
          <circle cx="322" cy="419" r="5" fill="#1e293b" />

          {/* Worker Character */}
          {/* Yellow Trousers / Legs */}
          <path d="M 320 310 L 375 310 L 385 410 L 355 410 L 350 350 L 335 350 L 330 410 L 305 410 Z" fill="#eab308" />
          {/* Shoes */}
          <ellipse cx="300" cy="412" rx="12" ry="6" fill="#1e293b" />
          <ellipse cx="380" cy="412" rx="12" ry="6" fill="#1e293b" />
          <path d="M 294 409 Q 300 405 306 409" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 374 409 Q 380 405 386 409" stroke="#ffffff" strokeWidth="1.5" />

          {/* Purple Shirt / Body */}
          <path d="M 320 250 Q 355 240 375 255 L 370 315 L 315 315 Z" fill="#8b5cf6" />

          {/* Head & Neck */}
          <rect x="338" y="235" width="12" height="18" fill="#fed7aa" />
          <ellipse cx="344" cy="215" rx="16" ry="20" fill="#fed7aa" />
          {/* Hair */}
          <path d="M 328 215 C 328 195, 360 195, 360 215 C 355 205, 345 200, 335 205 Z" fill="#1e293b" />
          {/* Confused Face Expression */}
          <circle cx="340" cy="212" r="2" fill="#1e293b" />
          <circle cx="350" cy="212" r="2" fill="#1e293b" />
          <path d="M 340 224 Q 345 220 350 224" stroke="#1e293b" strokeWidth="1.5" fill="none" />
          <path d="M 336 206 L 343 208" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M 347 208 L 354 206" stroke="#1e293b" strokeWidth="1.5" />

          {/* Arms holding pencil */}
          <path d="M 325 255 Q 310 270, 335 285" stroke="#8b5cf6" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M 365 255 Q 395 270, 365 285" stroke="#8b5cf6" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Hands */}
          <circle cx="337" cy="285" r="7" fill="#fed7aa" />
          <circle cx="363" cy="285" r="7" fill="#fed7aa" />
          {/* Pencil */}
          <line x1="335" y1="295" x2="335" y2="265" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
          <polygon points="335,263 333,267 337,267" fill="#1e293b" />
          {/* Watch */}
          <rect x="318" y="278" width="5" height="10" fill="#1e293b" rx="1" />
        </svg>

        {/* Message matching screenshot */}
        <h2
          style={{
            fontFamily: "var(--font-inter, 'Inter', sans-serif)",
            fontSize: "1.35rem",
            fontWeight: 600,
            color: "#475569",
            marginBottom: "28px",
            lineHeight: 1.4,
          }}
        >
          Sorry, the page you are looking for is not found!
        </h2>

        {/* Action button matching screenshot */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: "14px 42px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(239, 68, 68, 0.35)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 25px rgba(239, 68, 68, 0.45)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(239, 68, 68, 0.35)";
            }}
          >
            GO BACK
          </button>

          <Link
            href="/"
            style={{
              padding: "14px 32px",
              borderRadius: "50px",
              background: "#ffffff",
              color: "#475569",
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
          >
            Home Page 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
