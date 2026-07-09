import { ProductFacts, RankedSellingPoint, GeneratedOutput, OutputMode, AdvancedSettings } from "@/types";
import { extractFacts } from "@/lib/extractFacts";
import { detectLanguage } from "@/lib/language";
import { validateInput } from "@/lib/validators";

export interface GenerateRequest {
  rawText: string;
  brand: string;
  targetLanguage: string;
  mode: OutputMode;
  settings: AdvancedSettings;
}

export interface GenerateResult {
  output: GeneratedOutput;
  warnings: string[];
  validationErrors: string[];
  complianceWarnings: string[];
}

export async function generateAmazonCopy(request: GenerateRequest): Promise<GenerateResult> {
  const { rawText, brand, targetLanguage, mode, settings } = request;

  // Validate input first
  const inputValidation = validateInput(rawText, brand);
  if (!inputValidation.valid) {
    return {
      output: {},
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
        output: {},
        warnings: [errorData.error || "API request failed with status " + response.status],
        validationErrors: [],
        complianceWarnings: [],
      };
    }

    const data = await response.json();

    const output: GeneratedOutput = {
      title: data.title,
      highlights: data.highlights,
      bullets: data.bullets,
      description: data.description,
    };

    return {
      output,
      warnings: data.warnings || [],
      validationErrors: [],
      complianceWarnings: data.complianceWarnings || [],
    };
  } catch (err) {
    return {
      output: {},
      warnings: ["Network error: " + (err instanceof Error ? err.message : "Failed to connect to API")],
      validationErrors: [],
      complianceWarnings: [],
    };
  }

  return {
    output: {},
    warnings: [],
    validationErrors: [],
    complianceWarnings: [],
  };
}
