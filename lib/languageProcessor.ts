export interface LanguageInstruction {
  code: string;
  name: string;
  amazonSite: string;
  writingGuide: string;
}

const languageMap: Record<string, LanguageInstruction> = {
  en: {
    code: "en",
    name: "English",
    amazonSite: "Amazon.com (US)",
    writingGuide: "Write in natural American English. Follow Amazon US listing conventions. Use persuasive but factual copy. Avoid British spellings.",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    amazonSite: "Amazon Japan / Global",
    writingGuide: "Use Simplified Chinese. Write in a clear, benefit-oriented style. Use Amazon marketplace conventions for Chinese-language buyers.",
  },
  de: {
    code: "de",
    name: "German",
    amazonSite: "Amazon.de",
    writingGuide: "Use proper German with correct capitalization of nouns and verb position. German Amazon listings tend to be factual, detailed, and technical.",
  },
  fr: {
    code: "fr",
    name: "French",
    amazonSite: "Amazon.fr",
    writingGuide: "Use natural French with proper grammar. French listings are often more descriptive and lifestyle-oriented.",
  },
  es: {
    code: "es",
    name: "Spanish",
    amazonSite: "Amazon.es",
    writingGuide: "Use neutral Spanish. Spanish listings tend to be benefit-driven and warm in tone.",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    amazonSite: "Amazon.co.jp",
    writingGuide: "Use natural Japanese with appropriate politeness. Japanese Amazon listings should be detailed, precise, and trust-oriented.",
  },
};

export function getLanguageInstruction(code: string): LanguageInstruction {
  return languageMap[code] || languageMap.en;
}

export function buildLanguageInstruction(code: string): string {
  const inst = getLanguageInstruction(code);
  return `Target Language: ${inst.name}
Target Marketplace: ${inst.amazonSite}
Writing Guide: ${inst.writingGuide}

IMPORTANT: This is NOT a translation task. Do NOT translate the input. You must generate native Amazon listing copy directly in ${inst.name} following the marketplace conventions above.`;
}

export function getAmazonSite(code: string): string {
  return getLanguageInstruction(code).amazonSite;
}
