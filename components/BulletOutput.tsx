"use client";

import { RefreshCw, Languages } from "lucide-react";
import CharacterCounter from "./CharacterCounter";

interface BulletItem {
  original: string;
  zh: string;
}

interface BulletOutputProps {
  bullets: BulletItem[];
  onRegenerateAll?: () => void;
}

export default function BulletOutput({ bullets, onRegenerateAll }: BulletOutputProps) {
  return (
    <div
      className="card"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">????</h3>
        {onRegenerateAll && (
          <button
            className="p-1.5 rounded hover:opacity-80 transition-opacity flex items-center gap-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
            onClick={onRegenerateAll}
          >
            <RefreshCw size={14} />
            ??????
          </button>
        )}
      </div>
      <div className="space-y-3">
        {bullets.map((bullet, i) => (
          <div key={i} className="rounded-lg p-3" style={{ background: "var(--bg-secondary)" }}>
            <textarea
              className="w-full bg-transparent text-sm resize-none rounded outline-none"
              style={{ color: "var(--text-primary)", minHeight: "40px", border: "none" }}
              defaultValue={bullet.original}
              rows={2}
            />
            {bullet.zh && (
              <div
                className="mt-2 p-2 rounded text-xs"
                style={{
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <div className="flex items-center gap-1 mb-1" style={{ color: "var(--accent)" }}>
                  <Languages size={11} />
                  <span style={{ fontWeight: 500 }}>????</span>
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{bullet.zh}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
