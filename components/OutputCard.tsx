"use client";

import { RefreshCw, Copy, Check, AlertTriangle, Languages } from "lucide-react";
import { useState } from "react";
import CharacterCounter from "./CharacterCounter";

interface OutputCardProps {
  label: string;
  content: string;
  zhContent?: string;
  maxLength?: number;
  onRegenerate?: () => void;
  editable?: boolean;
}

export default function OutputCard({
  label,
  content,
  zhContent,
  maxLength,
  onRegenerate,
  editable = true,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = editContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isOverLimit = maxLength ? editContent.length > maxLength : false;

  return (
    <div
      className="card"
      style={{
        borderColor: isOverLimit ? "var(--error)" : "var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <div className="flex items-center gap-1">
          {maxLength && (
            <CharacterCounter current={editContent.length} max={maxLength} />
          )}
          {onRegenerate && (
            <button
              className="p-1.5 rounded hover:opacity-80 transition-opacity"
              style={{ color: "var(--text-secondary)" }}
              title="????"
              onClick={onRegenerate}
            >
              <RefreshCw size={14} />
            </button>
          )}
          <button
            className="p-1.5 rounded hover:opacity-80 transition-opacity"
            style={{
              color: copied ? "var(--success)" : "var(--text-secondary)",
            }}
            title="??????"
            onClick={handleCopy}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {editable ? (
        <textarea
          className="w-full bg-transparent text-sm resize-y rounded p-2 border transition-colors outline-none"
          style={{
            borderColor: isOverLimit ? "var(--error)" : "transparent",
            color: "var(--text-primary)",
            minHeight: "60px",
          }}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <div
          className="text-sm whitespace-pre-wrap p-2 min-h-[40px]"
          style={{ color: "var(--text-primary)" }}
        >
          {editContent}
        </div>
      )}

      {isOverLimit && (
        <div className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: "var(--error)" }}>
          <AlertTriangle size={12} />
          <span>?? {maxLength} ????</span>
        </div>
      )}

      {/* Chinese reference translation */}
      {zhContent && (
        <div
          className="mt-3 p-2 rounded text-xs"
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <div className="flex items-center gap-1 mb-1" style={{ color: "var(--accent)" }}>
            <Languages size={12} />
            <span style={{ fontWeight: 500 }}>??????</span>
          </div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{zhContent}</p>
        </div>
      )}
    </div>
  );
}
