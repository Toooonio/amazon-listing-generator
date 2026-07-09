import { ProductFacts, RankedSellingPoint } from "@/types";
import { filterForbiddenPhrases, cleanCopy } from "@/lib/amazonCompliance";

export function generateDescription(
  brand: string,
  targetLanguage: string,
  facts: ProductFacts,
  rankedPoints: RankedSellingPoint[],
  existingBullets?: string[]
): string {
  const paragraphs: string[] = [];

  // Paragraph 1: Overall value proposition + core use case
  const category = facts.category || "product";
  const useCases = facts.useCases.length > 0 ? facts.useCases.slice(0, 2).join(" and ") : "daily use";
  const topFeat = rankedPoints.slice(0, 2).map(p => p.text).join(" ");
  let para1 = "The " + brand + " " + category + " is designed to deliver exceptional value for " + useCases + ".";
  if (topFeat) {
    para1 += " With " + topFeat + ", this " + category + " stands out as a reliable choice.";
  } else {
    para1 += " Built with quality and convenience in mind, it offers everything you need for a better experience.";
  }
  paragraphs.push(para1);

  // Paragraph 2: Core parameters + daily use benefits
  const capacities = facts.capacities.length > 0 ? facts.capacities.slice(0, 2).join(" and ") : "";
  const specFeature = facts.features.slice(0, 2).join(". ");
  if (capacities || specFeature) {
    let para2 = "";
    if (capacities) {
      para2 += "Featuring a generous capacity of " + capacities + ", ";
    }
    if (specFeature) {
      para2 += "the " + category + " " + specFeature + ".";
    } else {
      para2 = para2.replace(/, $/, "") + ".";
    }
    para2 += " Whether you are preparing for a small gathering or everyday use, this product delivers consistent and satisfying results.";
    paragraphs.push(para2);
  } else {
    paragraphs.push("Whether for daily use or special occasions, this product delivers consistent and reliable performance you can count on.");
  }

  // Paragraph 3: Convenience features
  const convenienceFeats = facts.features.filter(function(f) {
    return /easy|quick|fast|portable|compact|lightweight|adjustable|flexible|simple|convenient/i.test(f);
  });
  const materials = facts.materials.length > 0 ? facts.materials.slice(0, 2).join(" and ") : "quality materials";
  if (convenienceFeats.length > 0) {
    let para3 = "Designed with your convenience in mind, " + convenienceFeats.slice(0, 2).join(", ") + ".";
    para3 += " Constructed from " + materials + " for durability and long-lasting performance.";
    paragraphs.push(para3);
  } else {
    let para3 = "Designed for effortless use, this " + category + " puts convenience first.";
    para3 += " Made from " + materials + ", it is built to last.";
    para3 += " The thoughtful design ensures a smooth experience every time.";
    paragraphs.push(para3);
  }

  // Paragraph 4: Trust / certifications / warranty
  const certs = facts.certifications.length > 0 ? facts.certifications.slice(0, 3).join(", ") : "";
  const support = facts.supportInfo.length > 0 ? facts.supportInfo[0] : "";
  if (certs || support) {
    let para4 = "";
    if (certs) {
      para4 += "Certified with " + certs + " for your safety and peace of mind. ";
    }
    if (support) {
      para4 += brand + " offers " + support + ".";
    }
    if (!para4.endsWith(".")) {
      para4 += " Trust in a product designed with your satisfaction as the top priority.";
    }
    paragraphs.push(para4);
  }

  // Apply compliance
  return paragraphs.map(function(p) {
    return cleanCopy(filterForbiddenPhrases(p));
  }).join("\n\n");
}
