import { FORBIDDEN_PHRASES } from "@/types";

export function checkCompliance(text: string): { violations: string[]; cleaned: string } {
  const violations: string[] = [];
  let cleaned = text;

  const lowerText = text.toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    const idx = lowerText.indexOf(phrase);
    if (idx !== -1) {
      violations.push(`Contains forbidden phrase: "${text.slice(idx, idx + phrase.length + 20)}"`);
    }
  }

  // Additional checks
  const superlativePattern = /\b(?:the\s+)?(?:best|greatest|superior|ultimate|perfect|amazing|incredible)\b/gi;
  let match;
  while ((match = superlativePattern.exec(text)) !== null) {
    violations.push(`Contains superlative: "${match[0]}"`);
  }

  // Check for medical claims
  const medicalPattern = /\b(cure|treat|prevent|diagnose|heal|therapeutic|medical\s+grade|clinical)\b/gi;
  while ((match = medicalPattern.exec(text)) !== null) {
    violations.push(`Contains medical claim: "${match[0]}"`);
  }

  return { violations, cleaned };
}

export function filterForbiddenPhrases(text: string): string {
  let filtered = text;
  for (const phrase of FORBIDDEN_PHRASES) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    filtered = filtered.replace(regex, "");
  }

  const superlativePattern = /\b(the\s+)?(best|greatest|superior|ultimate|perfect|amazing|incredible)\b/gi;
  filtered = filtered.replace(superlativePattern, "");

  const medicalPattern = /\b(cure|treat|prevent|diagnose|heal|therapeutic|medical\s+grade|clinical)\b/gi;
  filtered = filtered.replace(medicalPattern, "");

  // Clean up extra spaces
  filtered = filtered.replace(/\s{2,}/g, " ").trim();

  return filtered;
}

export function cleanCopy(text: string): string {
  let cleaned = text;

  // Remove double spaces
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // Remove leading/trailing punctuation
  cleaned = cleaned.replace(/^[\s,;:.!?-]+/, "");
  cleaned = cleaned.replace(/[\s,;:.!?-]+$/, "");

  // Ensure proper sentence-ending punctuation
  if (cleaned.length > 0 && /[a-zA-Z0-9\]]/.test(cleaned[cleaned.length - 1])) {
    cleaned += ".";
  }

  return cleaned.trim();
}

export function validateCompliance(
  title?: string,
  highlights?: string,
  bullets?: string[],
  description?: string
): string[] {
  const allWarnings: string[] = [];
  const check = (label: string, text: string) => {
    const result = checkCompliance(text);
    result.violations.forEach((v) => allWarnings.push(`[${label}] ${v}`));
  };

  if (title) check("Title", title);
  if (highlights) check("Highlights", highlights);
  if (bullets) bullets.forEach((b, i) => check(`Bullet ${i + 1}`, b));
  if (description) check("Description", description);

  return allWarnings;
}
