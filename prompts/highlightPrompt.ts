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

CRITICAL: Output ONLY the highlight text. No quotes, no labels, no extra text.`;
}

export function buildHighlightUserPrompt(params: {
  brand: string;
  targetLanguage: string;
  existingTitle: string;
  productType: string;
  features: string[];
  specifications: string[];
  useCases: string[];
  highlightMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, existingTitle, productType, features, specifications, useCases, highlightMaxLength, languageInstruction } = params;

  return `Generate an Amazon product highlight with the following parameters:

Target Language: ${targetLanguage}
Highlight Max Length: ${highlightMaxLength} characters

Product Type: ${productType}
Features (choose ones NOT in the title): ${features.slice(0, 5).join("; ")}
Specifications: ${specifications.join("; ")}
Use Cases: ${useCases.join("; ")}

EXISTING TITLE (do NOT repeat this):
"${existingTitle}"

${languageInstruction}

Important:
- Max ${highlightMaxLength} characters
- Pick features or benefits NOT mentioned in the title above
- Write a single, flowing, natural-sounding sentence
- This should make the customer want to learn more

Output ONLY the highlight:`;
}
