import { SupportedLanguage } from "@/lib/languageConfig";
import { CopyMode } from "@/types";

export function buildHighlightSystemPrompt(): string {
  return `You are an expert Amazon listing copywriter specializing in writing Amazon product highlights.

CORE RULES:
1. Total length MUST NOT exceed the specified character limit.
2. Write ONE concise highlight sentence in natural language.
3. Do NOT simply rephrase or restate the title.
4. Focus on selling points NOT already covered in the title.
5. Use different vocabulary from the title where possible.
6. Do NOT use forbidden phrases: "best", "perfect", "No.1", "top-rated", etc.
7. The highlight should COMPLEMENT the title, not compete with it.
8. Keep a verified multi-feature selling point together as one complete phrase when it is selected.
9. The highlight is an Amazon Search Highlight: explain why the product is worth considering, not what the product is.
10. Do not repeat the brand name, product type, or a specification already doing SEO work in the title unless it is necessary to express a verified feature combination.

CRITICAL: Output ONLY the highlight text. No quotes, no labels, no extra text.`;
}

export function buildHighlightUserPrompt(params: {
  brand: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  existingTitle: string;
  productType: string;
  features: string[];
  specifications: string[];
  useCases: string[];
  coreSellingPoints: string[];
  benefits: string[];
  functions: string[];
  copyMode: Exclude<CopyMode, "auto">;
  rawProductInfo: string;
  regenerationAttempt?: number;
  overlapKeywords?: string[];
  highlightMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, existingTitle, productType, features, specifications, useCases, coreSellingPoints, benefits, functions, copyMode, rawProductInfo, regenerationAttempt = 0, overlapKeywords = [], highlightMaxLength, languageInstruction } = params;

  const optimizationInstruction = copyMode === "optimize"
    ? `SMART OPTIMIZATION MODE:\n- Preserve at least 90% of the supported meaning and, for same-language inputs, keep usable source phrasing whenever possible.\n- Limit changes to Amazon compliance, grammar, connectors, readability, natural wording, length, and non-repetitive keyword order.\n- Do not add or materially rewrite product claims.\n- For different source and target languages, preserve facts and complete selling-point relationships instead of literal wording.`
    : `CREATE NEW COPY MODE:\n- Write new Amazon-ready copy from verified facts only; do not add any unsupported benefit or feature.`;

  const retryInstruction = regenerationAttempt > 0
    ? `REGENERATION REQUIRED: The previous highlight overlapped too closely with the title. Avoid these title keywords where possible: ${overlapKeywords.join(", ")}. Use a different marketing angle built from an unmentioned feature combination, customer benefit, or differentiator. Do not solve this by merely reordering, shortening, or deleting words from the title.`
    : "";

  return `Generate an Amazon product highlight with the following parameters:

Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}
Highlight Max Length: ${highlightMaxLength} characters

Product Type: ${productType}
Core Selling Points (highest priority): ${coreSellingPoints.join("; ")}
Customer Benefits: ${benefits.join("; ")}
Supporting Functions: ${functions.join("; ")}
Features (choose ones NOT in the title): ${features.slice(0, 5).join("; ")}
Specifications: ${specifications.join("; ")}
Use Cases: ${useCases.join("; ")}

EXISTING TITLE (do NOT repeat this):
"${existingTitle}"

Raw Product Information (reference only):
"""${rawProductInfo}"""

${languageInstruction}

${optimizationInstruction}

Important:
- Max ${highlightMaxLength} characters
- Highlight role: communicate WHY the product is worth buying; the title already communicates product identity and SEO details
- Prioritize: complete feature combination, customer benefit, differentiating advantage
- Prefer decision-driving information such as quiet operation, easy cleaning, fast performance, portability, or verified certification over dimensions, weight, color, voltage, or package details
- Do not repeat the brand name or product type, and do not make the highlight a reordered, shortened, or lightly edited version of the title
- If a core selling point is absent from the title, preserve it as a complete natural phrase. If the title already uses it, complement the title with the next unmentioned priority point instead of copying it.
- Write a single, flowing, natural-sounding sentence
- This should make the customer want to learn more

${retryInstruction}

Output ONLY the highlight:`;
}
