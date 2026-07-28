import { SupportedLanguage } from "@/lib/languageConfig";
import { HighlightAllocation } from "@/lib/copyFramework";
import { CopyMode } from "@/types";

export function buildHighlightSystemPrompt(): string {
  return `You are an expert Amazon Search Highlight formatter. You fill a fixed marketing framework; you do not freely select facts.

CORE RULES:
1. Total length MUST NOT exceed the specified character limit.
2. Write ONE concise highlight sentence in natural language.
3. Required framework: Unique Feature + Supplementary Parameter + Usage Experience + Operation/Safety Feature + Usage Scenario.
4. Do NOT simply rephrase, reorder, shorten, or restate the title.
5. Use only the allocated facts and preserve a feature combination as one coherent proposition.
6. Do NOT use forbidden phrases: "best", "perfect", "No.1", "top-rated", etc.
7. The highlight should COMPLEMENT the title, not compete with it.
8. The Highlight explains WHY the product is worth buying; the Title already explains WHAT it is.
9. Do not repeat the brand name, product name, core product keyword, or the Title's main parameter.
10. When space is limited, preserve content in this order: Unique Feature, Usage Experience, Operation/Safety Feature, Supplementary Parameter, Usage Scenario.

CRITICAL: Output ONLY the highlight text. No quotes, no labels, no extra text.`;
}

export function buildHighlightUserPrompt(params: {
  brand: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  existingTitle: string;
  allocation: HighlightAllocation;
  copyMode: Exclude<CopyMode, "auto">;
  rawProductInfo: string;
  regenerationAttempt?: number;
  overlapKeywords?: string[];
  highlightMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, existingTitle, allocation, copyMode, rawProductInfo, regenerationAttempt = 0, overlapKeywords = [], highlightMaxLength, languageInstruction } = params;

  const optimizationInstruction = copyMode === "optimize"
    ? `SMART OPTIMIZATION MODE:\n- Preserve the allocated source claims and usable wording where source and target languages match.\n- Improve only marketing structure, grammar, connectors, readability, compliance, and length.\n- Do not add, remove, or materially change a core selling point.`
    : `CREATE NEW COPY MODE:\n- Fill the fixed framework with the allocated facts only. Do not introduce an unsupported benefit or feature.`;

  const retryInstruction = regenerationAttempt > 0
    ? `REGENERATION REQUIRED: The previous highlight overlapped too closely with the title. Avoid these title keywords where possible: ${overlapKeywords.join(", ")}. Use a different marketing angle built from an unmentioned feature combination, customer benefit, or differentiator. Do not solve this by merely reordering, shortening, or deleting words from the title.`
    : "";

  return `Generate an Amazon product highlight with the following parameters:

Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}
Highlight Max Length: ${highlightMaxLength} characters

FIXED HIGHLIGHT SLOTS:
1. Unique Feature: ${allocation.uniqueFeature}
2. Supplementary Parameter: ${allocation.supplementaryParameter}
3. Usage Experience: ${allocation.usageExperience}
4. Operation / Safety Features: ${allocation.operationSafetyFeatures.join("; ")}
5. Usage Scenario: ${allocation.usageScenario}

EXISTING TITLE (do NOT repeat this):
"${existingTitle}"

Raw Product Information (reference only):
"""${rawProductInfo}"""

${languageInstruction}

${optimizationInstruction}

Important:
- Max ${highlightMaxLength} characters
- Follow the allocated slot order and omit empty slots; do not choose replacement facts from the raw information
- Start with the Unique Feature, not the brand or product name
- Connect related functions naturally, for example "with Remote Control, Sleep Mode & 24H Timer"
- The Supplementary Parameter must provide new information not already emphasized in the Title
- Communicate a buying reason through the Usage Experience, not a list of attributes
- Do not repeat "${brand}" or turn the Highlight into a reordered or shortened Title
- Keep every selected feature name and clause complete. If the limit is tight, omit the lowest-priority slot entirely instead of leaving a dangling connector or incomplete compound phrase
- Write a single, flowing, natural-sounding sentence
- Keep it fast to scan and marketing-oriented

${retryInstruction}

Output ONLY the highlight:`;
}
