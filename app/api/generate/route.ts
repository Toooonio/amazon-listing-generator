import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek, callDeepSeekJSON } from "@/lib/deepseek";
import { buildExtractionPrompt, ExtractedFacts } from "@/lib/factExtractor";
import {
  buildTitleSystemPrompt,
  buildTitleUserPrompt,
} from "@/prompts/titlePrompt";
import {
  buildHighlightSystemPrompt,
  buildHighlightUserPrompt,
} from "@/prompts/highlightPrompt";
import {
  buildBulletsSystemPrompt,
  buildBulletsUserPrompt,
} from "@/prompts/bulletPrompt";
import {
  buildDescriptionSystemPrompt,
  buildDescriptionUserPrompt,
} from "@/prompts/descriptionPrompt";
import { detectSourceLanguage, normalizeTargetLanguage, buildLanguageInstruction } from "@/lib/languageProcessor";
import { checkCompliance, cleanCopy, validateAllOutputs } from "@/lib/compliance";
import { checkAllDuplicates } from "@/lib/duplicateChecker";
import { translateToChinese, translateBulletsToChinese } from "@/lib/translator";
import { SupportedLanguage } from "@/lib/languageConfig";
import { LocalizedField } from "@/types";

export const runtime = "nodejs";

interface GenerateRequest {
  brand: string;
  language: string;
  mode: string;
  productInfo: string;
  settings: {
    titleMaxLength: number;
    highlightMaxLength: number;
    writingStyle: string;
    strictDedupe: boolean;
    amazonCompliance: boolean;
  };
}

interface GenerateResponse {
  title: LocalizedField;
  highlight: LocalizedField;
  bullets: LocalizedField[];
  description: LocalizedField;
  meta: {
    sourceLanguage: string;
    targetLanguage: string;
  };
  warnings?: string[];
  complianceWarnings?: string[];
}

function emptyField(): LocalizedField {
  return { original: "", zh: "" };
}

function emptyBullets(): LocalizedField[] {
  return [{ original: "", zh: "" }];
}

function cleanAndCap(text: string, maxLen: number): string {
  let cleaned = cleanCopy(text);
  if (cleaned.length > maxLen) {
    cleaned = cleaned.slice(0, maxLen - 3).replace(/\s+\S*$/, "") + "...";
  }
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { brand, language, mode, productInfo, settings } = body;

    if (!brand || !productInfo) {
      return NextResponse.json(
        { error: "Brand and product info are required" },
        { status: 400 }
      );
    }

    const warnings: string[] = [];
    const complianceWarnings: string[] = [];

    // Step 1: Normalize target language (user's choice - this is the ONLY determinant)
    const targetLanguage: SupportedLanguage = normalizeTargetLanguage(language || "English");
    console.log("[LANGUAGE DEBUG] targetLanguage:", targetLanguage);

    // Step 2: Detect source language (for info only - does NOT affect output)
    const sourceLanguage = await detectSourceLanguage(productInfo);
  console.log("[LANGUAGE DEBUG] productInfo:", productInfo.slice(0, 200));
  console.log("[LANGUAGE DEBUG] detected sourceLanguage:", sourceLanguage);

    // Step 3: Build language instruction for prompts
    const languageInstruction = buildLanguageInstruction(targetLanguage, sourceLanguage);

    // Step 4: Extract product facts using AI
    let facts: ExtractedFacts;
    try {
      const extractionPrompt = buildExtractionPrompt(productInfo, sourceLanguage);
      facts = await callDeepSeekJSON<ExtractedFacts>({
        systemPrompt: "Extract structured product information as JSON. Return ONLY valid JSON, no markdown, no extra text.",
        userPrompt: extractionPrompt,
        temperature: 0.2,
        maxTokens: 800,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      warnings.push("AI extraction failed: " + errorMsg);
      facts = {
        productType: "",
        mainKeyword: "",
        features: [],
        specifications: [],
        materials: [],
        certifications: [],
        useCases: [],
        targetCustomer: [],
      };
    }

    const result: GenerateResponse = {
      title: emptyField(),
      highlight: emptyField(),
      bullets: [],
      description: emptyField(),
      meta: {
        sourceLanguage,
        targetLanguage,
      },
    };

    const shouldGenerateTitle = mode === "title-highlights" || mode === "all";
    const shouldGenerateHighlights = mode === "title-highlights" || mode === "all";
    const shouldGenerateBullets = mode === "bullets" || mode === "all";
    const shouldGenerateDescription = mode === "description" || mode === "all";

    // Step 5: Generate title
    if (shouldGenerateTitle) {
      try {
        const titleText = await callDeepSeek({
          systemPrompt: buildTitleSystemPrompt(),
          userPrompt: buildTitleUserPrompt({
            brand,
            targetLanguage,
            sourceLanguage,
            productType: facts.productType,
            mainKeyword: facts.mainKeyword,
            features: facts.features,
            specifications: facts.specifications,
            useCases: facts.useCases,
            titleMaxLength: settings.titleMaxLength || 75,
            languageInstruction,
          }),
          temperature: 0.7,
          maxTokens: 200,
        });

        let cleaned = cleanAndCap(titleText, settings.titleMaxLength || 75);
        if (!cleaned.startsWith(brand)) {
          complianceWarnings.push("[Title] Does not start with brand name");
        }

        // Compliance check
        if (settings.amazonCompliance) {
          const compResult = checkCompliance(cleaned);
          compResult.violations.forEach((v) => complianceWarnings.push("[Title] " + v));
          cleaned = cleanCopy(compResult.cleanedText);
        }

        result.title.original = cleaned;

        // Translate to Chinese
        try {
          result.title.zh = await translateToChinese(cleaned, targetLanguage);
        } catch {
          result.title.zh = "[Translation failed]";
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Title generation failed: " + errorMsg);
        const fallback = brand + " " + (facts.productType || "Product");
        result.title.original = fallback.slice(0, settings.titleMaxLength || 75);
      }
    }

    // Step 6: Generate highlights
    if (shouldGenerateHighlights && result.title.original) {
      try {
        const highlightText = await callDeepSeek({
          systemPrompt: buildHighlightSystemPrompt(),
          userPrompt: buildHighlightUserPrompt({
            brand,
            targetLanguage,
            sourceLanguage,
            existingTitle: result.title.original,
            productType: facts.productType,
            features: facts.features,
            specifications: facts.specifications,
            useCases: facts.useCases,
            highlightMaxLength: settings.highlightMaxLength || 125,
            languageInstruction,
          }),
          temperature: 0.7,
          maxTokens: 200,
        });

        let cleaned = cleanAndCap(highlightText, settings.highlightMaxLength || 125);

        if (settings.amazonCompliance) {
          const compResult = checkCompliance(cleaned);
          compResult.violations.forEach((v) => complianceWarnings.push("[Highlights] " + v));
          cleaned = cleanCopy(compResult.cleanedText);
        }

        result.highlight.original = cleaned;

        // Translate to Chinese
        try {
          result.highlight.zh = await translateToChinese(cleaned, targetLanguage);
        } catch {
          result.highlight.zh = "[Translation failed]";
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Highlight generation failed: " + errorMsg);
        result.highlight.original = facts.features.slice(0, 2).join(". ") + ".";
      }
    }

    // Step 7: Generate bullet points
    if (shouldGenerateBullets) {
      try {
        const bulletsText = await callDeepSeek({
          systemPrompt: buildBulletsSystemPrompt(),
          userPrompt: buildBulletsUserPrompt({
            brand,
            targetLanguage,
            sourceLanguage,
            productType: facts.productType,
            features: facts.features,
            specifications: facts.specifications,
            materials: facts.materials,
            certifications: facts.certifications,
            useCases: facts.useCases,
            existingTitle: result.title.original,
            languageInstruction,
          }),
          temperature: 0.7,
          maxTokens: 800,
        });

        const rawBullets = bulletsText
          .split("\n")
          .map((b) => b.trim())
          .filter((b) => b.length > 10)
          .slice(0, 5);

        while (rawBullets.length < 5) {
          rawBullets.push("VERSATILE USE: Designed for " + (facts.useCases[0] || "daily use") + ".");
        }

        const processed = rawBullets.map((b) => {
          let cleaned = b;
          if (settings.amazonCompliance) {
            const compResult = checkCompliance(cleaned);
            compResult.violations.forEach((v) => complianceWarnings.push("[Bullet] " + v));
            cleaned = cleanCopy(compResult.cleanedText);
          }
          return cleaned;
        });

        // Store originals
        result.bullets = processed.map((b) => ({ original: b, zh: "" }));

        // Translate to Chinese (one by one)
        const zhTranslations = await translateBulletsToChinese(processed, targetLanguage);
        for (let i = 0; i < result.bullets.length; i++) {
          if (i < zhTranslations.length) {
            result.bullets[i].zh = zhTranslations[i];
          }
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Bullet generation failed: " + errorMsg);
        result.bullets = [
          { original: "EFFICIENT PERFORMANCE: Reliable " + (facts.productType || "performance") + ".", zh: "" },
          { original: "EASY TO USE: Simple operation for everyday use.", zh: "" },
          { original: "THOUGHTFUL DESIGN: Compact and practical.", zh: "" },
          { original: "EASY MAINTENANCE: Simple to clean.", zh: "" },
          { original: "PEACE OF MIND: Quality construction.", zh: "" },
        ];
      }
    }

    // Step 8: Generate description
    if (shouldGenerateDescription) {
      try {
        const descriptionText = await callDeepSeek({
          systemPrompt: buildDescriptionSystemPrompt(),
          userPrompt: buildDescriptionUserPrompt({
            brand,
            targetLanguage,
            sourceLanguage,
            productType: facts.productType,
            features: facts.features,
            specifications: facts.specifications,
            materials: facts.materials,
            certifications: facts.certifications,
            useCases: facts.useCases,
            supportInfo: [],
            existingBullets: result.bullets.map((b) => b.original),
            languageInstruction,
          }),
          temperature: 0.7,
          maxTokens: 1000,
        });

        let cleaned = descriptionText;
        if (settings.amazonCompliance) {
          const compResult = checkCompliance(cleaned);
          compResult.violations.forEach((v) => complianceWarnings.push("[Description] " + v));
          cleaned = compResult.cleanedText;
        }

        result.description.original = cleaned;

        // Translate to Chinese
        try {
          result.description.zh = await translateToChinese(cleaned, targetLanguage);
        } catch {
          result.description.zh = "[Translation failed]";
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Description generation failed: " + errorMsg);
        const pt = facts.productType || "product";
        result.description.original =
          "The " + brand + " " + pt + " is designed for " +
          (facts.useCases.slice(0, 2).join(" and ") || "daily use") + ".";
      }
    }

    // Step 9: Deduplication checks
    if (settings.strictDedupe && result.title.original && result.highlight.original && result.bullets.length > 0 && result.description.original) {
      const dedupeIssues = checkAllDuplicates(
        result.title.original,
        result.highlight.original,
        result.bullets.map((b) => b.original),
        result.description.original
      );
      dedupeIssues.forEach((issue) => warnings.push("[Deduplication] " + issue));
    }

    result.warnings = warnings;
    result.complianceWarnings = complianceWarnings;

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Generate API error:", errorMsg);
    return NextResponse.json(
      { error: errorMsg, warnings: ["Server error: " + errorMsg] },
      { status: 500 }
    );
  }
}
