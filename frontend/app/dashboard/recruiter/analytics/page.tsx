"use client";

const metrics = [
  { label: "Avg. Time to Hire", value: "18 days", change: "-3 days", trend: "down", icon: "⏱️", color: "#4f46e5", note: "vs 21 days last month" },
  { label: "Offer Acceptance Rate", value: "78%", change: "+5%", trend: "up", icon: "✅", color: "#059669", note: "vs 73% last month" },
  { label: "Application-to-Hire", value: "1:106", change: "-12", trend: "up", icon: "🎯", color: "#0284c7", note: "Industry avg 1:150" },
  { label: "Cost Per Hire", value: "$4.2K", change: "-$600", trend: "down", icon: "💰", color: "#d97706", note: "vs $4.8K last month" },
];

const jobPerformance = [
  { title: "Senior Frontend Engineer", views: 1240, applied: 48, shortlisted: 12, hired: 2, ctr: "3.9%" },
  { title: "Product Manager", views: 3580, applied: 112, shortlisted: 28, hired: 1, ctr: "3.1%" },
  { title: "Backend Developer", views: 890, applied: 23, shortlisted: 7, hired: 0, ctr: "2.6%" },
  { title: "UX Designer", views: 2100, applied: 67, shortlisted: 18, hired: 1, ctr: "3.2%" },
  { title: "DevOps Engineer", views: 760, applied: 19, shortlisted: 5, hired: 1, ctr: "2.5%" },
];

const sourceData = [
  { source: "Jobify Search", count: 347, pct: 41, color: "#4f46e5" },
  { source: "LinkedIn", count: 203, pct: 24, color: "#0077b5" },
  { source: "Direct Apply", count: 152, pct: 18, color: "#0284c7" },
  { source: "Referrals", count: 101, pct: 12, color: "#059669" },
  { source: "Other", count: 44, pct: 5, color: "#64748b" },
];

const weeklyData = [45, 68, 52, 91, 73, 88, 64]; // applications per day (last 7 days)
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxVal = Math.max(...weeklyData);

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: m.color, borderRadius: "16px 16px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{m.label}</p>
                <p style={{ fontFamily: "var(--font-display,'Outfit',sans-serif)", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{m.value}</p>
                <p style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600, marginTop: "6px" }}>
                  {m.change} · <span style={{ color: "var(--text-muted)" }}>{m.note}</span>
                </p>
              </div>
              <div style={{ fontSize: "1.5rem" }}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>

        {/* Weekly Applications Chart */}
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "2px" }}>Applications This Week</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>481 total · +14% from last week</p>
            </div>
            <span style={{ padding: "5px 12px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 600, background: "rgba(5,150,105,0.08)", color: "#047857", border: "1px solid rgba(5,150,105,0.2)" }}>
              ↑ 14%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "160px" }}>
            {weeklyData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${(val / maxVal) * 130}px`,
                    background: i === weeklyData.indexOf(maxVal)
                      ? "linear-gradient(180deg, #4f46e5, #6366f1)"
                      : "linear-gradient(180deg, rgba(79,70,229,0.3), rgba(79,70,229,0.1))",
                    borderRadius: "6px 6px 0 0",
                    marginTop: "auto",
                    transition: "height 0.6s ease",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-22px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: i === weeklyData.indexOf(maxVal) ? "#4f46e5" : "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {val}
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "20px" }}>Traffic Sources</h3>
          {sourceData.map((s) => (
            <div key={s.source} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)", fontWeight: 500 }}>{s.source}</span>
                <span style={{ fontSize: "0.825rem", color: "var(--text-primary)", fontWeight: 700 }}>{s.pct}%</span>
              </div>
              <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: "3px" }} />
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{s.count} applications</p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Performance Table */}
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Job Performance Breakdown</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 80px 80px 100px 80px 80px", padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "#f8fafc" }}>
          {["Job Title", "Views", "Applied", "Shortlisted", "Hired", "CTR"].map((col) => (
            <div key={col} style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)" }}>{col}</div>
          ))}
        </div>
        {jobPerformance.map((job, i) => (
          <div
            key={job.title}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 80px 80px 100px 80px 80px",
              padding: "14px 24px",
              borderBottom: i < jobPerformance.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{job.title}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{job.views.toLocaleString()}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{job.applied}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{job.shortlisted}</p>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: job.hired > 0 ? "#047857" : "var(--text-muted)" }}>{job.hired}</p>
            <p style={{ fontSize: "0.875rem", color: "#4f46e5", fontWeight: 600 }}>{job.ctr}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
