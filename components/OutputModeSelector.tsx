"use client";

import { OutputMode } from "@/types";

interface OutputModeSelectorProps {
  value: OutputMode;
  onChange: (value: OutputMode) => void;
}

const modes: { value: OutputMode; label: string; description: string }[] = [
  { value: "title-highlights", label: "标题 + 亮点", description: "Title (\u226475 chars) + Highlight (\u2264125 chars)" },
  { value: "bullets", label: "Bullet Points", description: "5条亚马逊风格五点描述" },
  { value: "description", label: "Product Description", description: "完整产品描述" },
  { value: "all", label: "全部生成", description: "标题 + 亮点 + Bullets + Description" },
];

export default function OutputModeSelector({ value, onChange }: OutputModeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        输出模式
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            className="text-left p-3 rounded-lg border text-sm transition-all"
            style={{
              background: value === mode.value ? 'var(--accent)' : 'var(--bg-secondary)',
              borderColor: value === mode.value ? 'var(--accent)' : 'var(--border)',
              color: value === mode.value ? '#fff' : 'var(--text-primary)',
            }}
            onClick={() => onChange(mode.value)}
          >
            <div className="font-medium">{mode.label}</div>
            <div className="text-xs mt-0.5 opacity-80">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

