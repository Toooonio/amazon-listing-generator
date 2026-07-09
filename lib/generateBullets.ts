import { ProductFacts, RankedSellingPoint } from "@/types";
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
    const perfFeature = facts.features.find(function(f) { return /\d/.test(f); }) || (rankedPoints[0]?.text || "");
    bullets.push("RELIABLE PERFORMANCE: " + (perfFeature || "") + (capText ? ". " + capText : "") + ". Designed to deliver consistent results for daily use.");
  } else {
    bullets.push("EFFICIENT OPERATION: Built for reliable performance in everyday use with consistent output you can count on.");
  }

  // Bullet 2: Function experience / key feature
  const topFeatures = facts.features.filter(function(f) { return !/\d/.test(f) || !facts.capacities.some(function(c) { return f.includes(c); }); });
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
  const cleanFeature = facts.features.find(function(f) { return /clean|wash|rinse|self-cleaning/i.test(f); });
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
    const noiseFact = facts.features.find(function(f) { return /quiet|silent|noise|dB/i.test(f); });
    if (noiseFact) {
      bullets.push("QUIET OPERATION: " + noiseFact + ". Enjoy a peaceful environment while the product runs.");
    } else {
      const matText = finalMat ? "Constructed with " + finalMat.toLowerCase() : "Built with premium materials";
      bullets.push("DURABLE QUALITY: " + matText + " for lasting performance and reliability.");
    }
  }

  return bullets.map(function(b) {
    let cleaned = filterForbiddenPhrases(b);
    cleaned = cleanCopy(cleaned);
    return cleaned;
  });
}
