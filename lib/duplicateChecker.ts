export interface DuplicateCheckResult {
  hasIssues: boolean;
  issues: string[];
}

export interface KeywordOverlapResult {
  rate: number;
  keywordRate: number;
  phraseRate: number;
  sharedWords: string[];
  sharedPhrases: string[];
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "its", "it's", "your", "our",
  "their", "this", "that", "these", "those", "from", "into", "about",
  "than", "then", "also", "very", "just", "not", "no", "so",
  "und", "mit", "fur", "für", "der", "die", "das", "von", "auf",
  "con", "per", "una", "uno", "del", "della", "para", "por", "los", "las",
  "avec", "pour", "une", "des", "du", "sur", "dans", "les",
]);

function getSignificantWords(text: string): string[] {
  const normalized = text.toLowerCase();
  const cjkRuns = normalized.match(/[\u3040-\u30ff\u3400-\u9fff]+/g) || [];
  const cjkTokens: string[] = [];

  for (const run of cjkRuns) {
    if (run.length === 1) {
      cjkTokens.push(run);
      continue;
    }
    for (let i = 0; i < run.length - 1; i++) {
      cjkTokens.push(run.slice(i, i + 2));
    }
  }

  const latinWords = normalized
    .replace(/[\u3040-\u30ff\u3400-\u9fff]+/g, " ")
    .replace(/[^a-z0-9\u00c0-\u024f\s'-]/g, "")
    .split(/\s+/)
    .filter(function(w) { return w.length > 2 && !STOP_WORDS.has(w); });

  return latinWords.concat(cjkTokens);
}

export function getKeywordOverlapRate(title: string, highlight: string): KeywordOverlapResult {
  const titleWords = getSignificantWords(title);
  const highlightWords = getSignificantWords(highlight);
  const titleKeywords = new Set(titleWords);
  const highlightKeywords = new Set(highlightWords);

  if (titleKeywords.size === 0 || highlightKeywords.size === 0) {
    return { rate: 0, keywordRate: 0, phraseRate: 0, sharedWords: [], sharedPhrases: [] };
  }

  const sharedWords = Array.from(titleKeywords).filter((word) => highlightKeywords.has(word));
  const keywordRate = sharedWords.length / Math.min(titleKeywords.size, highlightKeywords.size);
  const titlePhrases = new Set(createPhrases(titleWords));
  const highlightPhrases = new Set(createPhrases(highlightWords));
  const sharedPhrases = Array.from(titlePhrases).filter((phrase) => highlightPhrases.has(phrase));
  const phraseDenominator = Math.min(titlePhrases.size, highlightPhrases.size);
  const phraseRate = phraseDenominator > 0 ? sharedPhrases.length / phraseDenominator : 0;

  return {
    // Keyword overlap catches reordering; phrase overlap catches copied expressions.
    rate: Math.max(keywordRate, phraseRate),
    keywordRate,
    phraseRate,
    sharedWords,
    sharedPhrases,
  };
}

function createPhrases(words: string[]): string[] {
  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(words[i] + " " + words[i + 1]);
  }
  return phrases;
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
