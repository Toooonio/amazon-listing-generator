import { ExtractedFacts } from "@/lib/factExtractor";
import { SupportedLanguage } from "@/lib/languageConfig";
import { SellingPointAnalysis } from "@/lib/sellingPointExtractor";
import { CopyMode } from "@/types";

export interface TitleAllocation {
  coreProductKeyword: string;
  positioning: string;
  strongestSellingPoints: string[];
  optionalUsageScenario: string;
  optionalCertification: string;
  optionalWarranty: string;
}

export interface HighlightAllocation {
  uniqueFeature: string;
  supplementaryParameter: string;
  usageExperience: string;
  operationSafetyFeatures: string[];
  usageScenario: string;
}

export interface CopyFrameworkAllocation {
  title: TitleAllocation;
  highlight: HighlightAllocation;
}

interface AllocationPromptParams {
  brand: string;
  rawText: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage: string;
  copyMode: Exclude<CopyMode, "auto">;
  facts: ExtractedFacts;
  sellingPoints: SellingPointAnalysis;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

export function buildInformationAllocationPrompt({
  brand,
  rawText,
  targetLanguage,
  sourceLanguage,
  copyMode,
  facts,
  sellingPoints,
}: AllocationPromptParams): string {
  return `Allocate verified product information into a fixed Amazon Title and Highlight framework.

Brand: ${brand}
Source language: ${sourceLanguage}
Target language: ${targetLanguage}
Copy mode: ${copyMode}

Raw product information:
"""${rawText}"""

Verified facts:
Product type: ${facts.productType}
Main keyword: ${facts.mainKeyword}
Specifications: ${facts.specifications.join("; ")}
Features: ${facts.features.join("; ")}
Use cases: ${facts.useCases.join("; ")}
Certifications: ${facts.certifications.join("; ")}

Selling-point analysis:
Core selling points: ${sellingPoints.coreSellingPoints.join("; ")}
Functions: ${sellingPoints.functions.join("; ")}
Benefits: ${sellingPoints.benefits.join("; ")}
Support: ${sellingPoints.supportInfo.join("; ")}

Return ONLY valid JSON using exactly this structure:
{
  "title": {
    "coreProductKeyword": "",
    "positioning": "",
    "strongestSellingPoints": [],
    "optionalUsageScenario": "",
    "optionalCertification": "",
    "optionalWarranty": ""
  },
  "highlight": {
    "uniqueFeature": "",
    "supplementaryParameter": "",
    "usageExperience": "",
    "operationSafetyFeatures": [],
    "usageScenario": ""
  }
}

ALLOCATION RULES:
- Use only facts supported by the raw product information. Never invent or infer a claim.
- Write each allocated value in natural ${targetLanguage}; this is rewriting for the target Amazon market, not literal translation.
- coreProductKeyword must be a specific Amazon SEO product term such as "Nugget Ice Maker" or "Portable Air Conditioner". Never replace it with generic words such as Machine, Appliance, Equipment, Product, or Device.
- positioning contains only the single most important positioning term, such as Countertop, Portable, Commercial, Compact, Rechargeable, or Windowless.
- strongestSellingPoints contains at most 2 items. Prefer measurable claims such as capacity, speed, coverage, output, or "3-in-1". If no quantified claim exists, use the strongest verified non-quantified feature.
- Title priority is: coreProductKeyword, strongestSellingPoints, positioning, optionalUsageScenario, optionalCertification, optionalWarranty.
- The Highlight must follow this allocation order: uniqueFeature, supplementaryParameter, usageExperience, operationSafetyFeatures, usageScenario.
- supplementaryParameter must not repeat any item allocated to title.strongestSellingPoints.
- A major claim must be emphasized in only one module. Title identifies the product; Highlight explains why it is worth buying.
- Keep related functions together when they form one proposition. Remote Control + Sleep Mode + 24H Timer should remain a coherent combination, not unrelated keywords.
- operationSafetyFeatures may contain at most 3 closely related verified functions.
- Prefer buying-decision information for Highlight. Avoid color, voltage, weight, dimensions, and packaging unless the user explicitly emphasizes them.
- In Smart Optimization mode, preserve every supplied core selling point and its factual meaning while improving allocation. Do not add or discard a core claim.
- Use an empty string or empty array when a slot is unsupported.`;
}

export function createFallbackAllocation(
  facts: ExtractedFacts,
  sellingPoints: SellingPointAnalysis
): CopyFrameworkAllocation {
  const titleSellingPoints = facts.specifications.length > 0
    ? facts.specifications.slice(0, 2)
    : sellingPoints.coreSellingPoints.slice(0, 2);
  const usedTitlePoints = new Set(titleSellingPoints.map((item) => item.toLowerCase()));
  const supplementaryParameter = facts.specifications.find(
    (item) => !usedTitlePoints.has(item.toLowerCase())
  ) || "";

  return {
    title: {
      coreProductKeyword: facts.mainKeyword || facts.productType,
      positioning: "",
      strongestSellingPoints: titleSellingPoints,
      optionalUsageScenario: facts.useCases[0] || "",
      optionalCertification: facts.certifications[0] || "",
      optionalWarranty: sellingPoints.supportInfo[0] || "",
    },
    highlight: {
      uniqueFeature: sellingPoints.coreSellingPoints.find(
        (item) => !usedTitlePoints.has(item.toLowerCase())
      ) || sellingPoints.functions[0] || "",
      supplementaryParameter,
      usageExperience: sellingPoints.benefits[0] || "",
      operationSafetyFeatures: sellingPoints.functions.slice(0, 3),
      usageScenario: sellingPoints.useCases[0] || facts.useCases[0] || "",
    },
  };
}

export function normalizeCopyFrameworkAllocation(
  value: unknown,
  fallback: CopyFrameworkAllocation
): CopyFrameworkAllocation {
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as {
    title?: Record<string, unknown>;
    highlight?: Record<string, unknown>;
  };
  const title = candidate.title || {};
  const highlight = candidate.highlight || {};
  const genericKeywords = new Set(["machine", "appliance", "equipment", "product", "device"]);
  const keywordCandidate = stringValue(title.coreProductKeyword);
  const coreProductKeyword = keywordCandidate && !genericKeywords.has(keywordCandidate.toLowerCase())
    ? keywordCandidate
    : fallback.title.coreProductKeyword;
  const allocatedTitlePoints = stringArray(title.strongestSellingPoints, 2);
  const strongestSellingPoints = allocatedTitlePoints.length > 0
    ? allocatedTitlePoints
    : fallback.title.strongestSellingPoints;
  const titlePointSet = new Set(strongestSellingPoints.map((item) => item.toLowerCase()));
  const allocatedUniqueFeature = stringValue(highlight.uniqueFeature);
  const uniqueFeatureCandidates = [
    allocatedUniqueFeature,
    fallback.highlight.uniqueFeature,
    ...fallback.highlight.operationSafetyFeatures,
  ];
  const uniqueFeature = uniqueFeatureCandidates.find(
    (item) => item && !titlePointSet.has(item.toLowerCase())
  ) || "";
  const allocatedSupplementary = stringValue(highlight.supplementaryParameter);
  const supplementaryParameter = allocatedSupplementary && !titlePointSet.has(allocatedSupplementary.toLowerCase())
    ? allocatedSupplementary
    : fallback.highlight.supplementaryParameter;
  const operationSafetyFeatures = stringArray(highlight.operationSafetyFeatures, 3)
    .filter((item) => !titlePointSet.has(item.toLowerCase()));

  return {
    title: {
      coreProductKeyword,
      positioning: stringValue(title.positioning),
      strongestSellingPoints,
      optionalUsageScenario: stringValue(title.optionalUsageScenario),
      optionalCertification: stringValue(title.optionalCertification),
      optionalWarranty: stringValue(title.optionalWarranty),
    },
    highlight: {
      uniqueFeature,
      supplementaryParameter: titlePointSet.has(supplementaryParameter.toLowerCase())
        ? ""
        : supplementaryParameter,
      usageExperience: stringValue(highlight.usageExperience),
      operationSafetyFeatures: operationSafetyFeatures.length > 0
        ? operationSafetyFeatures
        : fallback.highlight.operationSafetyFeatures.filter(
          (item) => !titlePointSet.has(item.toLowerCase())
        ).slice(0, 3),
      usageScenario: stringValue(highlight.usageScenario),
    },
  };
}
