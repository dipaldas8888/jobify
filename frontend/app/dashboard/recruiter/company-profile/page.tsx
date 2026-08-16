"use client";

import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/api";

const PRESET_PERKS = [
  "🏥 Comprehensive Health Insurance",
  "🏡 Remote / Hybrid Work Options",
  "📈 Stock Options / ESOPs",
  "🌴 Unlimited Paid Time Off",
  "🎓 Learning & Development Budget",
  "⏰ Flexible Working Hours",
  "🍱 Free Meals & Snacks",
  "✈️ Annual Team Offsites",
];

export default function CompanyProfilePage() {
  const [companyName, setCompanyName] = useState("");
  const [companyTagline, setCompanyTagline] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLinkedIn, setCompanyLinkedIn] = useState("");
  const [companyTwitter, setCompanyTwitter] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyCulture, setCompanyCulture] = useState("");
  const [perksAndBenefits, setPerksAndBenefits] = useState<string[]>([]);
  const [newPerkInput, setNewPerkInput] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    setIsLoading(true);
    try {
      const res = await dashboardApi.getCompanyProfile();
      if (res.success && res.data) {
        const d = res.data;
        setCompanyName(d.companyName || "");
        setCompanyTagline(d.companyTagline || "");
        setCompanyLogo(d.companyLogo || "");
        setCompanyWebsite(d.companyWebsite || "");
        setCompanyLinkedIn(d.companyLinkedIn || "");
        setCompanyTwitter(d.companyTwitter || "");
        setIndustry(d.industry || "Software & Technology");
        setCompanySize(d.companySize || "51-200 employees");
        setHeadquarters(d.headquarters || "Bangalore, India");
        setFoundedYear(d.foundedYear || "2021");
        setCompanyDescription(d.companyDescription || "");
        setCompanyCulture(d.companyCulture || "");
        setPerksAndBenefits(Array.isArray(d.perksAndBenefits) && d.perksAndBenefits.length > 0 ? d.perksAndBenefits : PRESET_PERKS.slice(0, 4));
      }
    } catch (err) {
      console.error("Error loading company profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!companyName.trim()) {
      setNotification({ type: "error", text: "Company Name is required." });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        companyName: companyName.trim(),
        companyTagline: companyTagline.trim(),
        companyLogo: companyLogo.trim(),
        companyWebsite: companyWebsite.trim(),
        companyLinkedIn: companyLinkedIn.trim(),
        companyTwitter: companyTwitter.trim(),
        industry: industry.trim(),
        companySize: companySize.trim(),
        headquarters: headquarters.trim(),
        foundedYear: foundedYear.trim(),
        companyDescription: companyDescription.trim(),
        companyCulture: companyCulture.trim(),
        perksAndBenefits,
      };

      const res = await dashboardApi.updateCompanyProfile(payload);
      if (res.success) {
        setNotification({
          type: "success",
          text: "🎉 Company Profile saved successfully! Changes are live across Jobify.",
        });
      } else {
        setNotification({
          type: "error",
          text: res.message || "Failed to update company profile.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        text: err.message || "Error saving profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePerk = (perk: string) => {
    if (perksAndBenefits.includes(perk)) {
      setPerksAndBenefits(perksAndBenefits.filter((p) => p !== perk));
    } else {
      setPerksAndBenefits([...perksAndBenefits, perk]);
    }
  };

  const addCustomPerk = () => {
    if (newPerkInput.trim() && !perksAndBenefits.includes(newPerkInput.trim())) {
      setPerksAndBenefits([...perksAndBenefits, newPerkInput.trim()]);
      setNewPerkInput("");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading company profile details…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          borderRadius: "20px",
          padding: "28px 32px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "0 10px 30px -5px rgba(79, 70, 229, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#4f46e5",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {companyLogo && companyLogo.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={companyLogo} alt={companyName || "Logo"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              companyName ? companyName.charAt(0).toUpperCase() : "🏢"
            )}
          </div>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "white" }}>
              {companyName || "Your Company Name"}
            </h1>
            <p style={{ fontSize: "0.85rem", opacity: 0.9, margin: "4px 0 0" }}>
              {companyTagline || "Manage your public company page & hiring brand details"}
            </p>
          </div>
        </div>

        <span
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(6px)",
            padding: "6px 14px",
            borderRadius: "50px",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          ✓ Verified Employer Profile
        </span>
      </div>

      {notification && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "14px",
            fontSize: "0.875rem",
            fontWeight: 600,
            background: notification.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
            border: `1px solid ${notification.type === "success" ? "rgba(5,150,105,0.25)" : "rgba(220,38,38,0.25)"}`,
            color: notification.type === "success" ? "#047857" : "#b91c1c",
          }}
        >
          {notification.text}
        </div>
      )}

      <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Section 1: Core Company Branding */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            🏢 Core Company Branding
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Company Name *
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

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Company Tagline / Slogan
              </label>
              <input
                type="text"
                placeholder="e.g. Building the future of cloud computing"
                value={companyTagline}
                onChange={(e) => setCompanyTagline(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Company Logo URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={companyLogo}
                onChange={(e) => setCompanyLogo(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Industry Sector
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="filter-select"
                style={{ borderRadius: "12px", width: "100%", padding: "10px 14px" }}
              >
                <option value="Software & Technology">Software & Technology</option>
                <option value="Fintech & Financial Services">Fintech & Financial Services</option>
                <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Design & Media">Design & Media</option>
                <option value="Education & EdTech">Education & EdTech</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Company Size
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="filter-select"
                style={{ borderRadius: "12px", width: "100%", padding: "10px 14px" }}
              >
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Headquarters / Primary Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore, India"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Founded Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2021"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Links & Social Presence */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            🌐 Web Links & Social Profiles
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Official Website URL
              </label>
              <input
                type="url"
                placeholder="https://company.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                LinkedIn Company URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/acme"
                value={companyLinkedIn}
                onChange={(e) => setCompanyLinkedIn(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Twitter / X Handle URL
              </label>
              <input
                type="url"
                placeholder="https://twitter.com/acme"
                value={companyTwitter}
                onChange={(e) => setCompanyTwitter(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Overview & Culture */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            📝 Company Story & Culture
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                About Company / Overview
              </label>
              <textarea
                rows={4}
                placeholder="Describe your company mission, products, and vision for job seekers…"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px", resize: "vertical", width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Workplace Culture & Values
              </label>
              <textarea
                rows={3}
                placeholder="Share your team environment, diversity initiatives, and values…"
                value={companyCulture}
                onChange={(e) => setCompanyCulture(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px", resize: "vertical", width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Perks & Benefits */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            🎁 Perks & Benefits
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            Select benefits offered by your organization to attract top talent.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
            {PRESET_PERKS.map((perk) => {
              const isSelected = perksAndBenefits.includes(perk);
              return (
                <button
                  type="button"
                  key={perk}
                  onClick={() => togglePerk(perk)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "50px",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isSelected ? "rgba(79,70,229,0.12)" : "#f8fafc",
                    color: isSelected ? "#4f46e5" : "var(--text-secondary)",
                    border: `1px solid ${isSelected ? "#818cf8" : "var(--border)"}`,
                  }}
                >
                  {isSelected ? "✓ " : "+ "} {perk}
                </button>
              );
            })}
          </div>

          {/* Add custom perk */}
          <div style={{ display: "flex", gap: "10px", maxWidth: "450px" }}>
            <input
              type="text"
              placeholder="Add custom benefit (e.g. Gym Membership)…"
              value={newPerkInput}
              onChange={(e) => setNewPerkInput(e.target.value)}
              className="search-input"
              style={{ borderRadius: "12px", flex: 1 }}
            />
            <button
              type="button"
              onClick={addCustomPerk}
              className="btn-secondary"
              style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "0.85rem" }}
            >
              Add Benefit
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving}
            style={{
              padding: "12px 28px",
              fontSize: "0.95rem",
              borderRadius: "12px",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? "Saving Changes…" : "💾 Save Company Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
