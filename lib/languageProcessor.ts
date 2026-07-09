import { LANGUAGE_MAP, SupportedLanguage, CODE_TO_LANGUAGE, AMAZON_SITES, LANGUAGE_LABELS_ZH } from "./languageConfig";

// ====================================================================
// Language Detection: Two-layer strategy
// Layer 1: ruleBasedLanguageDetect() - keyword scoring with product-specific terms
// Layer 2: AI fallback - only when Layer 1 cannot decide
// ====================================================================

// ---- Product-category keyword sets (Amazon listing domain) ----

// Italian keywords (strong indicators)
const IT_KEYWORDS = [
  "ghiaccio", "macchina", "pulizia", "portatile", "silenzioso",
  "bevande", "cubetti", "automatico", "cestello", "ghiacciolo",
  "nugget", "compatto", "leggero", "maniglia", "rumore",
  "efficiente", "veloce", "semplice", "utilizzo", "acqua",
  "con", "per", "che", "della", "degli", "delle", "sono",
];

// French keywords (strong indicators)
const FR_KEYWORDS = [
  "glace", "machine", "nettoyage", "portable", "silencieux",
  "boissons", "glaçons", "automatique", "panier", "glaçon",
  "nugget", "compact", "léger", "poignée", "bruit",
  "efficace", "rapide", "simple", "utilisation", "eau",
  "avec", "pour", "qui", "de la", "des", "sont",
];

// German keywords
const DE_KEYWORDS = [
  "eiswürfel", "eis", "maschine", "reinigung", "tragbar",
  "leise", "getränke", "automatisch", "korb", "würfel",
  "nugget", "kompakt", "leicht", "griff", "geräusch",
  "effizient", "schnell", "einfach", "benutzung", "wasser",
  "und", "mit", "für", "auf", "ist", "ein", "eine", "nicht",
  "sich", "auch", "als", "bei", "nach", "aus", "ohne", "durch",
];

// Spanish keywords
const ES_KEYWORDS = [
  "hielo", "máquina", "limpieza", "portátil", "silenciosa",
  "bebidas", "cubitos", "automático", "cesta", "hielitos",
  "nugget", "compacto", "ligero", "asa", "ruido",
  "eficiente", "rápido", "sencillo", "uso", "agua",
  "con", "para", "que", "del", "los", "las",
];

// English keywords
const EN_KEYWORDS = [
  "ice", "maker", "machine", "cleaning", "clean", "portable",
  "quiet", "drinks", "beverages", "automatic", "basket", "cube",
  "nugget", "compact", "lightweight", "handle", "noise",
  "efficient", "fast", "quick", "simple", "easy", "water",
  "with", "for", "the", "and", "this", "that", "from",
  "self-cleaning", "countertop", "home", "kitchen", "office",
];

// ---- Character-based detection ----

// Japanese detection
function hasJapanese(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF)) return true;
  }
  return false;
}

// CJK character counter (Chinese)
function countCJK(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ((c >= 0x4E00 && c <= 0x9FFF) || (c >= 0x3400 && c <= 0x4DBF)) count++;
  }
  return count;
}

// Special character checkers
function hasGermanChars(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ([0xE4, 0xF6, 0xFC, 0xC4, 0xD6, 0xDC, 0xDF].indexOf(c) >= 0) count++;
  }
  return count;
}

function hasItalianChars(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ([0xE0, 0xE8, 0xE9, 0xEC, 0xF2, 0xF9].indexOf(c) >= 0) count++;
  }
  return count;
}

function hasFrenchChars(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ([0xE0, 0xE2, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEE, 0xEF, 0xF4, 0xF9, 0xFB, 0xFF].indexOf(c) >= 0) count++;
  }
  return count;
}

// ---- Helper functions ----

function countMatches(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of keywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("\\b" + escaped + "\\b", "i");
    if (regex.test(lower)) count++;
  }
  return count;
}

// ====================================================================
// Layer 1: Rule-based detection
// ====================================================================

function ruleBasedLanguageDetect(text: string): string | null {
  const sample = text.slice(0, 1500);

  // 1. Japanese (Hiragana/Katakana)
  if (hasJapanese(sample)) return "Japanese";

  // 2. Chinese (CJK characters - but not Japanese)
  const cjkCount = countCJK(sample);
  console.log("[LANGUAGE DEBUG] cjkCount:", cjkCount);
  if (cjkCount > 3) {
    const latinCount = (sample.match(/[a-zA-Z]/g) || []).length;
    console.log("[LANGUAGE DEBUG] latinCount:", latinCount, "cjk > latin*0.3?", cjkCount > latinCount * 0.3);
    if (cjkCount > latinCount * 0.3) return "Chinese";
  }

  // 3. Score-based detection for European languages
  const scores: [string, number][] = [
    ["Italian", countMatches(sample, IT_KEYWORDS)],
    ["German", countMatches(sample, DE_KEYWORDS)],
    ["French", countMatches(sample, FR_KEYWORDS)],
    ["Spanish", countMatches(sample, ES_KEYWORDS)],
    ["English", countMatches(sample, EN_KEYWORDS)],
  ];

  // Sort by score descending
  scores.sort((a, b) => b[1] - a[1]);

  const top = scores[0];
  const second = scores[1];

  // Log scores for debugging
  const scoreStr = scores.map(function(s) { return s[0] + "=" + s[1]; }).join(", ");
  console.log("[LANGUAGE DEBUG] ruleBasedScores:", scoreStr);

  // Must have at least 2 keyword hits to be confident
  if (top[1] < 2) return null;

  // Must lead by at least 1 point to avoid ties
  if (top[1] > second[1] + 1) return top[0];

  // If Italian and French are close, use special char tiebreaker
  const italianScore = (scores.find(function(s) { return s[0] === "Italian"; }) || ["", 0])[1];
  const frenchScore = (scores.find(function(s) { return s[0] === "French"; }) || ["", 0])[1];
  if (Math.abs(italianScore - frenchScore) <= 1 && italianScore >= 2) {
    // Check for Italian-specific chars
    const italianChars = hasItalianChars(sample);
    const frenchChars = hasFrenchChars(sample);
    if (italianChars > frenchChars) return "Italian";
    if (frenchChars > italianChars) return "French";
  }

  // If top score is significantly higher, use it
  if (top[1] >= 3) return top[0];

  return null;
}

// ====================================================================
// Layer 2: AI fallback detection
// =====================================================================

const VALID_LANGUAGES = ["English","Chinese","Italian","French","German","Spanish","Japanese"];

export async function detectSourceLanguage(text: string): Promise<SupportedLanguage | "unknown"> {
  // Layer 1: Rule-based
  const ruleResult = ruleBasedLanguageDetect(text);
  console.log("[LANGUAGE DEBUG] ruleBasedResult:", ruleResult);
  if (ruleResult !== null) {
    return ruleResult as SupportedLanguage;
  }

  // Layer 2: AI fallback using DeepSeek
  try {
    const { callDeepSeek } = await import("./deepseek");
    const sample = text.slice(0, 1000);
    const prompt = "Detect the language of the following text.\n"
      + "Rules:\n"
      + "- ONLY return one word from this list: English, Chinese, Italian, French, German, Spanish, Japanese, unknown\n"
      + "- Do not output any explanation\n"
      + "- Do not output anything else\n"
      + "\nText:\\n" + sample;

    const result = await callDeepSeek({
      systemPrompt: "You are a language detection system. Return ONLY the language name, nothing else.",
      userPrompt: prompt,
      temperature: 0.1,
      maxTokens: 50,
    });

    const clean = result.trim();
    console.log("[LANGUAGE DEBUG] AI fallback result:", clean);

    // Validate the result
    for (const lang of VALID_LANGUAGES) {
      if (clean.toLowerCase() === lang.toLowerCase()) {
        return lang as SupportedLanguage;
      }
    }
  } catch (err) {
    console.log("[LANGUAGE DEBUG] AI fallback failed:", err);
  }

  return "unknown";
}

// ====================================================================
// Normalize target language
// =====================================================================

const LANGUAGE_NORMALIZE: Record<string, string> = {
  en: "English",
  zh: "Chinese",
  it: "Italian",
  fr: "French",
  de: "German",
  es: "Spanish",
  ja: "Japanese",
  english: "English",
  chinese: "Chinese",
  italian: "Italian",
  french: "French",
  german: "German",
  spanish: "Spanish",
  japanese: "Japanese",
};

export function normalizeTargetLanguage(input: string): SupportedLanguage {
  const cleaned = input.trim().toLowerCase();
  if (LANGUAGE_NORMALIZE[cleaned]) {
    return LANGUAGE_NORMALIZE[cleaned] as SupportedLanguage;
  }
  return "English";
}

// ====================================================================
// Instruction builder
// =====================================================================

export function buildLanguageInstruction(targetLanguage: SupportedLanguage, sourceLanguage: string): string {
  const site = AMAZON_SITES[targetLanguage] || "Amazon";
  const sourceLabel = LANGUAGE_LABELS_ZH[sourceLanguage as SupportedLanguage] || sourceLanguage;
  const targetLabel = LANGUAGE_LABELS_ZH[targetLanguage];

  return [
    "IMPORTANT LANGUAGE RULES:",
    "1. The final output MUST be written entirely in " + targetLanguage + ".",
    "2. Do not switch to English unless targetLanguage is English.",
    "3. Do not infer the output language from the input text.",
    "4. The input language may be different from the target language.",
    "5. sourceLanguage (\"" + sourceLabel + "\") is only for understanding the raw product information.",
    "6. targetLanguage (\"" + targetLabel + "\") is the ONLY language that should be used in the final Amazon copy.",
    "7. Never output bilingual content in the main result.",
    "8. Never explain the language choice.",
    "9. Return only the final copy in the requested targetLanguage.",
    "",
    "Target Language: " + targetLanguage,
    "Target Marketplace: " + site,
    "Input Source Language: " + sourceLabel,
  ].join("\\n");
}

export function getAmazonSite(language: SupportedLanguage): string {
  return AMAZON_SITES[language] || "Amazon Global";
}
