const FORBIDDEN_TERMS = [
  "best", "perfect", "no.1", "no. 1", "top-rated", "top rated",
  "guaranteed", "100% safe", "100%",
  "the most powerful", "the best",
  "must-have", "must have", "buy now", "don't miss out",
  "wow your guests", "life-changing", "game-changing",
  "better than all competitors", "more powerful than others",
  "best on amazon", "best on the market",
  "cure", "treat", "prevent", "diagnose", "heal",
  "therapeutic", "medical grade",
];

const SENSITIVE_COMPARISONS = [
  "better than", "stronger than", "faster than", "superior to",
  "outperform", "beats", "crushes", "destroys", "annihilates",
];

export interface ComplianceResult {
  clean: boolean;
  violations: string[];
  cleanedText: string;
}

export function checkCompliance(text: string): ComplianceResult {
  const violations: string[] = [];
  let cleanedText = text;
  const lowerText = text.toLowerCase();

  for (const term of FORBIDDEN_TERMS) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\$&"), "gi");
    if (regex.test(lowerText)) {
      violations.push(`Contains forbidden term: "${term}"`);
      cleanedText = cleanedText.replace(regex, "");
    }
  }

  for (const comp of SENSITIVE_COMPARISONS) {
    if (lowerText.includes(comp)) {
      violations.push(`Contains unsubstantiated comparison: "${comp}"`);
    }
  }

  // Check for excessive capitalization (keyword stuffing)
  const words = text.split(/\s+/);
  const upperWords = words.filter((w) => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (upperWords.length > 3) {
    violations.push(`Excessive capitalization detected (${upperWords.length} uppercase words) - possible keyword stuffing`);
  }

  // Check for repeated words (keyword stuffing)
  const wordFreq: Record<string, number> = {};
  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length > 2) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
  });
  for (const [word, count] of Object.entries(wordFreq)) {
    if (count > 3) {
      violations.push(`Word "${word}" appears ${count} times - excessive repetition`);
    }
  }

  // Clean up extra spaces from removed terms
  cleanedText = cleanedText.replace(/\s{2,}/g, " ").trim();

  return {
    clean: violations.length === 0,
    violations,
    cleanedText,
  };
}

export function cleanCopy(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/\s{2,}/g, " ");
  cleaned = cleaned.replace(/^[\s,;:.!?\-]+/, "");
  cleaned = cleaned.replace(/[\s,;:.!?\-]+$/, "");
  if (cleaned.length > 0 && /[a-zA-Z0-9\]]/.test(cleaned[cleaned.length - 1])) {
    cleaned += ".";
  }
  return cleaned.trim();
}

export function validateAllOutputs(
  title?: string,
  highlights?: string,
  bullets?: string[],
  description?: string
): string[] {
  const warnings: string[] = [];
  const items: [string, string | undefined][] = [
    ["Title", title],
    ["Highlights", highlights],
    ...(bullets || []).map((b, i) => [`Bullet ${i + 1}`, b] as [string, string | undefined]),
    ["Description", description],
  ];

  for (const [label, text] of items) {
    if (text) {
      const result = checkCompliance(text);
      result.violations.forEach((v) => warnings.push(`[${label}] ${v}`));
    }
  }

  return warnings;
}
