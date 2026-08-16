"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COMPANIES_DATA, INDUSTRIES, type Company } from "@/data/companiesData";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === "All" || comp.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [searchQuery, selectedIndustry]);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(2, 132, 199, 0.03) 100%)",
          padding: "60px 0 50px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container-main" style={{ textAlign: "center", maxWidth: "800px" }}>
          <span
            style={{
              padding: "6px 16px",
              borderRadius: "50px",
              fontSize: "0.8rem",
              fontWeight: 700,
              background: "rgba(79, 70, 229, 0.1)",
              color: "#4f46e5",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            🏢 Top Employers
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Discover Top Companies Hiring Now
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "32px" }}>
            Explore world-class engineering teams, tech giants, and fast-growing startups. Learn about their culture, benefits, and current openings.
          </p>

          {/* Search Box */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "8px 12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "1.2rem", paddingLeft: "8px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search company name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                padding: "10px 0",
                background: "transparent",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-main" style={{ padding: "40px 20px 80px" }}>
        {/* Industry Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "16px",
            marginBottom: "32px",
            scrollBehavior: "smooth",
          }}
        >
          {INDUSTRIES.map((ind) => {
            const active = selectedIndustry === ind;
            return (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontSize: "0.875rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  border: active ? "1px solid #4f46e5" : "1px solid var(--border)",
                  background: active ? "#4f46e5" : "white",
                  color: active ? "white" : "var(--text-secondary)",
                  boxShadow: active ? "0 4px 12px rgba(79,70,229,0.25)" : "none",
                }}
              >
                {ind}
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Showing {filteredCompanies.length} Companies
          </h2>
        </div>

        {/* Companies Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="job-card"
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                position: "relative",
              }}
            >
              {company.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#059669",
                    background: "rgba(5,150,105,0.08)",
                    border: "1px solid rgba(5,150,105,0.2)",
                    padding: "3px 10px",
                    borderRadius: "50px",
                  }}
                >
                  Top Hiring
                </span>
              )}

              <div>
                {/* Header */}
                <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: company.logoBg,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {company.logo}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {company.name}
                    </h3>
                    <div style={{ fontSize: "0.8rem", color: "#4f46e5", fontWeight: 600 }}>{company.industry}</div>
                  </div>
                </div>

                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                  {company.tagline}
                </p>

                {/* Company Metadata */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>📍 {company.location}</span>
                  <span>•</span>
                  <span>👥 {company.employees}</span>
                  <span>•</span>
                  <span style={{ color: "#d97706", fontWeight: 700 }}>★ {company.rating}</span>
                </div>

                {/* Perks Badges */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {company.perks.slice(0, 3).map((perk) => (
                    <span
                      key={perk}
                      style={{
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "#f1f5f9",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {perk}
                    </span>
                  ))}
                  {company.perks.length > 3 && (
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        background: "#f8fafc",
                      }}
                    >
                      +{company.perks.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#059669" }}>
                  💼 {company.openJobsCount} Open Jobs
                </div>
                <Link
                  href={`/companies/${company.id}`}
                  className="btn-secondary"
                  style={{ padding: "7px 16px", fontSize: "0.825rem", textDecoration: "none", borderRadius: "8px" }}
                >
                  View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
