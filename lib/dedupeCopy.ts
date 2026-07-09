import { FORBIDDEN_PHRASES } from "@/types";

export interface DedupeResult {
  title: string;
  highlights: string;
  bullets: string[];
  description: string;
}

export function dedupeCopy(
  title: string,
  highlights: string,
  bullets: string[],
  description: string
): DedupeResult {
  let result = { title, highlights, bullets: [...bullets], description };

  // Check title vs highlights
  result = dedupeTitleVsHighlights(result);

  // Check title vs bullets
  result = dedupeTitleVsBullets(result);

  // Check bullets vs description
  result = dedupeBulletsVsDescription(result);

  return result;
}

function dedupeTitleVsHighlights(result: DedupeResult): DedupeResult {
  const titleWords = getSignificantWords(result.title);
  const highlightWords = getSignificantWords(result.highlights);

  const overlap = titleWords.filter((w) => highlightWords.includes(w));

  if (overlap.length > 3) {
    // Too much overlap - flagged for potential regeneration
  }

  return result;
}

function dedupeTitleVsBullets(result: DedupeResult): DedupeResult {
  const titleWords = getSignificantWords(result.title);

  const newBullets = result.bullets.map((bullet) => {
    const bulletWords = getSignificantWords(bullet);
    const overlap = titleWords.filter((w) => bulletWords.includes(w));
    return bullet;
  });

  return { ...result, bullets: newBullets };
}

function dedupeBulletsVsDescription(result: DedupeResult): DedupeResult {
  const allBulletWords = new Set<string>();
  for (const b of result.bullets) {
    getSignificantWords(b).forEach((w) => allBulletWords.add(w));
  }
  return result;
}

function getSignificantWords(text: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "its", "it's", "your", "our",
    "their", "this", "that", "these", "those", "from", "into", "about",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

export function countRepeatedWords(text1: string, text2: string): number {
  const words1 = getSignificantWords(text1);
  const words2 = getSignificantWords(text2);
  const set2 = new Set(words2);
  return words1.filter((w) => set2.has(w)).length;
}

export function wordFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  const words = getSignificantWords(text);
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}
