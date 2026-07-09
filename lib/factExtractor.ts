export interface ExtractedFacts {
  productType: string;
  mainKeyword: string;
  features: string[];
  specifications: string[];
  materials: string[];
  certifications: string[];
  useCases: string[];
  targetCustomer: string[];
}

export function buildExtractionPrompt(rawText: string, detectedLanguage: string): string {
  return `Extract structured product information from the text below.

Input text:
"""${rawText}"""

Return a JSON object with EXACTLY these fields:
{
  "productType": "the core product category (e.g. Nugget Ice Maker, Blender, Pet Bed)",
  "mainKeyword": "the single most important search keyword for Amazon",
  "features": ["list", "of", "key", "features"],
  "specifications": ["measurable specs like capacity, dimensions, power, weight"],
  "materials": ["materials used"],
  "certifications": ["certifications like ETL, FCC, CE, RoHS"],
  "useCases": ["usage scenarios like home, office, travel"],
  "targetCustomer": ["target audience descriptions"]
}

Rules:
- Only include information that is explicitly stated or directly implied in the text.
- Do not fabricate or guess details.
- If a field has no relevant information, return an empty array [].
- The input language is: ${detectedLanguage}
- Output JSON only, no markdown, no extra text.`;
}

export function extractFactsWithAI(
  rawText: string,
  brand: string,
  detectedLanguage: string
): ExtractedFacts {
  // Client-side placeholder - actual AI extraction happens server-side
  // This function signature is kept for compatibility
  return {
    productType: "",
    mainKeyword: "",
    features: [],
    specifications: [],
    materials: [],
    certifications: [],
    useCases: [],
    targetCustomer: [],
  };
}
