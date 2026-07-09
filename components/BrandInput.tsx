"use client";

interface BrandInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BrandInput({ value, onChange }: BrandInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        品牌名
      </label>
      <input
        type="text"
        className="input-field"
        placeholder="输入品牌名，例如 Simzlife"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
        品牌名将自动放在标题的最前面。
      </p>
    </div>
  );
}
