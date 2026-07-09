"use client";

interface CharacterCounterProps {
  current: number;
  max: number;
}

export default function CharacterCounter({ current, max }: CharacterCounterProps) {
  const ratio = current / max;
  let color = "var(--text-secondary)";
  let label = "OK";

  if (ratio > 1) {
    color = "var(--error)";
    label = "OVER LIMIT";
  } else if (ratio > 0.9) {
    color = "var(--warning)";
    label = "NEAR LIMIT";
  } else {
    const pct = Math.round(ratio * 100);
    if (pct > 70) label = "GOOD";
    else if (pct > 40) label = "OK";
    else label = "SHORT";
  }

  return (
    <div className="flex items-center gap-2 text-xs" style={{ color }}>
      <span>{current}</span>
      <span>/</span>
      <span>{max}</span>
      <span
        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
        style={{
          background: ratio > 1 ? "rgba(239,68,68,0.15)" : ratio > 0.9 ? "rgba(245,158,11,0.15)" : "transparent",
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
}
