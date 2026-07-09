import os

base = r"C:\Users\Dell\Documents\Codex\2026-07-08\listing-listing-1-75-125-2"

# Fix files with backtick issues by rewriting them cleanly

# 1. productInputTextarea.tsx
path = os.path.join(base, "components", "ProductInputTextarea.tsx")
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
# Check if it's valid by trying to write it back
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Checked: {path}")

# 2. generateBullets.ts
path = os.path.join(base, "lib", "generateBullets.ts")
content = '''import { ProductFacts, RankedSellingPoint } from "@/types";
import { filterForbiddenPhrases, cleanCopy } from "@/lib/amazonCompliance";

export function generateBullets(
  brand: string,
  targetLanguage: string,
  facts: ProductFacts,
  rankedPoints: RankedSellingPoint[],
  existingTitle?: string
): string[] {
  const bullets: string[] = [];

  // Bullet 1: Core performance / capacity
  if (facts.capacities.length > 0 || rankedPoints.length > 0) {
    const capText = facts.capacities.slice(0, 2).join(" / ");
    const perfFeature = facts.features.find(f => /\\d/.test(f)) || rankedPoints[0]?.text || "";
    bullets.push("RELIABLE PERFORMANCE: " + (perfFeature || "") + (capText ? ". " + capText : "") + ". Designed to deliver consistent results for daily use.");
  } else {
    bullets.push("EFFICIENT OPERATION: Built for reliable performance in everyday use with consistent output you can count on.");
  }

  // Bullet 2: Function experience / key feature
  const topFeatures = facts.features.filter(f => !/\\d/.test(f) || !facts.capacities.some(c => f.includes(c)));
  const funcFeature = topFeatures.length > 0 ? topFeatures[0] : "";
  const useCase = facts.useCases.length > 0 ? facts.useCases[0] : "";
  if (funcFeature || useCase) {
    let bullet2 = "EASY TO USE: " + (funcFeature || "");
    if (useCase) {
      bullet2 += ". Ideal for " + useCase.toLowerCase();
    }
    bullet2 += ". Simplifies your daily routine.";
    bullets.push(bullet2);
  } else {
    bullets.push("USER-FRIENDLY DESIGN: Simple operation with intuitive controls for a hassle-free experience every time.");
  }

  // Bullet 3: Design / portability / convenience
  const mat = facts.materials.length > 0 ? facts.materials[0] : "";
  const dim = facts.dimensions.length > 0 ? facts.dimensions[0] : "";
  if (mat || dim) {
    let bullet3 = "THOUGHTFUL DESIGN:";
    if (mat) {
      bullet3 += " Made with " + mat.toLowerCase();
    }
    if (dim) {
      bullet3 += ". Compact size: " + dim;
    }
    bullet3 += ". Built for convenient everyday use.";
    bullets.push(bullet3);
  } else {
    bullets.push("COMPACT & STYLISH: Space-saving design that fits seamlessly into any setting without compromising on functionality.");
  }

  // Bullet 4: Cleaning / smart / maintenance
  const cleanFeature = facts.features.find(f => /clean|wash|rinse|self-cleaning/i.test(f));
  if (cleanFeature) {
    bullets.push("EASY MAINTENANCE: " + cleanFeature + ". Saves you time on cleaning and upkeep.");
  } else {
    const cert = facts.certifications.length > 0 ? facts.certifications[0] : "";
    if (cert) {
      bullets.push("SAFE & CERTIFIED: " + cert + " certified. Meets rigorous quality and safety standards for peace of mind.");
    } else {
      bullets.push("LOW MAINTENANCE: Designed for easy care and cleaning, so you can spend less time on upkeep.");
    }
  }

  // Bullet 5: Quiet / materials / warranty
  const support = facts.supportInfo.length > 0 ? facts.supportInfo[0] : "";
  const certs = facts.certifications.slice(0, 2).join(", ");
  const finalMat = facts.materials.length > 1 ? facts.materials[1] : mat;
  if (support) {
    let bullet5 = "PEACE OF MIND: " + support + ".";
    if (certs) {
      bullet5 += " Certified: " + certs + ".";
    }
    bullet5 += " Built with " + (finalMat || "quality materials") + ".";
    bullets.push(bullet5);
  } else if (certs) {
    bullets.push("TRUSTED QUALITY: " + certs + ". Durable construction with " + (finalMat || "premium materials") + " for long-lasting use.");
  } else {
    const noiseFact = facts.features.find(f => /quiet|silent|noise|dB/i.test(f));
    if (noiseFact) {
      bullets.push("QUIET OPERATION: " + noiseFact + ". Enjoy a peaceful environment while the product runs.");
    } else {
      bullets.push("DURABLE QUALITY: " + ("Constructed with " + finalMat.lower() if finalMat else "Built with premium materials") + " for lasting performance and reliability.");
    }
  }

  return bullets.map(function(b) {
    let cleaned = filterForbiddenPhrases(b);
    cleaned = cleanCopy(cleaned);
    return cleaned;
  });
}
'''
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Fixed: {path}")

# 3. generateDescription.ts
path = os.path.join(base, "lib", "generateDescription.ts")
content = '''import { ProductFacts, RankedSellingPoint } from "@/types";
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
  }).join("\\n\\n");
}
'''
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Fixed: {path}")

print("Done fixing all files")
