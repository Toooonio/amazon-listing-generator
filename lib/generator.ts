import { OutputMode, CopyMode, AdvancedSettings, GenerateApiResponse } from "@/types";
import { validateInput } from "@/lib/validators";

export interface GenerateRequest {
  rawText: string;
  brand: string;
  targetLanguage: string;
  mode: OutputMode;
  copyMode?: CopyMode;
  settings: AdvancedSettings;
}

export interface GenerateResult {
  output: GenerateApiResponse;
  warnings: string[];
  validationErrors: string[];
  complianceWarnings: string[];
}

export async function generateAmazonCopy(
  request: GenerateRequest
): Promise<GenerateResult> {
  const { rawText, brand, targetLanguage, mode, copyMode = "auto", settings } = request;

  const inputValidation = validateInput(rawText, brand);
  if (!inputValidation.valid) {
    return {
      output: {
        title: { original: "", zh: "" },
        highlight: { original: "", zh: "" },
        bullets: [],
        description: { original: "", zh: "" },
        meta: { sourceLanguage: "", targetLanguage: "" },
      },
      warnings: inputValidation.errors,
      validationErrors: inputValidation.errors,
      complianceWarnings: [],
    };
  }

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: brand.trim(),
        language: targetLanguage,
        mode,
        copyMode,
        productInfo: rawText,
        settings: {
          titleMaxLength: settings.titleMaxLength,
          highlightMaxLength: settings.highlightMaxLength,
          writingStyle: settings.writingStyle,
          strictDedupe: settings.strictDedupe,
          amazonCompliance: settings.amazonCompliance,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        output: {
          title: { original: "", zh: "" },
          highlight: { original: "", zh: "" },
          bullets: [],
          description: { original: "", zh: "" },
          meta: { sourceLanguage: "", targetLanguage: "" },
        },
        warnings: [errorData.error || "API request failed with status " + response.status],
        validationErrors: [],
        complianceWarnings: [],
      };
    }

    const data: GenerateApiResponse = await response.json();

    return {
      output: data,
      warnings: data.warnings || [],
      validationErrors: [],
      complianceWarnings: data.complianceWarnings || [],
    };
  } catch (err) {
    return {
      output: {
        title: { original: "", zh: "" },
        highlight: { original: "", zh: "" },
        bullets: [],
        description: { original: "", zh: "" },
        meta: { sourceLanguage: "", targetLanguage: "" },
      },
      warnings: ["Network error: " + (err instanceof Error ? err.message : "Failed to connect to API")],
      validationErrors: [],
      complianceWarnings: [],
    };
  }
}
