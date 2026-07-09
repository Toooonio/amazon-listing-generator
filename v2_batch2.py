import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

def w(fname, content):
    path = os.path.join(base, fname)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {fname}")

# 1. prompts/titlePrompt.ts
w("prompts/titlePrompt.ts", """export function buildTitleSystemPrompt(): string {
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
  targetLanguage: string;
  productType: string;
  mainKeyword: string;
  features: string[];
  specifications: string[];
  useCases: string[];
  titleMaxLength: number;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, productType, mainKeyword, features, specifications, useCases, titleMaxLength, languageInstruction } = params;

  return `Generate an Amazon product title with the following parameters:

Brand: ${brand}
Target Language: ${targetLanguage}
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
""")

# 2. prompts/highlightPrompt.ts
w("prompts/highlightPrompt.ts", """export function buildHighlightSystemPrompt(): string {
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
""")

# 3. prompts/bulletPrompt.ts
w("prompts/bulletPrompt.ts", """export function buildBulletsSystemPrompt(): string {
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
  targetLanguage: string;
  productType: string;
  features: string[];
  specifications: string[];
  materials: string[];
  certifications: string[];
  useCases: string[];
  existingTitle?: string;
  languageInstruction: string;
}): string {
  const { brand, targetLanguage, productType, features, specifications, materials, certifications, useCases, existingTitle, languageInstruction } = params;

  return `Generate 5 Amazon bullet points with the following parameters:

Target Language: ${targetLanguage}

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
""")

# 4. prompts/descriptionPrompt.ts
w("prompts/descriptionPrompt.ts", """export function buildDescriptionSystemPrompt(): string {
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
  targetLanguage: string;
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
  const { brand, targetLanguage, productType, features, specifications, materials, certifications, useCases, supportInfo, existingBullets, languageInstruction } = params;

  return `Generate an Amazon product description with the following parameters:

Target Language: ${targetLanguage}

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
""")

print("Batch 2 complete: All 4 prompt files created")
