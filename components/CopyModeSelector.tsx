"use client";

import { CopyMode } from "@/types";

interface CopyModeSelectorProps {
  value: CopyMode;
  onChange: (value: CopyMode) => void;
}

const options: { value: CopyMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "create", label: "Create New Copy" },
  { value: "optimize", label: "Smart Optimization" },
];

export default function CopyModeSelector({ value, onChange }: CopyModeSelectorProps) {
  return (
    <div>
      <span className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        Copy approach
      </span>
      <div className="inline-flex max-w-full overflow-x-auto rounded-lg border p-1" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            className="shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              background: value === option.value ? "var(--accent)" : "transparent",
              color: value === option.value ? "#fff" : "var(--text-secondary)",
            }}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
