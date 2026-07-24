import { ExtractedFacts } from "@/lib/factExtractor";

export interface SellingPointAnalysis {
  brand: string;
  productType: string;
  specifications: string[];
  coreSellingPoints: string[];
  functions: string[];
  benefits: string[];
  useCases: string[];
  certifications: string[];
  supportInfo: string[];
}

interface SellingPointPromptParams {
  brand: string;
  rawText: string;
  sourceLanguage: string;
  facts: ExtractedFacts;
}

export function buildSellingPointExtractionPrompt({
  brand,
  rawText,
  sourceLanguage,
  facts,
}: SellingPointPromptParams): string {
  return `Analyze the raw product information below for an Amazon listing copywriter.

Brand supplied by the user: ${brand}
Detected input language: ${sourceLanguage}

Raw product information:
"""${rawText}"""

Existing fact extraction for reference:
Product type: ${facts.productType}
Specifications: ${facts.specifications.join("; ")}
Features: ${facts.features.join("; ")}
Use cases: ${facts.useCases.join("; ")}
Certifications: ${facts.certifications.join("; ")}

Return ONLY valid JSON using exactly this shape:
{
  "brand": "",
  "productType": "",
  "specifications": [],
  "coreSellingPoints": [],
  "functions": [],
  "benefits": [],
  "useCases": [],
  "certifications": [],
  "supportInfo": []
}

Rules:
- Brand must match the user-supplied brand when it is present. Do not infer a different brand from reference copy.
- Include only claims explicitly supported by the raw product information.
- CoreSellingPoints are the highest-priority differentiators for a shopper, not a list of generic keywords.
- Keep related features that form one shopper-facing proposition as ONE complete coreSellingPoint. For example, "3-in-1 Portable AC with Remote Control, Sleep Mode & 24H Timer" must remain one item. Do not split it into separate remote, sleep mode, and timer entries.
- Put standalone capabilities in functions and shopper outcomes in benefits.
- Do not infer a certification, warranty, material, feature, or performance claim that is not supplied.
- Return empty arrays when the source does not support a category.`;
}

export function emptySellingPointAnalysis(facts: ExtractedFacts, brand: string): SellingPointAnalysis {
  return {
    brand,
    productType: facts.productType,
    specifications: facts.specifications,
    coreSellingPoints: facts.features.slice(0, 3),
    functions: facts.features,
    benefits: [],
    useCases: facts.useCases,
    certifications: facts.certifications,
    supportInfo: [],
  };
}
