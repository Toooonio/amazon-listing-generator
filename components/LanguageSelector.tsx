"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/language";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  autoDetected?: string;
}

export default function LanguageSelector({ value, onChange, autoDetected }: LanguageSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        目标输出语言
      </label>
      <select
        className="select-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
      {autoDetected && autoDetected !== value && (
        <p className="text-xs mt-1" style={{ color: "var(--warning)" }}>
          输入语言检测为{' '}
          {SUPPORTED_LANGUAGES.find((l) => l.code === autoDetected)?.label || autoDetected}
          。输出将用您选择的目标语言生成。
        </p>
      )}
    </div>
  );
}
