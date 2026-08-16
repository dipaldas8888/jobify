"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAppDispatch } from "@/lib/redux/store";
import { setCredentials } from "@/lib/redux/slices/authSlice";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const isVerifiedFromUrl = searchParams.get("verified") === "true";
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setUnverifiedEmail(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      if (requires2FA) {
        // Handle 2FA submission
        const res2FA = await authApi.verify2FA({ email: email.trim(), otp: twoFactorOtp.trim() });
        if (res2FA.success && res2FA.token && res2FA.user) {
          dispatch(
            setCredentials({
              token: res2FA.token,
              user: {
                id: res2FA.user.id || res2FA.user._id,
                name: res2FA.user.name,
                email: res2FA.user.email,
                role: res2FA.user.role,
                isVerified: res2FA.user.isVerified,
                companyName: res2FA.user.companyName,
              },
            })
          );

          redirectByRole(res2FA.user.role);
        } else {
          setErrorMessage(res2FA.message || "Invalid 2FA code.");
        }
      } else {
        // Standard login
        const res = await authApi.login({ email: email.trim(), password });
        if (res.success) {
          if (res.twoFactorRequired) {
            setRequires2FA(true);
            setErrorMessage("");
          } else if (res.token && res.user) {
            dispatch(
              setCredentials({
                token: res.token,
                user: {
                  id: res.user.id || res.user._id,
                  name: res.user.name,
                  email: res.user.email,
                  role: res.user.role,
                  isVerified: res.user.isVerified,
                  companyName: res.user.companyName,
                },
              })
            );

            redirectByRole(res.user.role);
          }
        } else {
          if (res.message?.includes("verify your email")) {
            setUnverifiedEmail(email.trim());
          }
          setErrorMessage(res.message || "Invalid email or password.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    const r = role.toLowerCase();
    if (r === "recruiter") {
      router.push("/dashboard/recruiter");
    } else if (r === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "440px",
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
          {requires2FA ? "Two-Factor Auth" : "Welcome back"}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {requires2FA ? "Enter the 6-digit code sent to your email" : "Sign in to access your Jobify account"}
        </p>
      </div>

      {isVerifiedFromUrl && !errorMessage && (
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
          ✅ Email verified successfully! You can now log in below.
        </div>
      )}

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
          {unverifiedEmail && (
            <div style={{ marginTop: "8px" }}>
              <Link
                href={`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                style={{ color: "#4f46e5", textDecoration: "underline", fontWeight: 700 }}
              >
                Click here to verify your email →
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {!requires2FA ? (
          <>
            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Email Address
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

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Password
                </label>
                <Link href="/auth/forgot-password" style={{ fontSize: "0.775rem", color: "#4f46e5", textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>

              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
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
          </>
        ) : (
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              2FA Verification Code
            </label>
            <input
              type="text"
              placeholder="123456"
              maxLength={6}
              value={twoFactorOtp}
              onChange={(e) => setTwoFactorOtp(e.target.value.replace(/\D/g, ""))}
              className="search-input"
              style={{ borderRadius: "12px", letterSpacing: "0.3em", textAlign: "center", fontSize: "1.25rem", fontWeight: 700 }}
              required
            />
          </div>
        )}

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
          {isLoading ? "Signing in..." : requires2FA ? "Verify & Sign In →" : "Sign In →"}
        </button>
      </form>

      {/* Footer Link */}
      <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
