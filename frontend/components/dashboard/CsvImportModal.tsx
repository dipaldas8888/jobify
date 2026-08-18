"use client";

import { useState, useRef, useCallback } from "react";
import { jobsApi } from "@/lib/api";
import { toast } from "react-toastify";

interface CsvImportResult {
  imported: number;
  skipped: number;
  errors?: string[];
  message: string;
}

interface CsvImportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CsvImportModal({ onClose, onSuccess }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectedHeaders, setDetectedHeaders] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith(".csv")) {
      setFile(dropped);
      setError(null);
      setResult(null);
      setDetectedHeaders(null);
    } else {
      setError("Please drop a valid .csv file");
      toast.error("Please drop a valid .csv file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setResult(null);
      setDetectedHeaders(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("csvFile", file);

    const res = await jobsApi.bulkImportJobs(formData);

    setIsUploading(false);

    if (res.success) {
      setResult({
        imported: res.imported || 0,
        skipped: res.skipped || 0,
        errors: res.errors,
        message: res.message || "",
      });
      toast.success(res.message || `Successfully imported ${res.imported || 0} jobs!`);
      onSuccess();
    } else {
      const errMsg = res.message || "Import failed. Please check your CSV format.";
      setError(errMsg);
      toast.error(errMsg);
      if (res.detectedHeaders) setDetectedHeaders(res.detectedHeaders);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "title",
      "company",
      "location",
      "salary",
      "experience",
      "jobType",
      "workMode",
      "description",
      "skillsRequired",
      "openings",
      "education",
      "deadline",
    ];
    const example = [
      "Senior React Developer",
      "TechNova Solutions",
      "Bangalore, India",
      "2100000",
      "Mid Level",
      "Full Time",
      "On-site",
      "Build high-performance web applications using React and TypeScript.",
      "React, TypeScript, Redux, GraphQL",
      "2",
      "B.Tech",
      "2025-12-31",
    ];
    const csv = [headers.join(","), example.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobify_bulk_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(6px)",
          zIndex: 9000,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9001,
          width: "min(620px, 95vw)",
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "22px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.18)",
          padding: "32px",
          color: "var(--text-primary)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display, 'Outfit', sans-serif)" }}>
              📂 Bulk Import Jobs
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Upload a CSV file to post multiple job positions at once
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              color: "#64748b",
              fontSize: "1.1rem",
              cursor: "pointer",
              padding: "6px 12px",
              lineHeight: 1,
              transition: "all 0.2s ease",
            }}
          >
            ✕
          </button>
        </div>

        {/* CSV Format Guide */}
        <div
          style={{
            background: "rgba(79,70,229,0.04)",
            border: "1px solid rgba(79,70,229,0.18)",
            borderRadius: "14px",
            padding: "16px 18px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "0.825rem", color: "#4f46e5", fontWeight: 700, marginBottom: "10px" }}>
            📋 Required & Supported CSV Columns
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["title ✓", "location ✓", "description ✓", "company", "salary", "experience", "jobType", "workMode", "skillsRequired", "openings", "education", "deadline"].map((col) => (
              <span
                key={col}
                style={{
                  background: col.includes("✓") ? "rgba(79,70,229,0.12)" : "#ffffff",
                  border: `1px solid ${col.includes("✓") ? "rgba(79,70,229,0.3)" : "#e2e8f0"}`,
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "0.75rem",
                  color: col.includes("✓") ? "#4f46e5" : "#475569",
                  fontFamily: "monospace",
                  fontWeight: col.includes("✓") ? 700 : 500,
                }}
              >
                {col}
              </span>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "0.775rem", color: "#64748b" }}>
            ✓ = mandatory fields. Skills should be comma-separated. Salary should be a number (annual).
          </p>
        </div>

        {/* Download template */}
        <button
          onClick={downloadTemplate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ffffff",
            border: "1px dashed rgba(79,70,229,0.4)",
            borderRadius: "12px",
            color: "#4f46e5",
            fontSize: "0.85rem",
            fontWeight: 700,
            cursor: "pointer",
            padding: "12px 18px",
            width: "100%",
            justifyContent: "center",
            marginBottom: "20px",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(79,70,229,0.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          ⬇ Download Sample CSV Template
        </button>

        {/* Drop Zone */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "#4f46e5" : file ? "#16a34a" : "#cbd5e1"}`,
              borderRadius: "16px",
              padding: "36px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging
                ? "rgba(79,70,229,0.06)"
                : file
                ? "rgba(22,163,74,0.04)"
                : "#f8fafc",
              transition: "all 0.2s ease",
              marginBottom: "20px",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>
              {file ? "✅" : "📁"}
            </div>
            {file ? (
              <>
                <p style={{ margin: 0, fontWeight: 700, color: "#16a34a", fontSize: "0.975rem" }}>
                  {file.name}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.825rem", color: "#64748b" }}>
                  {(file.size / 1024).toFixed(1)} KB — click to change file
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                  Drag & drop your CSV file here
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.825rem", color: "#64748b" }}>
                  or click to browse from device • Max 5MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "#991b1b",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Detected Headers Debug Panel */}
        {detectedHeaders && detectedHeaders.length > 0 && (
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "12px",
              padding: "14px 16px",
              marginBottom: "16px",
            }}
          >
            <p style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#b45309", fontWeight: 700 }}>
              📋 Your CSV has these columns — rename them to match required names:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {detectedHeaders.map((h) => (
                <span
                  key={h}
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    fontSize: "0.75rem",
                    color: "#b45309",
                    fontFamily: "monospace",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: "0.775rem", color: "#64748b" }}>
              Required: <code style={{ color: "#4f46e5" }}>title</code>, <code style={{ color: "#4f46e5" }}>location</code>, <code style={{ color: "#4f46e5" }}>description</code>. Download template for details.
            </p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "14px",
                padding: "18px",
                marginBottom: "12px",
              }}
            >
              <p style={{ margin: 0, fontWeight: 800, color: "#166534", fontSize: "1.05rem" }}>
                ✅ Import Complete!
              </p>
              <div style={{ display: "flex", gap: "24px", marginTop: "12px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>{result.imported}</div>
                  <div style={{ fontSize: "0.775rem", color: "#64748b", fontWeight: 600 }}>Imported</div>
                </div>
                {result.skipped > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#d97706" }}>{result.skipped}</div>
                    <div style={{ fontSize: "0.775rem", color: "#64748b", fontWeight: 600 }}>Skipped</div>
                  </div>
                )}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: "0.85rem", color: "#334155" }}>
                {result.message}
              </p>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#b45309", fontWeight: 700 }}>
                  Skipped Rows Details:
                </p>
                {result.errors.map((e, i) => (
                  <p key={i} style={{ margin: "0 0 4px", fontSize: "0.775rem", color: "#64748b" }}>
                    • {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          {result ? (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.925rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
              }}
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: file && !isUploading
                    ? "linear-gradient(135deg, #4f46e5, #6366f1)"
                    : "#e2e8f0",
                  border: "none",
                  borderRadius: "12px",
                  color: file && !isUploading ? "#ffffff" : "#94a3b8",
                  fontWeight: 700,
                  fontSize: "0.925rem",
                  cursor: file && !isUploading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: file && !isUploading ? "0 4px 14px rgba(79,70,229,0.3)" : "none",
                }}
              >
                {isUploading ? (
                  <>
                    <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                    Uploading...
                  </>
                ) : (
                  "📤 Import Jobs"
                )}
              </button>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
