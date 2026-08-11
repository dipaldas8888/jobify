"use client";

const kpis = [
  { label: "Monthly Recurring Revenue", value: "$2.4M", change: "+8.2%", icon: "💰", color: "#059669" },
  { label: "Annual Run Rate", value: "$28.8M", change: "+12.4%", icon: "📈", color: "#4f46e5" },
  { label: "Churn Rate", value: "2.1%", change: "-0.3%", icon: "📉", color: "#d97706" },
  { label: "Avg Revenue / User", value: "$4.20", change: "+$0.30", icon: "👤", color: "#0284c7" },
];

const monthlyData = [
  { month: "Jan", users: 8.2, revenue: 1.8, jobs: 38 },
  { month: "Feb", users: 8.6, revenue: 1.9, jobs: 41 },
  { month: "Mar", users: 9.0, revenue: 2.0, jobs: 44 },
  { month: "Apr", users: 9.3, revenue: 2.1, jobs: 46 },
  { month: "May", users: 9.6, revenue: 2.1, jobs: 47 },
  { month: "Jun", users: 9.8, revenue: 2.2, jobs: 49 },
  { month: "Jul", users: 10.0, revenue: 2.3, jobs: 51 },
  { month: "Aug", users: 10.2, revenue: 2.4, jobs: 52 },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

const planBreakdown = [
  { plan: "Enterprise", users: "840", revenue: "$1.68M", pct: 70, color: "#b45309" },
  { plan: "Pro", users: "12,400", revenue: "$620K", pct: 26, color: "#4f46e5" },
  { plan: "Free", users: "10.19M", revenue: "$120K", pct: 5, color: "#64748b" },
];

const topRegions = [
  { region: "United States", jobs: "21,450", users: "4.1M", pct: 41 },
  { region: "Europe", jobs: "12,300", users: "2.8M", pct: 27 },
  { region: "Asia Pacific", jobs: "9,100", users: "2.1M", pct: 20 },
  { region: "India", jobs: "5,800", users: "0.9M", pct: 8 },
  { region: "Other", jobs: "3,761", users: "0.3M", pct: 4 },
];

export default function AdminReportsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "22px", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: k.color, borderRadius: "16px 16px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{k.label}</p>
                <p style={{ fontFamily: "var(--font-display,'Outfit',sans-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{k.value}</p>
                <p style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600, marginTop: "6px" }}>{k.change} vs last month</p>
              </div>
              <div style={{ fontSize: "1.5rem" }}>{k.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

        {/* Revenue Bar Chart */}
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Monthly Revenue 2026</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>In millions USD</p>
            </div>
            <button type="button" style={{ padding: "7px 16px", borderRadius: "50px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              Export CSV
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "180px" }}>
            {monthlyData.map((d, i) => (
              <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${(d.revenue / maxRevenue) * 148}px`,
                    background: i === monthlyData.length - 1
                      ? "linear-gradient(180deg, #dc2626, #ef4444)"
                      : "linear-gradient(180deg, rgba(220,38,38,0.3), rgba(220,38,38,0.1))",
                    borderRadius: "6px 6px 0 0",
                    marginTop: "auto",
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", fontWeight: 700, color: i === monthlyData.length - 1 ? "#b91c1c" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                    ${d.revenue}M
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Breakdown */}
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "20px" }}>Plan Distribution</h3>
          {planBreakdown.map((p) => (
            <div key={p.plan} style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.9rem", color: p.color, fontWeight: 700 }}>{p.plan}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 700 }}>{p.pct}%</span>
              </div>
              <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden", marginBottom: "4px" }}>
                <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: "4px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{p.users} users</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{p.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Breakdown */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Geographic Distribution</h3>
          <button type="button" style={{ padding: "7px 16px", borderRadius: "50px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#b91c1c", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Full Report
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 1fr", padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
          {["Region", "Jobs", "Users", "Distribution"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
          ))}
        </div>
        {topRegions.map((r, i) => (
          <div key={r.region} style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 1fr",
            padding: "14px 24px",
            borderBottom: i < topRegions.length - 1 ? "1px solid var(--border)" : "none",
            alignItems: "center",
          }}>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{r.region}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{r.jobs}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{r.users}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden", maxWidth: "200px" }}>
                <div style={{ height: "100%", width: `${r.pct}%`, background: "linear-gradient(90deg, #dc2626, #ef4444)", borderRadius: "3px" }} />
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, minWidth: "36px" }}>{r.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
