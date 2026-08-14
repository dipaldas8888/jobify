"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface CompanyItem {
  id: string;
  name: string;
  industry: string;
  createdBy: string;
  status: "Verified" | "Pending" | "Unverified";
  createdAt?: string;
  size?: string;
  plan?: string;
  jobs?: number;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Verified: { bg: "rgba(5,150,105,0.08)", text: "#047857", border: "rgba(5,150,105,0.2)" },
  Pending: { bg: "rgba(217,119,6,0.08)", text: "#b45309", border: "rgba(217,119,6,0.2)" },
  Unverified: { bg: "rgba(100,116,139,0.08)", text: "#64748b", border: "rgba(100,116,139,0.2)" },
};

const logoGradients = [
  "linear-gradient(135deg,#635bff,#4f46e5)",
  "linear-gradient(135deg,#059669,#10b981)",
  "linear-gradient(135deg,#4f46e5,#7c3aed)",
  "linear-gradient(135deg,#ea580c,#dc2626)",
  "linear-gradient(135deg,#d97706,#b45309)",
];

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getCompanies();
      if (res.success) {
        const list = res.data || res.companies || [];
        setCompanies(list);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = companies.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.createdBy.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)" }}>Registered Employers & Companies</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Directory of verified employer organizations registered on Jobify.</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
        {[
          { label: "Total Companies", value: companies.length, color: "#4f46e5" },
          { label: "Verified Partners", value: companies.filter((c) => c.status === "Verified").length, color: "#059669" },
          { label: "Pending Verification", value: companies.filter((c) => c.status === "Pending").length, color: "#d97706" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.color, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontFamily: "var(--font-display,'Outfit',sans-serif)", fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="recruiter-jobs-header">
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", maxWidth: "100%" }}>
          {["All", "Verified", "Pending"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              style={{
                padding: "7px 16px",
                borderRadius: "50px",
                border: statusFilter === f ? "1px solid rgba(220,38,38,0.3)" : "1px solid var(--border)",
                background: statusFilter === f ? "rgba(220,38,38,0.08)" : "#ffffff",
                color: statusFilter === f ? "#b91c1c" : "var(--text-secondary)",
                fontWeight: statusFilter === f ? 700 : 500,
                fontSize: "0.825rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                whiteSpace: "nowrap",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search companies or recruiter email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ width: "260px", padding: "9px 14px", borderRadius: "10px" }}
          aria-label="Search companies"
        />
      </div>

      {/* Companies Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div className="table-responsive-wrapper">
          <div className="table-min-width">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 140px 110px", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
              {["Company Name", "Registered By (Email)", "Category / Industry", "Status"].map((col) => (
                <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
              ))}
            </div>

            {isLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p style={{ fontWeight: 600 }}>Loading companies list from server...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p>No registered employer companies found matching your query.</p>
              </div>
            ) : (
              filtered.map((co, i) => {
                const sc = statusColors[co.status] || statusColors.Verified;
                return (
                  <div
                    key={co.id || co.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 180px 140px 110px",
                      padding: "14px 20px",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: logoGradients[i % logoGradients.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "white", flexShrink: 0 }}>
                        {co.name ? co.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{co.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          Registered {co.createdAt ? new Date(co.createdAt).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                    </div>

                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                      {co.createdBy}
                    </span>

                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {co.industry}
                    </span>

                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, width: "fit-content" }}>
                      {co.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right" }}>
        Showing {filtered.length} of {companies.length} companies
      </p>
    </div>
  );
}
