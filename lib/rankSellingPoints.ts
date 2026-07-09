import { ProductFacts, RankedSellingPoint } from "@/types";

export function rankSellingPoints(facts: ProductFacts, style: string = "balanced"): RankedSellingPoint[] {
  const points: RankedSellingPoint[] = [];

  if (facts.category) {
    points.push({ text: facts.category, priority: 1 });
  }

  for (const cap of facts.capacities) {
    points.push({ text: cap, priority: 1 });
  }

  for (const feat of facts.features) {
    const isMeasurable = /\d/.test(feat);
    points.push({ text: feat, priority: isMeasurable ? 2 : 3 });
  }

  for (const uc of facts.useCases) {
    points.push({ text: uc, priority: 3 });
  }

  for (const mat of facts.materials) {
    points.push({ text: mat, priority: 4 });
  }

  for (const cert of facts.certifications) {
    points.push({ text: cert, priority: 4 });
  }

  for (const acc of facts.accessories) {
    points.push({ text: acc, priority: 5 });
  }

  for (const sup of facts.supportInfo) {
    points.push({ text: sup, priority: 5 });
  }

  points.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.text.length - b.text.length;
  });

  if (style === "seo") {
    return promoteKeywordDense(points);
  }
  if (style === "conversion") {
    return promoteBenefitOriented(points);
  }

  return points;
}

function promoteKeywordDense(points: RankedSellingPoint[]): RankedSellingPoint[] {
  return points.sort((a, b) => {
    const wordDensityA = countKeyTerms(a.text);
    const wordDensityB = countKeyTerms(b.text);
    if (wordDensityA !== wordDensityB) return wordDensityB - wordDensityA;
    return a.text.length - b.text.length;
  });
}

function promoteBenefitOriented(points: RankedSellingPoint[]): RankedSellingPoint[] {
  return points.sort((a, b) => {
    const benefitA = hasBenefitWords(a.text) ? 1 : 0;
    const benefitB = hasBenefitWords(b.text) ? 1 : 0;
    if (benefitA !== benefitB) return benefitB - benefitA;
    return a.priority - b.priority;
  });
}

function countKeyTerms(text: string): number {
  const keyTerms = [
    /\b(?:capacity|size|weight|power|speed|volume|temperature|efficiency|output|production)\b/gi,
    /\b\d+\s*(?:lbs|oz|kg|g|inches|cm|L|ml|W|V|dB)\b/g,
  ];
  let count = 0;
  for (const pattern of keyTerms) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

function hasBenefitWords(text: string): boolean {
  const benefitWords = [
    "easy", "fast", "quiet", "safe", "convenient", "portable", "compact",
    "durable", "versatile", "efficient", "effective", "simple", "quick",
    "smooth", "clean", "fresh", "enjoy", "save", "reduce",
    "eliminate", "prevent", "protect",
  ];
  const lower = text.toLowerCase();
  return benefitWords.some((w) => lower.includes(w));
}
