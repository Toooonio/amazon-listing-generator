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
import { buildLanguageInstruction, getAmazonSite } from "@/lib/languageProcessor";
import { checkCompliance, cleanCopy, validateAllOutputs } from "@/lib/compliance";
import { checkAllDuplicates } from "@/lib/duplicateChecker";
import { detectLanguage } from "@/lib/language";

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
  title?: string;
  highlights?: string;
  bullets?: string[];
  description?: string;
  warnings?: string[];
  complianceWarnings?: string[];
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

    const detectedLanguage = detectLanguage(productInfo);
    const languageInstruction = buildLanguageInstruction(language || "en");

    // Step 1: Extract product facts using AI
    let facts: ExtractedFacts;
    try {
      const extractionPrompt = buildExtractionPrompt(productInfo, detectedLanguage);
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

    const result: GenerateResponse = {};
    const shouldGenerateTitle = mode === "title-highlights" || mode === "all";
    const shouldGenerateHighlights = mode === "title-highlights" || mode === "all";
    const shouldGenerateBullets = mode === "bullets" || mode === "all";
    const shouldGenerateDescription = mode === "description" || mode === "all";

    // Step 2: Generate title
    if (shouldGenerateTitle) {
      try {
        const title = await callDeepSeek({
          systemPrompt: buildTitleSystemPrompt(),
          userPrompt: buildTitleUserPrompt({
            brand,
            targetLanguage: language || "en",
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

        result.title = cleanCopy(title);

        // Check title length
        if (result.title.length > (settings.titleMaxLength || 75)) {
          complianceWarnings.push(
            `[Title] Exceeds ${settings.titleMaxLength || 75} character limit (${result.title.length} chars)`
          );
        }
        if (!result.title.startsWith(brand)) {
          complianceWarnings.push("[Title] Does not start with brand name");
        }

        // Compliance check
        if (settings.amazonCompliance) {
          const compResult = checkCompliance(result.title);
          compResult.violations.forEach((v) => complianceWarnings.push("[Title] " + v));
          result.title = cleanCopy(compResult.cleanedText);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Title generation failed: " + errorMsg);
        result.title = brand + " " + (facts.productType || "Product");
        if (result.title.length > (settings.titleMaxLength || 75)) {
          result.title = result.title.slice(0, settings.titleMaxLength || 75);
        }
      }
    }

    // Step 3: Generate highlights
    if (shouldGenerateHighlights && result.title) {
      try {
        const highlights = await callDeepSeek({
          systemPrompt: buildHighlightSystemPrompt(),
          userPrompt: buildHighlightUserPrompt({
            brand,
            targetLanguage: language || "en",
            existingTitle: result.title,
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

        result.highlights = cleanCopy(highlights);

        if (result.highlights.length > (settings.highlightMaxLength || 125)) {
          complianceWarnings.push(
            `[Highlights] Exceeds ${settings.highlightMaxLength || 125} character limit`
          );
        }

        if (settings.amazonCompliance) {
          const compResult = checkCompliance(result.highlights);
          compResult.violations.forEach((v) => complianceWarnings.push("[Highlights] " + v));
          result.highlights = cleanCopy(compResult.cleanedText);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Highlight generation failed: " + errorMsg);
        result.highlights = facts.features.slice(0, 2).join(". ") + ".";
        if (result.highlights.length > (settings.highlightMaxLength || 125)) {
          result.highlights = result.highlights.slice(0, settings.highlightMaxLength || 125);
        }
      }
    }

    // Step 4: Generate bullet points
    if (shouldGenerateBullets) {
      try {
        const bulletsText = await callDeepSeek({
          systemPrompt: buildBulletsSystemPrompt(),
          userPrompt: buildBulletsUserPrompt({
            brand,
            targetLanguage: language || "en",
            productType: facts.productType,
            features: facts.features,
            specifications: facts.specifications,
            materials: facts.materials,
            certifications: facts.certifications,
            useCases: facts.useCases,
            existingTitle: result.title,
            languageInstruction,
          }),
          temperature: 0.7,
          maxTokens: 800,
        });

        result.bullets = bulletsText
          .split("\n")
          .map((b) => b.trim())
          .filter((b) => b.length > 10)
          .slice(0, 5);

        while (result.bullets.length < 5) {
          result.bullets.push("VERSATILE USE: Designed for " + (facts.useCases[0] || "daily use") + ". Perfect for any setting.");
        }

        if (settings.amazonCompliance) {
          result.bullets = result.bullets.map((b) => {
            const compResult = checkCompliance(b);
            compResult.violations.forEach((v) => complianceWarnings.push("[Bullet] " + v));
            return cleanCopy(compResult.cleanedText);
          });
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Bullet generation failed: " + errorMsg);
        result.bullets = [
          "EFFICIENT PERFORMANCE: Reliable and consistent " + (facts.productType || "performance") + " for everyday use.",
          "EASY TO USE: Simple operation designed for effortless " + (facts.useCases[0] || "use") + ".",
          "THOUGHTFUL DESIGN: Compact and practical for any setting.",
          "EASY MAINTENANCE: Simple to clean and maintain.",
          "PEACE OF MIND: Quality construction with reliable performance.",
        ];
      }
    }

    // Step 5: Generate description
    if (shouldGenerateDescription) {
      try {
        const description = await callDeepSeek({
          systemPrompt: buildDescriptionSystemPrompt(),
          userPrompt: buildDescriptionUserPrompt({
            brand,
            targetLanguage: language || "en",
            productType: facts.productType,
            features: facts.features,
            specifications: facts.specifications,
            materials: facts.materials,
            certifications: facts.certifications,
            useCases: facts.useCases,
            supportInfo: [],
            existingBullets: result.bullets,
            languageInstruction,
          }),
          temperature: 0.7,
          maxTokens: 1000,
        });

        result.description = description;

        if (settings.amazonCompliance) {
          const compResult = checkCompliance(result.description);
          compResult.violations.forEach((v) => complianceWarnings.push("[Description] " + v));
          result.description = compResult.cleanedText;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        warnings.push("Description generation failed: " + errorMsg);
        const productType = facts.productType || "product";
        result.description =
          `The ${brand} ${productType} is designed for ${facts.useCases.slice(0, 2).join(" and ") || "daily use"}. ` +
          `Featuring ${facts.features.slice(0, 2).join(" and ") || "quality performance"}, it delivers consistent results. ` +
          `Built with ${facts.materials.join(", ") || "quality materials"} for lasting durability.`;
      }
    }

    // Step 6: Deduplication checks
    if (settings.strictDedupe && result.title && result.highlights && result.bullets && result.description) {
      const dedupeIssues = checkAllDuplicates(
        result.title,
        result.highlights,
        result.bullets,
        result.description
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
