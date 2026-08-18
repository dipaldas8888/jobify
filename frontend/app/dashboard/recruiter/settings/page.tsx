"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/redux/store";

export default function RecruiterSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("Profile & Company");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || "Verified Recruiter");
  const [email, setEmail] = useState(user?.email || "recruiter@jobify.com");
  const [companyName, setCompanyName] = useState(user?.companyName || "TechNova Solutions");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [location, setLocation] = useState("San Francisco, CA");
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [applicantDigest, setApplicantDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Security states
  const [twoFactor, setTwoFactor] = useState(false);

  const tabs = ["Profile & Company", "Notifications", "Security & Password", "Billing & Plan"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: "46px",
        height: "26px",
        borderRadius: "13px",
        background: enabled ? "#4f46e5" : "#cbd5e1",
        border: enabled ? "1px solid rgba(79,70,229,0.3)" : "1px solid var(--border)",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.25s ease",
        flexShrink: 0,
      }}
      aria-label="Toggle setting"
      role="switch"
      aria-checked={enabled}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: enabled ? "22px" : "3px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          transition: "left 0.25s ease",
        }}
      />
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
      {savedSuccess && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "#15803d",
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ✅ Settings updated successfully!
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "4px",
          width: "fit-content",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 18px",
              borderRadius: "9px",
              border: "none",
              background: activeTab === tab ? "rgba(79,70,229,0.08)" : "transparent",
              color: activeTab === tab ? "#4f46e5" : "var(--text-muted)",
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: "0.875rem",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile & Company */}
      {activeTab === "Profile & Company" && (
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "4px" }}>
              Recruiter & Business Details
            </h3>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              Update your personal details and hiring organisation profile information.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Company / Employer Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Headquarters / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: "24px", borderRadius: "10px", padding: "10px 24px" }}
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === "Notifications" && (
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Notification Preferences</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>Choose how you receive candidate updates and applicant notifications.</p>
          </div>
          <div style={{ padding: "0 24px" }}>
            {[
              { label: "New Application Alerts", desc: "Receive immediate emails whenever a job seeker applies to your postings.", enabled: emailAlerts, toggle: () => setEmailAlerts(v => !v) },
              { label: "Daily Candidate Digest", desc: "Get a daily summary email of total profile views and applications.", enabled: applicantDigest, toggle: () => setApplicantDigest(v => !v) },
              { label: "Product & Hiring Insights", desc: "Receive hiring tips, salary benchmarks, and platform feature updates.", enabled: marketingEmails, toggle: () => setMarketingEmails(v => !v) },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div style={{ flex: 1, paddingRight: "24px" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "3px" }}>{item.label}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
                <Toggle enabled={item.enabled} onToggle={item.toggle} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === "Security & Password" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "16px" }}>Change Password</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "450px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Current Password</label>
                <input type="password" className="search-input" style={{ borderRadius: "10px" }} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>New Password</label>
                <input type="password" className="search-input" style={{ borderRadius: "10px" }} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Confirm New Password</label>
                <input type="password" className="search-input" style={{ borderRadius: "10px" }} placeholder="••••••••" />
              </div>
              <button type="button" onClick={handleSave} className="btn-primary" style={{ borderRadius: "10px", padding: "10px 20px", marginTop: "6px" }}>
                Update Password
              </button>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "3px" }}>Two-Factor Authentication (2FA)</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Add an extra layer of security to your employer account using email OTP verification.</p>
            </div>
            <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
          </div>
        </div>
      )}

      {/* Tab 4: Billing & Plan */}
      {activeTab === "Billing & Plan" && (
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "50px", background: "rgba(79,70,229,0.1)", color: "#4f46e5", textTransform: "uppercase" }}>Current Active Plan</span>
              <h3 style={{ fontWeight: 800, fontSize: "1.4rem", color: "var(--text-primary)", marginTop: "6px" }}>Pro Recruiter Tier</h3>
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>$99 <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>/ month</span></span>
          </div>

          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
            Unlimited active job listings, CSV bulk job uploads, AI candidate matching, and priority applicant support.
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" className="btn-primary" style={{ borderRadius: "10px", padding: "10px 20px" }}>
              Upgrade Plan
            </button>
            <button type="button" className="btn-secondary" style={{ borderRadius: "10px", padding: "10px 20px" }}>
              View Invoices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
