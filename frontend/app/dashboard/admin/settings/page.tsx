"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailVerification, setEmailVerification] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [featureFlags, setFeatureFlags] = useState({
    aiMatching: true,
    videoApply: false,
    salaryInsights: true,
    companyReviews: true,
    referrals: false,
  });

  const tabs = ["General", "Email", "Security", "Feature Flags", "Billing"];

  const toggleFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
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
      aria-label="Toggle feature"
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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "4px",
          width: "fit-content",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
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
              background: activeTab === tab ? "rgba(220,38,38,0.08)" : "transparent",
              color: activeTab === tab ? "#b91c1c" : "var(--text-muted)",
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

      {/* General Settings */}
      {activeTab === "General" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>Platform Configuration</h3>
            </div>
            <div style={{ padding: "0 24px" }}>
              {[
                { label: "Maintenance Mode", desc: "Temporarily take the platform offline for maintenance", enabled: maintenanceMode, toggle: () => setMaintenanceMode(v => !v), danger: true },
                { label: "Email Verification", desc: "Require email verification for new accounts", enabled: emailVerification, toggle: () => setEmailVerification(v => !v), danger: false },
                { label: "Auto-approve Companies", desc: "Automatically approve new company registrations without review", enabled: autoApprove, toggle: () => setAutoApprove(v => !v), danger: false },
              ].map((item, i) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ flex: 1, paddingRight: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem", color: item.danger && item.enabled ? "#b91c1c" : "var(--text-primary)" }}>{item.label}</p>
                      {item.danger && <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(220,38,38,0.08)", color: "#b91c1c" }}>DANGER</span>}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                  <Toggle enabled={item.enabled} onToggle={item.toggle} />
                </div>
              ))}
            </div>
          </div>

          {/* Site Info */}
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "20px" }}>Site Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Platform Name", placeholder: "Jobify" },
                { label: "Support Email", placeholder: "support@jobify.com" },
                { label: "Max Jobs per Recruiter (Free)", placeholder: "3" },
                { label: "Max Applications per User (Free)", placeholder: "10" },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "7px" }}>{f.label}</label>
                  <input
                    type="text"
                    defaultValue={f.placeholder}
                    className="search-input"
                    style={{ borderRadius: "10px" }}
                    aria-label={f.label}
                  />
                </div>
              ))}
            </div>
            <button type="button" className="btn-primary" style={{ marginTop: "20px", borderRadius: "10px", padding: "10px 24px", background: "linear-gradient(135deg, #dc2626, #ef4444)", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Feature Flags */}
      {activeTab === "Feature Flags" && (
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>Feature Toggles</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "3px" }}>Enable or disable features across the platform in real-time</p>
          </div>
          <div style={{ padding: "0 24px" }}>
            {(Object.entries(featureFlags) as [keyof typeof featureFlags, boolean][]).map(([key, enabled], i) => {
              const labels: Record<keyof typeof featureFlags, { label: string; desc: string; status: string }> = {
                aiMatching: { label: "AI Job Matching", desc: "Smart ML-based job recommendations for users", status: "Stable" },
                videoApply: { label: "Video Applications", desc: "Allow applicants to submit video introductions", status: "Beta" },
                salaryInsights: { label: "Salary Insights", desc: "Show salary ranges and market data to users", status: "Stable" },
                companyReviews: { label: "Company Reviews", desc: "Allow users to leave reviews on company profiles", status: "Stable" },
                referrals: { label: "Referral Program", desc: "Enable user referral program with rewards", status: "Alpha" },
              };
              const info = labels[key];
              const statusColor = info.status === "Stable" ? "#047857" : info.status === "Beta" ? "#b45309" : "#b91c1c";
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: i < Object.keys(featureFlags).length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ flex: 1, paddingRight: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{info.label}</p>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: `${statusColor}10`, color: statusColor, border: `1px solid ${statusColor}25` }}>
                        {info.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{info.desc}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: enabled ? "#047857" : "var(--text-muted)" }}>{enabled ? "Enabled" : "Disabled"}</span>
                    <Toggle enabled={enabled} onToggle={() => toggleFlag(key)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {!["General", "Feature Flags"].includes(activeTab) && (
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "64px", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🚧</div>
          <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{activeTab} Settings</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>This section is under construction</p>
        </div>
      )}
    </div>
  );
}
