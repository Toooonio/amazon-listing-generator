"use client";

interface ProductInputTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductInputTextarea({ value, onChange }: ProductInputTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        产品信息
      </label>
      <textarea
        className="textarea-field font-mono text-sm"
        rows={10}
        placeholder={"Paste your product information here. You can include:\n\n- Product features and specifications\n- Dimensions, materials, and certifications\n- Use cases and target scenarios\n- Your own draft copy (English, Chinese, or mixed)\n- Competitor listings as reference\n- Any combination of raw product data\n\nThe system will extract key selling points and generate Amazon-ready copy."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

