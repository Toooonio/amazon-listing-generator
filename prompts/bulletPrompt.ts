import { SupportedLanguage } from "@/lib/languageConfig";

export function buildBulletsSystemPrompt(): string {
  return `You are an expert Amazon listing copywriter specializing in writing Amazon bullet points (key features).

CORE RULES:
1. Output exactly 5 bullet points.
2. Each bullet must focus on a DIFFERENT selling angle.
3. Lead with customer benefit, then support with specs/parameters.
4. Format: SHORT CAPITALIZED OPENER (2-4 words) + benefit explanation.
5. Write in natural language for the target market.
6. Do NOT keyword-stuff.
7. Do NOT use forbidden phrases: "best", "perfect", "No.1", "top-rated", etc.
8. Each bullet should sound like a real Amazon listing bullet point.

Recommended coverage:
1. Core performance / capacity / output
2. User experience / key feature benefit
3. Design / portability / convenience
4. Smart features / cleaning / maintenance
5. Quality / certifications / warranty / peace of mind

CRITICAL: Output 5 lines, each line is one bullet point. No numbers, no bullet symbols, just the text.`;
}

export function buildBulletsUserPrompt(params: {
  brand: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  productType: string;
  features: string[];
  specifications: string[];
  materials: string[];
  certifications: string[];
  useCases: string[];
  existingTitle?: string;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, productType, features, specifications, materials, certifications, useCases, existingTitle, languageInstruction } = params;

  return `Generate 5 Amazon bullet points with the following parameters:

Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}

Product Type: ${productType}
Features: ${features.join("; ")}
Specifications: ${specifications.join("; ")}
Materials: ${materials.join("; ")}
Certifications: ${certifications.join("; ")}
Use Cases: ${useCases.join("; ")}

${existingTitle ? `Existing Title (for reference, avoid repeating its content): "${existingTitle}"` : ""}

${languageInstruction}

Create 5 bullet points that cover different angles:
1. Core performance or capacity
2. User experience or key feature
3. Design and convenience
4. Smart feature or easy maintenance
5. Trust, quality, or peace of mind

Output each bullet on its own line.`;
}
