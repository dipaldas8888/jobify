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
          background: "rgba(0,0,0,0.6)",
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
          width: "min(600px, 95vw)",
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          padding: "32px",
          color: "#e2e8f0",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc" }}>
              📂 Bulk Import Jobs
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
              Upload a CSV file to post multiple jobs at once
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#94a3b8",
              fontSize: "1.1rem",
              cursor: "pointer",
              padding: "6px 10px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* CSV Format Guide */}
        <div
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#a5b4fc", fontWeight: 600, marginBottom: "8px" }}>
            📋 Required CSV Columns
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["title ✓", "location ✓", "description ✓", "company", "salary", "experience", "jobType", "workMode", "skillsRequired", "openings", "education", "deadline"].map((col) => (
              <span
                key={col}
                style={{
                  background: col.includes("✓") ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${col.includes("✓") ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "0.72rem",
                  color: col.includes("✓") ? "#a5b4fc" : "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                {col}
              </span>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "0.75rem", color: "#64748b" }}>
            ✓ = required. Skills should be comma-separated within the cell. Salary should be a number (annual).
          </p>
        </div>

        {/* Download template */}
        <button
          onClick={downloadTemplate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "1px dashed rgba(99,102,241,0.4)",
            borderRadius: "10px",
            color: "#a5b4fc",
            fontSize: "0.83rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: "10px 16px",
            width: "100%",
            justifyContent: "center",
            marginBottom: "20px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          ⬇ Download CSV Template
        </button>

        {/* Drop Zone */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? "#6366f1" : file ? "#22c55e" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "14px",
              padding: "36px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: isDragging
                ? "rgba(99,102,241,0.08)"
                : file
                ? "rgba(34,197,94,0.04)"
                : "rgba(255,255,255,0.02)",
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
                <p style={{ margin: 0, fontWeight: 600, color: "#4ade80", fontSize: "0.95rem" }}>
                  {file.name}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                  {(file.size / 1024).toFixed(1)} KB — click to change
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 600, color: "#94a3b8", fontSize: "0.95rem" }}>
                  Drag & drop your CSV file here
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "0.8rem", color: "#475569" }}>
                  or click to browse • Max 5MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.25)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "#fca5a5",
              fontSize: "0.85rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Detected Headers Debug Panel */}
        {detectedHeaders && detectedHeaders.length > 0 && (
          <div
            style={{
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
            }}
          >
            <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "#fbbf24", fontWeight: 600 }}>
              📋 Your CSV has these columns — rename them to match required names:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {detectedHeaders.map((h) => (
                <span
                  key={h}
                  style={{
                    background: "rgba(251,191,36,0.12)",
                    border: "1px solid rgba(251,191,36,0.25)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    fontSize: "0.72rem",
                    color: "#fbbf24",
                    fontFamily: "monospace",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: "0.74rem", color: "#64748b" }}>
              Required: <code style={{ color: "#a5b4fc" }}>title</code>, <code style={{ color: "#a5b4fc" }}>location</code>, <code style={{ color: "#a5b4fc" }}>description</code>. Download the template to see all column names.
            </p>
          </div>
        )}


        {/* Success Result */}
        {result && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, color: "#4ade80", fontSize: "1rem" }}>
                ✅ Import Complete!
              </p>
              <div style={{ display: "flex", gap: "24px", marginTop: "10px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#4ade80" }}>{result.imported}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Imported</div>
                </div>
                {result.skipped > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fbbf24" }}>{result.skipped}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Skipped</div>
                  </div>
                )}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                {result.message}
              </p>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div
                style={{
                  background: "rgba(251,191,36,0.06)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "#fbbf24", fontWeight: 600 }}>
                  Skipped Rows:
                </p>
                {result.errors.map((e, i) => (
                  <p key={i} style={{ margin: "0 0 4px", fontSize: "0.74rem", color: "#94a3b8" }}>
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
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
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
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  color: "#94a3b8",
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
                    ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                    : "rgba(99,102,241,0.25)",
                  border: "none",
                  borderRadius: "10px",
                  color: file && !isUploading ? "#fff" : "#475569",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: file && !isUploading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
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
