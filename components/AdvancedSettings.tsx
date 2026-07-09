"use client";

import { AdvancedSettings, WritingStyle } from "@/types";
import { Settings2 } from "lucide-react";
import { useState } from "react";

interface AdvancedSettingsProps {
  settings: AdvancedSettings;
  onChange: (settings: AdvancedSettings) => void;
}

export default function AdvancedSettingsPanel({ settings, onChange }: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);

  const update = (partial: Partial<AdvancedSettings>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div>
      <button
        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: "var(--text-secondary)" }}
        onClick={() => setOpen(!open)}
      >
        <Settings2 size={16} />
        高级设置
        <span className="ml-1">{open ? "\u25b2" : "\u25bc"}</span>
      </button>

      {open && (
        <div className="mt-3 p-4 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                标题最大长度: {settings.titleMaxLength}
              </label>
              <input
                type="range"
                min={50}
                max={200}
                value={settings.titleMaxLength}
                onChange={(e) => update({ titleMaxLength: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                亮点最大长度: {settings.highlightMaxLength}
              </label>
              <input
                type="range"
                min={80}
                max={250}
                value={settings.highlightMaxLength}
                onChange={(e) => update({ highlightMaxLength: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                写作风格
              </label>
              <select
                className="select-field"
                value={settings.writingStyle}
                onChange={(e) => update({ writingStyle: e.target.value as WritingStyle })}
              >
                <option value="seo">SEO 优先</option>
                <option value="balanced">平衡型</option>
                <option value="conversion">转化优先</option>
              </select>
            </div>

            <div className="flex items-start gap-4 pt-5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.strictDedupe}
                  onChange={(e) => update({ strictDedupe: e.target.checked })}
                  className="rounded"
                />
                严格去重
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.amazonCompliance}
                  onChange={(e) => update({ amazonCompliance: e.target.checked })}
                  className="rounded"
                />
                亚马逊合规过滤
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

