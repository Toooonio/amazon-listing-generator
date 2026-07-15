"use client";

interface BatchProgressProps {
  total: number;
  completed: number;
  success: number;
  failed: number;
  current: number;
  status: "idle" | "running" | "done" | "error";
}

export default function BatchProgress({
  total,
  completed,
  success,
  failed,
  current,
  status,
}: BatchProgressProps) {
  if (status === "idle") return null;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mt-4">
      {/* Progress bar */}
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: percentage + "%",
            background:
              status === "done"
                ? failed > 0
                  ? "linear-gradient(90deg, #22c55e, #f59e0b)"
                  : "var(--success)"
                : "var(--accent)",
          }}
        />
      </div>

      {/* Status info */}
      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
        <div className="flex items-center gap-3">
          {status === "running" && (
            <span style={{ color: "var(--accent)" }}>
              Generating... {current}/{total}
            </span>
          )}
          {status === "done" && (
            <span style={{ color: "var(--success)" }}>Completed</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span style={{ color: "var(--success)" }}>Success: {success}</span>
          {failed > 0 && (
            <span style={{ color: "var(--error)" }}>Failed: {failed}</span>
          )}
        </div>
      </div>
    </div>
  );
}
