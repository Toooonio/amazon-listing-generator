export function detectLanguage(text: string): string {
  const sample = text.slice(0, 500);
  const cjkCount = (sample.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const latinCount = (sample.match(/[a-zA-Z]/g) || []).length;
  const germanIndicators = /\b(der|die|das|und|oder|mit|für|auf|ist|ein|eine|nicht|sich|auch|als|bei|nach|aus)\b/i;
  const frenchIndicators = /\b(le|la|les|des|une|dans|pour|avec|sur|pas|nous|vous|ils|elles|mais|donc|car)\b/i;
  const spanishIndicators = /\b(el|la|los|las|un|una|para|con|por|como|más|pero|muy|este|esta|entre|sobre)\b/i;
  const japaneseIndicators = /[\u3040-\u309f\u30a0-\u30ff]/;
  const koreanIndicators = /[\uac00-\ud7af]/;

  if (japaneseIndicators.test(sample)) return "ja";
  if (koreanIndicators.test(sample)) return "ko";

  if (cjkCount > latinCount * 0.5 && cjkCount > 3) {
    return "zh";
  }

  if (germanIndicators.test(sample)) return "de";
  if (frenchIndicators.test(sample)) return "fr";
  if (spanishIndicators.test(sample)) return "es";

  return "en";
}

export function getLanguageLabel(code: string): string {
  const labels: Record<string, string> = {
    en: "English",
    zh: "中文 (Chinese)",
    de: "Deutsch (German)",
    fr: "Français (French)",
    es: "Español (Spanish)",
    ja: "日本語 (Japanese)",
    ko: "한국어 (Korean)",
    it: "Italiano (Italian)",
    pt: "Português (Portuguese)",
    nl: "Nederlands (Dutch)",
  };
  return labels[code] || code.toUpperCase();
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "nl", label: "Nederlands" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
];

export function styleGuideForLanguage(code: string): string {
  const guides: Record<string, string> = {
    en: "Use natural American English. Follow Amazon US listing conventions. Write customer-focused copy.",
    de: "Use proper German sentence structure (verb position, capitalization of nouns). Follow Amazon DE conventions. German Amazon listings tend to be more factual and detailed.",
    fr: "Use natural French with proper grammar and punctuation. Follow Amazon FR conventions. French listings are often more descriptive and benefit-focused.",
    es: "Use neutral Spanish (Latin American preferred). Follow Amazon ES conventions. Spanish listings tend to be benefit-driven and warm in tone.",
    it: "Use natural Italian with proper grammar. Follow Amazon IT conventions. Italian listings often emphasize design, quality, and lifestyle benefits.",
    pt: "Use Brazilian Portuguese. Follow Amazon BR conventions. Portuguese listings tend to be direct and benefit-oriented.",
    nl: "Use proper Dutch sentence structure. Follow Amazon NL conventions. Dutch listings tend to be straightforward and factual.",
    ja: "Use natural Japanese with appropriate politeness level. Follow Amazon JP conventions. Japanese listings should be detailed and precise.",
    ko: "Use natural Korean with appropriate style. Follow Amazon KR conventions. Korean listings should highlight value and quality.",
    zh: "Use Simplified Chinese. Follow Amazon JP conventions for Chinese-language products or general marketplace conventions.",
  };
  return guides[code] || guides.en;
}

export function listingLanguageForCode(code: string): string {
  return getLanguageLabel(code).split(" ")[0];
}
