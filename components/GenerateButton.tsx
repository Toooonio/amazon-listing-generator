"use client";

import { Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function GenerateButton({ onClick, loading, disabled }: GenerateButtonProps) {
  return (
    <button
      className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-base"
      onClick={onClick}
      disabled={disabled || loading}
    >
      <Sparkles size={20} />
      {loading ? "生成中..." : "生成亚马逊 Listing"}
    </button>
  );
}
