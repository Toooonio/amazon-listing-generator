export const LANGUAGE_MAP = {
  English: "English",
  Chinese: "Chinese",
  Italian: "Italian",
  French: "French",
  German: "German",
  Spanish: "Spanish",
  Japanese: "Japanese",
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_MAP;

export const LANGUAGE_LABELS_ZH: Record<SupportedLanguage, string> = {
  English: "??",
  Chinese: "??",
  Italian: "????",
  French: "??",
  German: "??",
  Spanish: "????",
  Japanese: "??",
};

export const SUPPORTED_LANGUAGES_ARRAY: SupportedLanguage[] = [
  "English", "Chinese", "Italian", "French", "German", "Spanish", "Japanese",
];

export const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  English: "en",
  Chinese: "zh",
  Italian: "it",
  French: "fr",
  German: "de",
  Spanish: "es",
  Japanese: "ja",
};

export const CODE_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  en: "English",
  zh: "Chinese",
  it: "Italian",
  fr: "French",
  de: "German",
  es: "Spanish",
  ja: "Japanese",
};

export const AMAZON_SITES: Record<SupportedLanguage, string> = {
  English: "Amazon.com (US)",
  Chinese: "Amazon.cn / Global",
  Italian: "Amazon.it",
  French: "Amazon.fr",
  German: "Amazon.de",
  Spanish: "Amazon.es",
  Japanese: "Amazon.co.jp",
};
