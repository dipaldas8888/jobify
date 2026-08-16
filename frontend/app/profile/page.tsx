"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, apiRequest } from "@/lib/api";
import { useAppSelector, useAppDispatch } from "@/lib/redux/store";
import { setCredentials } from "@/lib/redux/slices/authSlice";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [completionScore, setCompletionScore] = useState(0);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.getProfile();
      if (res.success && res.data) {
        const d = res.data;
        setProfileData(d);
        setCompletionScore(res.profileCompletion || 80);
        setName(d.name || "");
        setPhone(d.phone || "");
        setLocation(d.location || "");
        setAbout(d.about || "");
        setSkills(Array.isArray(d.skills) ? d.skills : []);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setIsSaving(true);

    try {
      const payload = {
        name,
        phone,
        location,
        about,
        skills,
      };

      const res = await apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setNotification({ type: "success", text: "🎉 Profile updated successfully!" });
        // Update Redux state
        if (res.data) {
          const token = localStorage.getItem("jobify_token") || "";
          dispatch(setCredentials({ user: res.data, token }));
        }
      } else {
        setNotification({ type: "error", text: res.message || "Failed to update profile." });
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Error updating profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setResumeFile(file);
    setIsUploadingResume(true);
    setNotification(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await apiRequest("/users/profile/resume", {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        setNotification({ type: "success", text: "🎉 Resume uploaded successfully!" });
        fetchProfile();
      } else {
        setNotification({ type: "error", text: res.message || "Failed to upload resume." });
      }
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Error uploading resume file." });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>Loading profile details…</p>
      </div>
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";
  const resumeUrl = profileData?.resume
    ? profileData.resume.startsWith("http")
      ? profileData.resume
      : `${backendUrl}${profileData.resume}`
    : null;

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", padding: "40px 20px 80px" }}>
      <div className="container-main" style={{ maxWidth: "900px" }}>
        {/* Header Profile Banner Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            borderRadius: "24px",
            padding: "32px",
            color: "white",
            marginBottom: "28px",
            boxShadow: "0 10px 30px -5px rgba(79, 70, 229, 0.3)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background: "#ffffff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                fontWeight: 900,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>

            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, color: "white" }}>
                  {name || "User Profile"}
                </h1>
                <span
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "50px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {profileData?.role || user?.role || "Candidate"}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", opacity: 0.9, margin: "6px 0 0" }}>
                {profileData?.email || user?.email}
              </p>
            </div>

            {/* Profile Completion Indicator */}
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                borderRadius: "16px",
                padding: "14px 20px",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "white" }}>
                {completionScore}%
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.9, marginTop: "2px", fontWeight: 600 }}>
                Profile Score
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "14px",
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "24px",
              background: notification.type === "success" ? "rgba(5,150,105,0.08)" : "rgba(220,38,38,0.08)",
              border: `1px solid ${notification.type === "success" ? "rgba(5,150,105,0.25)" : "rgba(220,38,38,0.25)"}`,
              color: notification.type === "success" ? "#047857" : "#b91c1c",
            }}
          >
            {notification.text}
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section 1: Personal Details */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "18px" }}>
              👤 Personal Information
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Primary Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA / Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input"
                  style={{ borderRadius: "12px" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                About / Personal Bio
              </label>
              <textarea
                rows={3}
                placeholder="Share a short introduction about your background and professional goals…"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px", resize: "vertical" }}
              />
            </div>
          </div>

          {/* Section 2: Resume / CV Upload */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
              📄 Candidate Resume / CV
            </h2>

            {resumeUrl ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  background: "rgba(79,70,229,0.06)",
                  border: "1px solid rgba(79,70,229,0.2)",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📄</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", margin: 0 }}>
                      Current Resume Attached
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                      Uploaded and ready for employer review
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}
                  >
                    👁️ View Resume
                  </a>
                  <a
                    href={resumeUrl}
                    download
                    className="btn-primary"
                    style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem", textDecoration: "none", fontWeight: 600 }}
                  >
                    📥 Download
                  </a>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                No resume uploaded yet. Upload your PDF/DOC resume to apply to employers.
              </p>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                Upload New Resume (PDF / DOC / DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={isUploadingResume}
                className="search-input"
                style={{ borderRadius: "12px", padding: "10px" }}
              />
              {isUploadingResume && (
                <p style={{ fontSize: "0.8rem", color: "#4f46e5", marginTop: "6px", fontWeight: 600 }}>
                  Uploading resume file…
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Skills & Expertise */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "28px",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
              ⚡ Key Skills & Expertise
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    background: "rgba(79,70,229,0.08)",
                    color: "#4f46e5",
                    border: "1px solid rgba(79,70,229,0.2)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "0.9rem" }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", maxWidth: "420px" }}>
              <input
                type="text"
                placeholder="Add skill (e.g. React, Python, UI Design)…"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="search-input"
                style={{ borderRadius: "12px", flex: 1 }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary"
                style={{ padding: "8px 18px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Action Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? "Saving Profile…" : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
