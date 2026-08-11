"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/store";
import { setCredentials } from "@/lib/redux/slices/authSlice";

function VerifyEmailForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !otp.trim()) {
      setErrorMessage("Please enter both your email address and 6-digit verification code.");
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMessage("Verification code must be exactly 6 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.verifyEmail({ email: email.trim(), otp: otp.trim() });
      if (res.success) {
        if (res.token && res.user) {
          dispatch(
            setCredentials({
              token: res.token,
              user: {
                id: res.user.id || res.user._id,
                name: res.user.name,
                email: res.user.email,
                role: res.user.role,
                isVerified: true,
                companyName: res.user.companyName,
              },
            })
          );
          setSuccessMessage("Email verified! Logging you in...");
          setTimeout(() => {
            if (res.user.role === "recruiter") {
              router.push("/dashboard/recruiter");
            } else if (res.user.role === "admin") {
              router.push("/dashboard/admin");
            } else {
              router.push("/jobs");
            }
          }, 1200);
        } else {
          setSuccessMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            router.push(`/auth/login?verified=true&email=${encodeURIComponent(email)}`);
          }, 1200);
        }
      } else {
        setErrorMessage(res.message || "Verification failed. Please check your code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Verification error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setErrorMessage("Please provide your email address to resend OTP.");
      return;
    }

    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await authApi.resendOTP(email.trim());
      if (res.success) {
        setSuccessMessage("A new verification OTP code has been sent to your email.");
      } else {
        setErrorMessage(res.message || "Failed to resend verification code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend verification code.");
    } finally {
      setIsResending(false);
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
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(79, 70, 229, 0.08)",
            color: "#4f46e5",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            marginBottom: "16px",
          }}
        >
          ✉️
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display, 'Outfit', sans-serif)",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          Verify Your Email
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          We sent a 6-digit OTP code to your email address. Enter it below to complete verification.
        </p>
      </div>

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

      <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="search-input"
            style={{ borderRadius: "12px" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
            6-Digit Verification Code
          </label>
          <input
            type="text"
            placeholder="123456"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="search-input"
            style={{ borderRadius: "12px", letterSpacing: "0.3em", textAlign: "center", fontSize: "1.25rem", fontWeight: 700 }}
            required
          />
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
          {isLoading ? "Verifying..." : "Verify Code →"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          style={{
            background: "none",
            border: "none",
            color: "#4f46e5",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>

        <Link href="/auth/login" style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "none" }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
