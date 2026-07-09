"use client";

import { RefreshCw, Copy, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";
import CharacterCounter from "./CharacterCounter";

interface OutputCardProps {
  label: string;
  content: string;
  maxLength?: number;
  onRegenerate?: () => void;
  editable?: boolean;
}

export default function OutputCard({
  label,
  content,
  maxLength,
  onRegenerate,
  editable = true,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

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
              title="重新生成"
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
            title="复制到剪贴板"
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
          onChange={(e) => {
            setEditContent(e.target.value);
            setIsEditing(true);
          }}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
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
          <span>超出 {maxLength} 字符限制</span>
        </div>
      )}
    </div>
  );
}
