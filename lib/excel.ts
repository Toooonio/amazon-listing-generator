"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface BatchRow {
  brand: string;
  productInfo: string;
  titleLimit: number;
  highlightLimit: number;
  rowIndex: number;
}

export interface BatchResult {
  rowIndex: number;
  title: string;
  highlight: string;
  success: boolean;
}

export function downloadTemplate(): void {
  const headers: string[] = [
    "Brand",
    "Input Col 1",
    "Input Col 2",
    "Input Col 3",
    "Input Col 4",
    "Input Col 5",
    "Input Col 6",
    "Title Limit",
    "Highlight Limit",
    "Output: Title",
    "Output: Highlight",
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers]);
  ws["!cols"] = headers.map(() => ({ wch: 25 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, "Amazon_Batch_Template.xlsx");
}

export function parseExcel(file: File): Promise<BatchRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length < 2) {
          resolve([]);
          return;
        }

        const rows: BatchRow[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const brand = String(row[0] || "").trim();
          if (!brand) continue;

          // Combine input columns 1-6 (columns 1-6, zero-indexed)
          const inputParts: string[] = [];
          for (let c = 1; c <= 6; c++) {
            const val = row[c];
            if (val !== undefined && val !== null && String(val).trim() !== "") {
              inputParts.push(String(val).trim());
            }
          }
          const productInfo = inputParts.join("\n");

          const titleLimit = parseInt(String(row[7] || "75"), 10) || 75;
          const highlightLimit = parseInt(String(row[8] || "125"), 10) || 125;

          rows.push({
            brand,
            productInfo,
            titleLimit,
            highlightLimit,
            rowIndex: i,
          });
        }

        resolve(rows);
      } catch (err) {
        reject(new Error("Failed to parse Excel: " + (err instanceof Error ? err.message : "Unknown error")));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

export function downloadResult(
  originalFile: File,
  results: BatchResult[]
): void {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Write results to columns 9 and 10 (0-indexed: 9 and 10)
      const resultMap = new Map<number, BatchResult>();
      for (const r of results) {
        resultMap.set(r.rowIndex, r);
      }

      for (let i = 1; i < jsonData.length; i++) {
        const result = resultMap.get(i);
        if (result) {
          jsonData[i][9] = result.title;
          jsonData[i][10] = result.highlight;
        }
      }

      const newSheet = XLSX.utils.aoa_to_sheet(jsonData);
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, newSheet, sheetName);

      const wbout = XLSX.write(newWb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });

      const originalName = originalFile.name.replace(/\.(xlsx|xls)$/i, "");
      const resultName = originalName + "_result.xlsx";
      saveAs(blob, resultName);
    } catch (err) {
      console.error("Failed to write result Excel:", err);
    }
  };

  reader.readAsArrayBuffer(originalFile);
}
