"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import OutputCard from "./OutputCard";

interface BulletOutputProps {
  bullets: string[];
  onRegenerateAll?: () => void;
  onRegenerateBullet?: (index: number) => void;
}

export default function BulletOutput({ bullets, onRegenerateAll, onRegenerateBullet }: BulletOutputProps) {
  return (
    <div
      className="card"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">五点描述</h3>
        {onRegenerateAll && (
          <button
            className="p-1.5 rounded hover:opacity-80 transition-opacity flex items-center gap-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
            onClick={onRegenerateAll}
          >
            <RefreshCw size={14} />
            全部重新生成
          </button>
        )}
      </div>
      <div className="space-y-2">
        {bullets.map((bullet, i) => (
          <OutputCard
            key={i}
            label={"Bullet " + (i + 1)}
            content={bullet}
            editable={true}
            onRegenerate={onRegenerateBullet ? () => onRegenerateBullet(i) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
