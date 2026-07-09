import { ProductFacts, RankedSellingPoint } from "@/types";
import { filterForbiddenPhrases, cleanCopy } from "@/lib/amazonCompliance";

export function generateHighlight(
  brand: string,
  targetLanguage: string,
  facts: ProductFacts,
  rankedPoints: RankedSellingPoint[],
  highlightMaxLength: number,
  existingTitle: string
): string {
  const titleLower = existingTitle.toLowerCase();

  // Find selling points NOT in the title
  const complementingPoints = rankedPoints.filter(p => {
    const words = p.text.toLowerCase().split(/\s+/);
    const titleWords = new Set(titleLower.split(/\s+/));
    const overlap = words.filter(w => w.length > 3 && titleWords.has(w)).length;
    return overlap < 2;
  });

  // Use the best complementing point
  let highlight = "";
  const source = complementingPoints.length > 0 ? complementingPoints : rankedPoints;

  for (const point of source) {
    const candidate = point.text;
    if (candidate.length <= highlightMaxLength) {
      highlight = candidate;
      break;
    }
  }

  // If no single point fits, construct from multiple smaller elements
  if (!highlight) {
    const extraFacts: string[] = [];
    for (const uc of facts.useCases) {
      if (uc.length < 60 && !titleLower.includes(uc.slice(0, 20).toLowerCase())) {
        extraFacts.push(uc);
      }
    }
    if (extraFacts.length > 0) {
      highlight = extraFacts.join(". ") + ".";
    } else {
      const matPoints = facts.materials.filter(m => m.length < 50 && !titleLower.includes(m.slice(0, 15).toLowerCase()));
      if (matPoints.length > 0) {
        highlight = "Made from " + matPoints[0].toLowerCase() + ".";
      }
    }
  }

  // Ensure within limits
  if (highlight.length > highlightMaxLength) {
    highlight = highlight.slice(0, highlightMaxLength - 3).replace(/\s+\S*$/, "") + "...";
  }

  // Fallback
  if (!highlight || highlight.length < 10) {
    const topFeature = facts.features.length > 0 ? facts.features[0] : "";
    if (topFeature) {
      highlight = topFeature.length > highlightMaxLength
        ? topFeature.slice(0, highlightMaxLength - 3).replace(/\s+\S*$/, "") + "..."
        : topFeature;
    } else {
      highlight = "Quality " + (facts.category || "product") + " designed for your needs.";
    }
  }

  highlight = filterForbiddenPhrases(highlight);
  highlight = cleanCopy(highlight);

  return highlight;
}
