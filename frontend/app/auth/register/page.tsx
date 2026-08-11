"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (role === "recruiter" && !companyName.trim()) {
      setErrorMessage("Company name is required for recruiters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register({
        name,
        email,
        password,
        role,
        companyName: role === "recruiter" ? companyName : undefined,
      });

      if (res.success) {
        setSuccessMessage("Account created successfully! Redirecting to email verification...");
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        }, 1200);
      } else {
        setErrorMessage(res.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--bg-base)",
        position: "relative",
      }}
      className="bg-grid"
    >
      {/* Decorative Orbs */}
      <div
        className="glow-orb glow-orb-primary"
        style={{ width: "400px", height: "400px", top: "-50px", left: "-50px", opacity: 0.15 }}
      />
      <div
        className="glow-orb glow-orb-accent"
        style={{ width: "350px", height: "350px", bottom: "-50px", right: "-50px", opacity: 0.15 }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "36px 32px",
          boxShadow: "0 12px 40px -8px rgba(0, 0, 0, 0.08)",
          position: "relative",
          zIndex: 1,
        }}
        className="animate-fade-in-up"
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "white",
              }}
            >
              ⚡
            </span>
            <span className="logo-text" style={{ fontSize: "1.4rem" }}>Jobify</span>
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Outfit', sans-serif)",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            Create your account
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Join thousands of job seekers and hiring managers
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            background: "#f1f5f9",
            padding: "4px",
            borderRadius: "14px",
            marginBottom: "24px",
            border: "1px solid var(--border)",
          }}
        >
          <button
            type="button"
            onClick={() => setRole("candidate")}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: role === "candidate" ? "#ffffff" : "transparent",
              color: role === "candidate" ? "#4f46e5" : "var(--text-secondary)",
              fontWeight: role === "candidate" ? 700 : 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: role === "candidate" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            👨‍💻 Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: role === "recruiter" ? "#ffffff" : "transparent",
              color: role === "recruiter" ? "#4f46e5" : "var(--text-secondary)",
              fontWeight: role === "recruiter" ? 700 : 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: role === "recruiter" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            🏢 Employer
          </button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.2)",
              color: "#b91c1c",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(5,150,105,0.08)",
              border: "1px solid rgba(5,150,105,0.2)",
              color: "#047857",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="search-input"
              style={{ borderRadius: "12px" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              Email Address <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="search-input"
              style={{ borderRadius: "12px" }}
              required
            />
          </div>

          {role === "recruiter" && (
            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Company Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              Password <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px", paddingRight: "44px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  color: "var(--text-muted)",
                }}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: 700,
              marginTop: "8px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
