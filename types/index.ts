export type WritingStyle = "seo" | "balanced" | "conversion";

export type OutputMode = "title-highlights" | "bullets" | "description" | "all";

export interface AdvancedSettings {
  titleMaxLength: number;
  highlightMaxLength: number;
  writingStyle: WritingStyle;
  strictDedupe: boolean;
  amazonCompliance: boolean;
}

export interface ProductFacts {
  brand: string;
  category: string;
  languageDetected: string;
  capacities: string[];
  dimensions: string[];
  materials: string[];
  features: string[];
  certifications: string[];
  accessories: string[];
  useCases: string[];
  supportInfo: string[];
  notes: string[];
}

export interface RankedSellingPoint {
  text: string;
  priority: number;
}

export interface GeneratedOutput {
  title?: string;
  highlights?: string;
  bullets?: string[];
  description?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const FORBIDDEN_PHRASES = [
  "best",
  "perfect",
  "no.1",
  "top-rated",
  "guaranteed",
  "100% safe",
  "the most powerful",
  "buy now",
  "don't miss out",
  "must-have for everyone",
  "wow your guests",
  "life-changing",
  "better than all competitors",
  "more powerful than others",
  "best on amazon",
];

export const DEFAULT_SETTINGS: AdvancedSettings = {
  titleMaxLength: 75,
  highlightMaxLength: 125,
  writingStyle: "balanced",
  strictDedupe: true,
  amazonCompliance: true,
};
