import { SupportedLanguage } from "@/lib/languageConfig";
import { TitleAllocation } from "@/lib/copyFramework";
import { CopyMode } from "@/types";

export function buildTitleSystemPrompt(): string {
  return `You are an expert Amazon title formatter. You fill a fixed framework; you do not freely invent copy.

CORE RULES:
1. The title MUST start with the brand name followed by a space.
2. TOTAL title length MUST NOT exceed the specified character limit.
3. Use natural, fluent language with proper word order.
4. Required framework: Brand + Core Product Keyword + Product Positioning + 1-2 Strongest Selling Points.
5. Keep the Core Product Keyword specific and SEO-ready. Never replace it with Machine, Appliance, Equipment, Product, or Device.
6. Do NOT repeat the same word more than 2 times.
7. Do NOT use forbidden phrases: "best", "perfect", "No.1", "top-rated", "guaranteed", etc.
8. The title must read like a REAL Amazon product title, not a keyword list.
9. Use only the allocated facts. Do not add a feature, parameter, material, certification, use case, or warranty.
10. Include no more than 2 strongest selling points and prefer quantified claims.
11. If space is insufficient, remove fields in this order: Warranty, Certification, Usage Scenario, Product Positioning. Never remove the Brand, Core Product Keyword, or strongest available quantified selling point.

CRITICAL: Output ONLY the title text. No quotes, no labels, no extra text.`;
}

export function buildTitleUserPrompt(params: {
  brand: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  allocation: TitleAllocation;
  copyMode: Exclude<CopyMode, "auto">;
  rawProductInfo: string;
  titleMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, allocation, copyMode, rawProductInfo, titleMaxLength, languageInstruction } = params;

  const optimizationInstruction = copyMode === "optimize"
    ? `SMART OPTIMIZATION MODE:\n- Preserve the source's core claims and usable wording where source and target languages match.\n- Improve only structure, SEO order, grammar, readability, compliance, and length.\n- Do not add, remove, or materially change a core selling point.`
    : `CREATE NEW COPY MODE:\n- Fill the fixed framework with the allocated facts only. Do not introduce outside claims.`;

  return `Generate an Amazon product title with the following parameters:

Brand: ${brand}
Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}
Title Max Length: ${titleMaxLength} characters (including brand name)

FIXED TITLE SLOTS:
1. Brand: ${brand}
2. Core Product Keyword: ${allocation.coreProductKeyword}
3. Product Positioning: ${allocation.positioning}
4. Strongest Selling Points (maximum 2): ${allocation.strongestSellingPoints.join("; ")}

LOW-PRIORITY OPTIONAL SLOTS, use only when all required slots fit naturally:
5. Usage Scenario: ${allocation.optionalUsageScenario}
6. Certification: ${allocation.optionalCertification}
7. Warranty: ${allocation.optionalWarranty}

Raw Product Information (reference only):
"""${rawProductInfo}"""

${languageInstruction}

${optimizationInstruction}

Remember:
- Title MUST start with "${brand} "
- Total length MUST be under ${titleMaxLength} characters
- Write in natural ${targetLanguage}
- Follow the allocated slot order; do not choose replacement facts from the raw information
- Use at most 2 items from Strongest Selling Points
- Avoid duplicating a positioning word already contained in the Core Product Keyword
- Make the fixed framework read as one natural Amazon title

Output ONLY the title:`;
}
