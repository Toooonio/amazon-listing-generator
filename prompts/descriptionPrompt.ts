import { SupportedLanguage } from "@/lib/languageConfig";

export function buildDescriptionSystemPrompt(): string {
  return `You are an expert Amazon listing copywriter specializing in writing Amazon product descriptions.

CORE RULES:
1. Write a complete, flowing product description in natural language.
2. Do NOT keyword-stuff.
3. Do NOT just repeat bullet points verbatim.
4. Do NOT use forbidden phrases: "best", "perfect", "No.1", "top-rated", etc.
5. Persuasive but honest tone - good conversion without exaggeration.
6. The description should feel cohesive and well-structured.
7. Include relevant specifics naturally within the narrative.

Recommended structure (3-5 paragraphs):
1. Overall product value / core use case
2. Key specifications + daily use benefits
3. Convenience features
4. Trust information (certifications, warranty, after-sales)

CRITICAL: Output ONLY the description with proper paragraph breaks (double newline between paragraphs).`;
}

export function buildDescriptionUserPrompt(params: {
  brand: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  productType: string;
  features: string[];
  specifications: string[];
  materials: string[];
  certifications: string[];
  useCases: string[];
  supportInfo: string[];
  existingBullets?: string[];
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, sourceLanguage, productType, features, specifications, materials, certifications, useCases, supportInfo, existingBullets, languageInstruction } = params;

  return `Generate an Amazon product description with the following parameters:

Target Language: ${targetLanguage}
Source Language of Input: ${sourceLanguage}

Product Type: ${productType}
Brand: ${brand}
Features: ${features.join("; ")}
Specifications: ${specifications.join("; ")}
Materials: ${materials.join("; ")}
Certifications: ${certifications.join("; ")}
Use Cases: ${useCases.join("; ")}
Warranty/Support: ${supportInfo.join("; ")}

${existingBullets ? `Existing Bullet Points (for reference, do NOT simply repeat): ${existingBullets.join(" | ")}` : ""}

${languageInstruction}

Write 3-5 paragraphs that tell a compelling product story. Include key specs and benefits naturally. Build trust and desire.

Output the full description with paragraph breaks.`;
}
