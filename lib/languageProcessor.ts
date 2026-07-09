import { LANGUAGE_MAP, SupportedLanguage, CODE_TO_LANGUAGE, AMAZON_SITES, LANGUAGE_LABELS_ZH } from "./languageConfig";

// ===== Detection =====

const GERMAN_WORDS = ["der","die","das","und","oder","mit","f\u00fcr","auf","ist","ein","eine","nicht","sich","auch","als","bei","nach","aus","durch","\u00fcber","ohne","gegen","zwischen"];
const FRENCH_WORDS = ["le","la","les","des","une","dans","pour","avec","sur","pas","nous","vous","ils","elles","mais","donc","car","en","par","est","sont","cette","leur","leurs"];
const SPANISH_WORDS = ["el","la","los","las","un","una","para","con","por","como","m\u00e1s","pero","muy","este","esta","entre","sobre","sin","era","son","han","tiene"];
const ITALIAN_WORDS = ["il","lo","la","gli","le","un","uno","una","del","della","delle","degli","che","con","per","non","sono","come","pi\u00f9","dove","cosa","quando","mai","anche","questo","questa","dei","dai","sul","sulla","tra","fra"];

const JAPANESE_INDICATORS = /[\u3040-\u309f\u30a0-\u30ff]/;
const CJK_INDICATORS = /[\u4e00-\u9fff\u3400-\u4dbf]/;

function buildWordRegex(words: string[]): RegExp {
  return new RegExp("\\b(" + words.join("|") + ")\\b", "i");
}

function countMatches(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const w of words) {
    const wLower = w.toLowerCase().replace(/\\u[0-9a-f]{4}/g, function(m) {
      return String.fromCharCode(parseInt(m.slice(2), 16));
    });
    const regex = new RegExp("\\b" + wLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    if (regex.test(lower)) count++;
  }
  return count;
}

export function detectSourceLanguage(text: string): SupportedLanguage | "unknown" {
  const sample = text.slice(0, 1000);

  // Japanese
  if (JAPANESE_INDICATORS.test(sample)) return "Japanese";

  // Chinese (CJK without Japanese)
  const cjkCount = (sample.match(CJK_INDICATORS) || []).length;
  const latinCount = (sample.match(/[a-zA-Z]/g) || []).length;
  if (cjkCount > latinCount * 0.3 && cjkCount > 3) {
    return "Chinese";
  }

  // Count matches for each language
  const germanCount = countMatches(sample, GERMAN_WORDS);
  const italianCount = countMatches(sample, ITALIAN_WORDS);
  const frenchCount = countMatches(sample, FRENCH_WORDS);
  const spanishCount = countMatches(sample, SPANISH_WORDS);

  // Score each language
  const scores: [string, number][] = [
    ["German", germanCount],
    ["Italian", italianCount],
    ["French", frenchCount],
    ["Spanish", spanishCount],
  ];

  scores.sort((a, b) => b[1] - a[1]);

  if (scores[0][1] > 0 && scores[0][1] >= scores[1][1]) {
    return scores[0][0] as SupportedLanguage;
  }

  // Default to English if enough latin text
  if (latinCount > 5) return "English";

  return "unknown";
}

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

// ===== Instruction builders =====

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
    "5. sourceLanguage (" + sourceLabel + ") is only for understanding the raw product information.",
    "6. targetLanguage (" + targetLabel + ") is the ONLY language that should be used in the final Amazon copy.",
    "7. Never output bilingual content in the main result.",
    "8. Never explain the language choice.",
    "9. Return only the final copy in the requested targetLanguage.",
    "",
    "Target Language: " + targetLanguage,
    "Target Marketplace: " + site,
    "Input Source Language: " + sourceLabel,
  ].join("\n");
}

export function getAmazonSite(language: SupportedLanguage): string {
  return AMAZON_SITES[language] || "Amazon Global";
}
