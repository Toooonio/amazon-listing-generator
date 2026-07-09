import { ProductFacts } from "@/types";

export function extractFacts(
  rawText: string,
  brand: string,
  detectedLanguage: string
): ProductFacts {
  const facts: ProductFacts = {
    brand,
    category: extractCategory(rawText),
    languageDetected: detectedLanguage,
    capacities: extractWithPatterns(rawText, capacityPatterns),
    dimensions: extractWithPatterns(rawText, dimensionPatterns),
    materials: extractWithPatterns(rawText, materialPatterns),
    features: extractFeatures(rawText),
    certifications: extractWithPatterns(rawText, certificationPatterns),
    accessories: extractWithPatterns(rawText, accessoryPatterns),
    useCases: extractUseCases(rawText),
    supportInfo: extractSupportInfo(rawText),
    notes: [rawText.trim()],
  };
  return facts;
}

const capacityPatterns = [
  /\b\d+\s*(lbs|pounds|kg|kilograms|oz|ounces|gallons|liters|litres|cups|quarts|pints|ml|cl|fl\s*oz)\b/gi,
  /\b\d+\s*(cu\s*ft|cubic\s*(feet|inches))\b/gi,
  /\b\d+\s*[Xx]\s*\d+\s*(lbs|pounds|kg)?\b/g,
  /\b\d+\s*-\s*\d+\s*(lbs|pounds|kg)\s*per\s*(day|hour|cycle|batch)\b/gi,
];

const dimensionPatterns = [
  /\b\d+\.?\d*\s*[Xx×]\s*\d+\.?\d*\s*[Xx×]\s*\d+\.?\d*\s*(inches|inch|in|cm|mm)?\b/g,
  /\b\d+\.?\d*\s*(inches|inch|in|cm|mm|feet|ft|meters|m)\s*(long|wide|tall|high|deep|length|width|height)?/gi,
  /\b(L|W|H|Diameter|Dia)[:\s]*\d+\.?\d*\s*(inches|inch|in|cm|mm)?/gi,
];

const materialPatterns = [
  /\b(plastic|stainless\s*steel|aluminum|glass|ceramic|wood|bamboo|silicone|rubber|cotton|polyester|nylon|leather|carbon\s*fiber|iron|copper|brass|ABS|PP|PC|PET|TPR)\b/gi,
  /\b(BPA-free|food-grade|food\s*safe|dishwasher\s*safe|microwave\s*safe|non-toxic|eco-friendly|biodegradable|recyclable)\b/gi,
];

const certificationPatterns = [
  /\b(CE|FCC|RoHS|UL|ETL|FDA|USDA|Organic|ISO\s*\d+|NSF|ENERGY\s*STAR|cTUVus|PSE|KC|CCC|SAA|GS|UKCA)\b/gi,
  /\b(CE|ETL|FCC|RoHS)\s*(certified|certification|listed|approved|compliant)\b/gi,
  /\b(\d+[-–]year\s*warranty|\d+[-–]year\s*replacement|lifetime\s*warranty|warranty)\b/gi,
];

const accessoryPatterns = [
  /\bincludes?\s+(?:a\s+|an\s+)?([^,.]+)/gi,
  /\b(?:comes\s+with|package\s+includes|packaged\s+with|accessories\s+include)\s+([^,.]+(?:,\s*[^,.]+)*)/gi,
  /\b(ice\s*scoop|basket|bottle|bag|case|cover|filter|pad|brush|adapter|cable|manual|guide|recipe\s*book)\b/gi,
];

function extractWithPatterns(text: string, patterns: RegExp[]): string[] {
  const results = new Set<string>();
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((m) => results.add(m.trim()));
    }
  }
  return Array.from(results);
}

function extractCategory(text: string): string {
  const categoryPatterns = [
    /\b(?:this\s+)?(\w+\s*(?:machine|maker|device|tool|system|kit|set|unit|appliance))\b/gi,
    /\b(product\s+(?:category|type)[:\s]+(\w+))/gi,
    /\b(type|category)[:\s]+(\w+)/gi,
  ];
  for (const pattern of categoryPatterns) {
    const match = text.match(pattern);
    if (match) return match[1] || match[2] || "";
  }
  return "";
}

function extractFeatures(text: string): string[] {
  const features = new Set<string>();

  const lineFeatures = text
    .split(/[\n\r]+/)
    .map((l) => l.trim())
    .filter((l) => {
      const lower = l.toLowerCase();
      return (
        (l.startsWith("-") ||
          l.startsWith("•") ||
          l.startsWith("*") ||
          /^\d+[\.\)]/.test(l)) &&
        l.length > 5 &&
        l.length < 200
      );
    })
    .map((l) => l.replace(/^[-•*\d\.\)\s]+/, "").trim());
  lineFeatures.forEach((f) => features.add(f));

  const bulletLike = text.match(
    /(?:^|\n)\s*[-•*]\s*(?:[A-Z][^.]*\.)/gm
  );
  if (bulletLike) {
    bulletLike.forEach((b) => {
      const cleaned = b.replace(/^[-•*\s]+/, "").trim();
      if (cleaned.length > 10) features.add(cleaned);
    });
  }

  const specLines = text.split(/[\n\r]+/).filter((l) => l.includes(":"));
  specLines.forEach((l) => {
    const parts = l.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(":").trim();
      if (key.length < 30 && val.length < 80) {
        features.add(`${key}: ${val}`);
      }
    }
  });

  const powerMatches = text.match(/\b(\d+)\s*(W|watts|volts|V|amps|A|HP|horsepower)\b/gi);
  if (powerMatches) powerMatches.forEach((m) => features.add(m));

  const tempMatches = text.match(/\b\d+\s*[°°]\s*(F|C|Fahrenheit|Celsius)\b/gi);
  if (tempMatches) tempMatches.forEach((m) => features.add(m));

  const noiseMatches = text.match(/\b(\d+)\s*dB\b/gi);
  if (noiseMatches) noiseMatches.forEach((m) => features.add(`${m} noise level`));

  return Array.from(features);
}

function extractUseCases(text: string): string[] {
  const useCases = new Set<string>();

  const scenePatterns = [
    /\b(for|ideal\s+for|perfect\s+for|great\s+for|suitable\s+for|designed\s+for)\s+([^,.]+)/gi,
    /\b(use\s+in|used\s+in|works\s+in|great\s+in)\s+([^,.]+)/gi,
    /\b(when\s+(?:you'?re|traveling|camping|hosting|entertaining|partying))\b/gi,
    /\b(RV|camper|boat|office|kitchen|bedroom|bathroom|garage|dorm|patio|backyard|pool|beach|camping|travel|party)\b/gi,
  ];

  for (const pattern of scenePatterns) {
    const matches = text.match(pattern);
    if (matches) matches.forEach((m) => useCases.add(m.trim()));
  }

  return Array.from(useCases);
}

function extractSupportInfo(text: string): string[] {
  const support = new Set<string>();

  const patterns = [
    /\b(\d+[-–]\s*year\s*(?:warranty|replacement|support|guarantee))\b/gi,
    /\b(lifetime\s*(?:warranty|replacement|support))\b/gi,
    /\b(?:satisfaction\s+)?(?:guarantee|warranty|support|service)\b/gi,
    /\b(?:USA|US)\s*based\s*(?:support|service|team)\b/gi,
    /\b(?:customer\s+service|tech\s+support|after[-–]?sales)\b/gi,
    /\b(?:free\s+returns|easy\s+returns|30[-–]day|60[-–]day|90[-–]day)\b/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) matches.forEach((m) => support.add(m.trim()));
  }

  return Array.from(support);
}

export function extractFactsFromText(text: string): string[] {
  const facts = new Set<string>();

  const lines = text.split(/[\n\r]+/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*\d\.\)\s]+/, "").trim();
    if (cleaned.length > 15) facts.add(cleaned);
  }

  const sentences = text.match(/[^.!?\n]+[.!?]/g) || [];
  for (const s of sentences) {
    const trimmed = s.trim();
    if (trimmed.length > 20 && trimmed.length < 200) facts.add(trimmed);
  }

  return Array.from(facts);
}
