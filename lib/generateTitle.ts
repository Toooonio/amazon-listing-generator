import { ProductFacts, RankedSellingPoint } from "@/types";
import { filterForbiddenPhrases, cleanCopy } from "@/lib/amazonCompliance";

export function generateTitle(
  brand: string,
  targetLanguage: string,
  facts: ProductFacts,
  rankedPoints: RankedSellingPoint[],
  titleMaxLength: number,
  existingHighlights?: string
): string {
  const brandPart = brand.trim() + " ";
  const remainingSpace = titleMaxLength - brandPart.length;

  if (remainingSpace <= 5) {
    return brandPart.slice(0, titleMaxLength);
  }

  let titleCore = "";

  // Priority order for title content
  const titleElements: string[] = [];

  // 1. Core product keyword
  if (facts.category) {
    const categoryWords = facts.category.split(/\s+/);
    const cleanCategory = categoryWords.slice(0, 3).join(" ");
    titleElements.push(cleanCategory);
  } else {
    const topProductWord = rankedPoints.find(p => p.priority === 1);
    if (topProductWord) {
      titleElements.push(topProductWord.text.split(/\s+/).slice(0, 3).join(" "));
    }
  }

  // 2. Key measurable spec (capacity, etc.)
  if (facts.capacities.length > 0) {
    const topCap = facts.capacities[0];
    if (titleCore.length + topCap.length < remainingSpace - 10) {
      titleElements.push(topCap);
    }
  }

  // 3. Top features (pick 1-2 most important)
  const importantFeatures = facts.features.filter(f => {
    const lower = f.toLowerCase();
    return !lower.includes("warranty") && !lower.includes("certified");
  }).slice(0, 3);

  for (const feat of importantFeatures) {
    const shortFeat = feat.length > 30 ? feat.slice(0, 30).replace(/\s+\S*$/, "") : feat;
    const candidate = titleElements.join(" ") + " " + shortFeat;
    if (candidate.length <= remainingSpace) {
      titleElements.push(shortFeat);
    }
  }

  // 4. Differentiator from ranked points not yet used
  for (const point of rankedPoints) {
    const shortPoint = point.text.length > 25 ? point.text.slice(0, 25).replace(/\s+\S*$/, "") : point.text;
    const candidate = [...titleElements, shortPoint].join(" ");
    if (candidate.length <= remainingSpace && !titleElements.some(e => shortPoint.includes(e.slice(0, 10)))) {
      titleElements.push(shortPoint);
    }
  }

  titleCore = titleElements.join(" ");

  // Build final title
  let title = brandPart + titleCore;

  // Truncate if still too long
  if (title.length > titleMaxLength) {
    const maxCore = remainingSpace - 3;
    titleCore = titleCore.slice(0, maxCore).replace(/\s+\S*$/, "");
    title = brandPart + titleCore;
  }

  // Apply compliance
  title = filterForbiddenPhrases(title);
  title = cleanCopy(title);

  return title;
}
