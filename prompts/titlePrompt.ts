import { SupportedLanguage } from "@/lib/languageConfig";

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
  titleMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, productType, mainKeyword, features, specifications, useCases, titleMaxLength, languageInstruction } = params;

  return `Generate an Amazon product title with the following parameters:

Brand: ${brand}
Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}
Title Max Length: ${titleMaxLength} characters (including brand name)

Product Type: ${productType}
Main Keyword: ${mainKeyword}
Top Features: ${features.slice(0, 5).join("; ")}
Specifications: ${specifications.join("; ")}
Use Cases: ${useCases.join("; ")}

${languageInstruction}

Remember:
- Title MUST start with "${brand} "
- Total length MUST be under ${titleMaxLength} characters
- Write in natural ${targetLanguage}
- Include the main keyword naturally
- Pick the most important specification and feature to include
- Make it sound like a real Amazon listing title

Output ONLY the title:`;
}
