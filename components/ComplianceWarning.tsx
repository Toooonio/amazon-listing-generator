"use client";

import { AlertTriangle } from "lucide-react";

interface ComplianceWarningProps {
  warnings: string[];
}

export default function ComplianceWarning({ warnings }: ComplianceWarningProps) {
  if (warnings.length === 0) return null;

  return (
    <div
      className="rounded-lg p-3 text-sm border"
      style={{
        background: "rgba(245,158,11,0.1)",
        borderColor: "rgba(245,158,11,0.3)",
      }}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
        <div>
          <p className="font-medium mb-1" style={{ color: "var(--warning)" }}>
            合规与质量提醒
          </p>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
