import { SupportedLanguage } from "@/lib/languageConfig";
import { CopyMode } from "@/types";

export function buildTitleSystemPrompt(): string {
  return `You are an expert Amazon listing copywriter specializing in writing high-converting, Amazon-compliant product titles.

CORE RULES:
1. The title MUST start with the brand name followed by a space.
2. TOTAL title length MUST NOT exceed the specified character limit.
3. Use natural, fluent language with proper word order.
4. Preferred structure: Brand + Core product keyword + Key spec/capacity + Core feature + Differentiator.
5. Include important keywords naturally - do NOT keyword-stuff.
6. Do NOT repeat the same word more than 2 times.
7. Do NOT use forbidden phrases: "best", "perfect", "No.1", "top-rated", "guaranteed", etc.
8. The title must read like a REAL Amazon product title, not a keyword list.
9. Avoid meaningless scene word padding.
10. Do NOT repeat the product category word unnecessarily.
11. Prioritize a verified core selling point before secondary specifications when space is limited.

CRITICAL: Output ONLY the title text. No quotes, no labels, no extra text.`;
}

export function buildTitleUserPrompt(params: {
  brand: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  productType: string;
  mainKeyword: string;
  features: string[];
  specifications: string[];
  useCases: string[];
  coreSellingPoints: string[];
  copyMode: Exclude<CopyMode, "auto">;
  rawProductInfo: string;
  titleMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, productType, mainKeyword, features, specifications, useCases, coreSellingPoints, copyMode, rawProductInfo, titleMaxLength, languageInstruction } = params;

  const optimizationInstruction = copyMode === "optimize"
    ? `SMART OPTIMIZATION MODE:\n- Treat the raw product information as source copy. Preserve at least 90% of its supported meaning and, where the source and target languages match, retain its usable phrasing wherever possible.\n- Only improve Amazon compliance, grammar, word order, connectors, readability, keyword order, brand placement, and length.\n- Do not invent a new claim or substantially rewrite the supplied copy.\n- If source and target languages differ, preserve the same facts and composite selling-point relationships rather than attempting literal wording preservation.`
    : `CREATE NEW COPY MODE:\n- Create a new Amazon-ready title from the verified analysis. Do not add facts that are absent from the source.`;

  return `Generate an Amazon product title with the following parameters:

Brand: ${brand}
Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}
Title Max Length: ${titleMaxLength} characters (including brand name)

Product Type: ${productType}
Main Keyword: ${mainKeyword}
Core Selling Points (highest priority): ${coreSellingPoints.join("; ")}
Top Features: ${features.slice(0, 5).join("; ")}
Specifications: ${specifications.join("; ")}
Use Cases: ${useCases.join("; ")}

Raw Product Information (reference only):
"""${rawProductInfo}"""

${languageInstruction}

${optimizationInstruction}

Remember:
- Title MUST start with "${brand} "
- Total length MUST be under ${titleMaxLength} characters
- Write in natural ${targetLanguage}
- Include the main keyword naturally
- Use this priority when the available character count allows: Brand, Product Type, Core Selling Point, Important Specification, Usage Scenario
- Preserve a multi-function core selling point as one natural phrase rather than splitting it into keywords
- Make it sound like a real Amazon listing title

Output ONLY the title:`;
}
