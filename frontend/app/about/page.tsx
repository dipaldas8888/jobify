"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(2, 132, 199, 0.03) 100%)",
          padding: "70px 0 60px",
          borderBottom: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div className="container-main" style={{ maxWidth: "840px" }}>
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
            🚀 About Jobify
          </span>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.25,
              marginBottom: "20px",
            }}
          >
            Connecting Extraordinary Talent with Industry Leaders
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "36px" }}>
            Jobify is the next-generation employment platform built to simplify hiring, eliminate recruitment friction, and help candidates unlock career opportunities worldwide.
          </p>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/jobs"
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "0.95rem", borderRadius: "12px", textDecoration: "none" }}
            >
              Explore Open Jobs →
            </Link>
            <Link
              href="/auth/register?role=recruiter"
              className="btn-secondary"
              style={{ padding: "12px 28px", fontSize: "0.95rem", borderRadius: "12px", textDecoration: "none" }}
            >
              Hire Top Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Key Impact Stats Bar */}
      <section style={{ background: "white", padding: "40px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container-main">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              textAlign: "center",
            }}
          >
            {[
              { number: "50,000+", label: "Jobs Published" },
              { number: "200,000+", label: "Active Candidates" },
              { number: "10,000+", label: "Hiring Companies" },
              { number: "98%", label: "Placement Success Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    color: "#4f46e5",
                    fontFamily: "var(--font-display, 'Outfit', sans-serif)",
                  }}
                >
                  {stat.number}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "70px 0" }}>
        <div className="container-main">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            {/* Mission */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "36px",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  background: "rgba(79, 70, 229, 0.1)",
                  color: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🎯
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
                Our Mission
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                To empower job seekers with transparent information, verified salary benchmarks, and direct connections to hiring decision-makers, while providing recruiters with powerful, intuitive tools to find the right candidates faster.
              </p>
            </div>

            {/* Vision */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "36px",
                border: "1px solid var(--border)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  background: "rgba(2, 132, 199, 0.1)",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                }}
              >
                🌟
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
                Our Vision
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                To create a global talent ecosystem where employment decisions are driven by merit, skills, and cultural alignment—enabling professionals everywhere to build fulfilling, impactful careers regardless of geography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section style={{ background: "white", padding: "70px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-main">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
              Values That Drive Us
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              These core principles guide our product engineering, platform features, and company culture.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { icon: "💡", title: "Transparency First", desc: "No hidden salary ranges or misleading requirements. Clear insights for all candidates." },
              { icon: "⚡", title: "Speed & Simplicity", desc: "Fast applications, instant recruiter notifications, and zero unnecessary paperwork." },
              { icon: "🛡️", title: "Verified Employers", desc: "Every company and job posting is thoroughly vetted for legitimacy and quality." },
              { icon: "🤝", title: "Candidate Empowerment", desc: "Putting control back into the hands of professionals with personalized job alerts and tracking." },
            ].map((val) => (
              <div
                key={val.title}
                style={{
                  padding: "28px",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "14px" }}>{val.icon}</div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: "70px 0" }}>
        <div className="container-main">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
              Meet Our Leadership
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              The team behind Jobify dedicated to transforming recruitment for everyone.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "28px" }}>
            {[
              { name: "Alex Rivera", role: "Founder & CEO", avatar: "👨‍💼", bio: "Ex-Engineering Director passionate about talent technology." },
              { name: "Sophia Chen", role: "Chief Technology Officer", avatar: "👩‍💻", bio: "Leading AI architecture and candidate matching algorithms." },
              { name: "Marcus Vance", role: "VP of Product", avatar: "👨‍🔬", bio: "Designing modern, seamless product experiences for job seekers." },
              { name: "Elena Rostova", role: "Head of Talent Partnerships", avatar: "👩‍💼", bio: "Building relationships with top employers and tech startups." },
            ].map((member) => (
              <div
                key={member.name}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.2rem",
                    margin: "0 auto 16px",
                  }}
                >
                  {member.avatar}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: "0.825rem", color: "#4f46e5", fontWeight: 700, marginBottom: "10px" }}>
                  {member.role}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "0 0 80px" }}>
        <div className="container-main">
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
              borderRadius: "24px",
              padding: "50px 30px",
              color: "white",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.25)",
            }}
          >
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "16px" }}>
              Ready to Accelerate Your Career or Hiring?
            </h2>
            <p style={{ fontSize: "1.05rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6 }}>
              Join thousands of professionals and top companies who trust Jobify to build the future of work.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/jobs"
                style={{
                  background: "white",
                  color: "#4f46e5",
                  fontWeight: 700,
                  padding: "12px 28px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                Browse Job Listings
              </Link>
              <Link
                href="/auth/register"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  fontWeight: 700,
                  padding: "12px 28px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "0.95rem",
                }}
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
