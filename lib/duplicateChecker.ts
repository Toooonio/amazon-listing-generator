export interface DuplicateCheckResult {
  hasIssues: boolean;
  issues: string[];
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "its", "it's", "your", "our",
  "their", "this", "that", "these", "those", "from", "into", "about",
  "than", "then", "also", "very", "just", "not", "no", "so",
]);

function getSignificantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .split(/\s+/)
    .filter(function(w) { return w.length > 2 && !STOP_WORDS.has(w); });
}

export function checkDuplicateBetween(
  sourceA: string,
  sourceB: string,
  labelA: string,
  labelB: string
): DuplicateCheckResult {
  const issues: string[] = [];
  const wordsA = getSignificantWords(sourceA);
  const wordsB = getSignificantWords(sourceB);
  const setB = new Set(wordsB);
  const overlaps = wordsA.filter(function(w) { return setB.has(w); });
  if (overlaps.length > 5) {
    issues.push(labelA + " and " + labelB + " share " + overlaps.length + " significant words: \"" + overlaps.slice(0, 5).join(", ") + "...\"");
  }
  const combinedFreq: Map<string, number> = new Map();
  const allWords = getSignificantWords(sourceA + " " + sourceB);
  for (const w of allWords) {
    combinedFreq.set(w, (combinedFreq.get(w) || 0) + 1);
  }
  combinedFreq.forEach(function(count, word) {
    if (count > 3) {
      issues.push('Word "' + word + '" appears ' + count + ' times across ' + labelA + ' and ' + labelB);
    }
  });
  return { hasIssues: issues.length > 0, issues };
}

export function checkAllDuplicates(
  title?: string,
  highlights?: string,
  bullets?: string[],
  description?: string
): string[] {
  const allIssues: string[] = [];
  if (title && highlights) {
    const result = checkDuplicateBetween(title, highlights, "Title", "Highlights");
    for (const i of result.issues) allIssues.push(i);
  }
  if (title && bullets) {
    for (let i = 0; i < bullets.length; i++) {
      const result = checkDuplicateBetween(title, bullets[i], "Title", "Bullet " + (i + 1));
      for (const j of result.issues) allIssues.push(j);
    }
  }
  if (bullets && description) {
    const allBullets = bullets.join(" ");
    const result = checkDuplicateBetween(description, allBullets, "Description", "Bullets");
    for (const i of result.issues) allIssues.push(i);
  }
  return allIssues;
}
