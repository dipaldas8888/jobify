"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Step 1: Send Password Reset OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword(email.trim());
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "A 6-digit password reset code has been sent to your email.",
        });
        setStep(2);
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to send reset code. Please check your email address.",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error processing request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!otp || otp.trim().length !== 6) {
      setMessage({ type: "error", text: "Please enter the 6-digit OTP sent to your email." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.success) {
        setMessage({
          type: "success",
          text: "🎉 Password reset successfully! Redirecting you to login…",
        });
        setTimeout(() => {
          router.push(`/auth/login?email=${encodeURIComponent(email.trim())}`);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to reset password. Please check your OTP code.",
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error resetting password.",
      });
    } finally {
      setIsLoading(false);
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
          {step === 1 ? "Forgot Password?" : "Reset Password"}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {step === 1
            ? "Enter your account email to receive a 6-digit password reset code"
            : `Enter the code sent to ${email} and your new password`}
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            background: message.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
            border: `1px solid ${message.type === "success" ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
            color: message.type === "success" ? "#047857" : "#b91c1c",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          {message.type === "success" ? "✅ " : "⚠️ "} {message.text}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              Registered Email Address
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
            {isLoading ? "Sending Code..." : "Send Verification Code →"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              6-Digit Reset Code (OTP)
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

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="search-input"
              style={{ borderRadius: "12px" }}
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
            {isLoading ? "Resetting Password..." : "Update & Reset Password →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "4px" }}>
            <button
              type="button"
              onClick={handleRequestOTP}
              style={{ background: "none", border: "none", color: "#4f46e5", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}
            >
              Didn&apos;t get the code? Resend OTP
            </button>
          </div>
        </form>
      )}

      {/* Footer Link */}
      <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Remember your password?{" "}
          <Link href="/auth/login" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none" }}>
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
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
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
