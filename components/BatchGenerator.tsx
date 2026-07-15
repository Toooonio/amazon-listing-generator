"use client";

import { useState, useRef } from "react";
import { Download, Upload, FileSpreadsheet, Play, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { downloadTemplate, parseExcel, downloadResult, BatchRow, BatchResult } from "@/lib/excel";
import { processBatch, BatchProgress } from "@/lib/batch";
import BatchProgressBar from "./BatchProgress";
import { SUPPORTED_LANGUAGES } from "@/lib/language";

export default function BatchGenerator() {
  const [fileName, setFileName] = useState<string>("");
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [progress, setProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    success: 0,
    failed: 0,
    current: 0,
    status: "idle",
  });
  const [results, setResults] = useState<BatchResult[]>([]);
  const [error, setError] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    downloadTemplate();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setFileName(file.name);
    setOriginalFile(file);

    try {
      const parsedRows = await parseExcel(file);
      setRows(parsedRows);
      if (parsedRows.length === 0) {
        setError("No valid data found in the Excel file.");
      }
    } catch (err) {
      setError("Failed to parse Excel: " + (err instanceof Error ? err.message : "Unknown error"));
      setRows([]);
    }
  };

  const handleGenerate = async () => {
    if (rows.length === 0) {
      setError("Please upload an Excel file with product data first.");
      return;
    }

    if (rows.length > 200) {
      setError("Please split your Excel into batches of 200 products.");
      return;
    }

    setError("");
    setResults([]);

    const batchResults = await processBatch(rows, targetLanguage, (p) => {
      setProgress({ ...p });
    });

    setResults(batchResults);
  };

  const handleDownloadResult = () => {
    if (originalFile && results.length > 0) {
      downloadResult(originalFile, results);
    }
  };

  const canGenerate = rows.length > 0 && progress.status !== "running";

  return (
    <div
      className="mt-12 pt-8 border-t rounded-lg p-6"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      <h2 className="text-lg font-semibold mb-1">Batch Excel Generator</h2>
      <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
        Upload an Excel file with multiple products and generate Amazon listing copy in batch.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Download Template */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          onClick={handleDownloadTemplate}
        >
          <Download size={16} />
          Download Excel Template
        </button>

        {/* Upload Excel */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={16} />
          Upload Excel
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleUpload}
        />

        {/* Language Select */}
        <div>
          <select
            className="select-field text-sm"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: canGenerate ? "var(--accent)" : "var(--bg-primary)",
            color: canGenerate ? "white" : "var(--text-secondary)",
            border: "1px solid",
            borderColor: canGenerate ? "var(--accent)" : "var(--border)",
            cursor: canGenerate ? "pointer" : "not-allowed",
            opacity: canGenerate ? 1 : 0.6,
          }}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          <Play size={16} />
          Generate Batch Listing
        </button>
      </div>

      {/* File info */}
      {fileName && (
        <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <FileSpreadsheet size={16} />
          <span>{fileName}</span>
          {rows.length > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs" style={{ background: "var(--bg-primary)", color: "var(--accent)" }}>
              {rows.length} Products Loaded
            </span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: "var(--error)" }}>
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Progress */}
      <BatchProgressBar {...progress} />

      {/* Download Result */}
      {progress.status === "done" && results.length > 0 && (
        <div className="mt-4">
          <button
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "var(--success)",
              color: "white",
            }}
            onClick={handleDownloadResult}
          >
            <Download size={16} />
            Download Result.xlsx
          </button>
        </div>
      )}
    </div>
  );
}
