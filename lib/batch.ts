"use client";

import { BatchRow, BatchResult } from "./excel";

export interface BatchProgress {
  total: number;
  completed: number;
  success: number;
  failed: number;
  current: number;
  status: "idle" | "running" | "done" | "error";
}

interface ApiSettings {
  titleMaxLength: number;
  highlightMaxLength: number;
  writingStyle: string;
  strictDedupe: boolean;
  amazonCompliance: boolean;
}

export async function processBatch(
  rows: BatchRow[],
  targetLanguage: string,
  onProgress: (progress: BatchProgress) => void
): Promise<BatchResult[]> {
  const total = rows.length;
  const results: BatchResult[] = [];
  let completedCount = 0;
  let successCount = 0;
  let failedCount = 0;

  onProgress({
    total,
    completed: 0,
    success: 0,
    failed: 0,
    current: 0,
    status: "running",
  });

  for (let i = 0; i < total; i++) {
    const row = rows[i];

    try {
      const body = JSON.stringify({
        brand: row.brand,
        language: targetLanguage,
        mode: "title-highlights",
        productInfo: row.productInfo,
        settings: {
          titleMaxLength: row.titleLimit,
          highlightMaxLength: row.highlightLimit,
          writingStyle: "balanced",
          strictDedupe: true,
          amazonCompliance: true,
        } as ApiSettings,
      });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        results.push({
          rowIndex: row.rowIndex,
          title: "Generation Failed",
          highlight: "Generation Failed",
          success: false,
        });
        failedCount++;
      } else {
        const data = await response.json();
        const title = data?.title?.original || "Generation Failed";
        const highlight = data?.highlight?.original || "Generation Failed";
        const isSuccess = title !== "Generation Failed" && highlight !== "Generation Failed";

        results.push({
          rowIndex: row.rowIndex,
          title,
          highlight,
          success: isSuccess,
        });
        if (isSuccess) {
          successCount++;
        } else {
          failedCount++;
        }
      }
    } catch {
      results.push({
        rowIndex: row.rowIndex,
        title: "Generation Failed",
        highlight: "Generation Failed",
        success: false,
      });
      failedCount++;
    }

    completedCount++;

    onProgress({
      total,
      completed: completedCount,
      success: successCount,
      failed: failedCount,
      current: i + 1,
      status: completedCount < total ? "running" : "done",
    });
  }

  return results;
}
