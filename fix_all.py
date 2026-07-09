import os
base = r"C:\Users\Dell\Documents\Codex\2026-07-08\listing-listing-1-75-125-2"

# 1. AdvancedSettings.tsx - rewrite cleanly
path = os.path.join(base, "components", "AdvancedSettings.tsx")
with open(path, "wb") as f:
    f.write((r"""\"use client\";

import { AdvancedSettings, WritingStyle } from "@/types";
import { Settings2 } from "lucide-react";
import { useState } from "react";

interface AdvancedSettingsProps {
  settings: AdvancedSettings;
  onChange: (settings: AdvancedSettings) => void;
}

export default function AdvancedSettingsPanel({ settings, onChange }: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);

  const update = (partial: Partial<AdvancedSettings>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div>
      <button
        className="flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: "var(--text-secondary)" }}
        onClick={() => setOpen(!open)}
      >
        <Settings2 size={16} />
        Advanced Settings
        <span className="ml-1">{open ? "\u25b2" : "\u25bc"}</span>
      </button>

      {open && (
        <div className="mt-3 p-4 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Title Max Length: {settings.titleMaxLength}
              </label>
              <input
                type="range"
                min={50}
                max={200}
                value={settings.titleMaxLength}
                onChange={(e) => update({ titleMaxLength: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Highlight Max Length: {settings.highlightMaxLength}
              </label>
              <input
                type="range"
                min={80}
                max={250}
                value={settings.highlightMaxLength}
                onChange={(e) => update({ highlightMaxLength: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                Writing Style
              </label>
              <select
                className="select-field"
                value={settings.writingStyle}
                onChange={(e) => update({ writingStyle: e.target.value as WritingStyle })}
              >
                <option value="seo">SEO Priority</option>
                <option value="balanced">Balanced</option>
                <option value="conversion">Conversion Priority</option>
              </select>
            </div>

            <div className="flex items-start gap-4 pt-5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.strictDedupe}
                  onChange={(e) => update({ strictDedupe: e.target.checked })}
                  className="rounded"
                />
                Strict Deduplication
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.amazonCompliance}
                  onChange={(e) => update({ amazonCompliance: e.target.checked })}
                  className="rounded"
                />
                Amazon Compliance Filter
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
""").encode("utf-8"))
print("Fixed AdvancedSettings.tsx")

# 2. OutputModeSelector.tsx - rewrite
path = os.path.join(base, "components", "OutputModeSelector.tsx")
with open(path, "wb") as f:
    f.write((r"""\"use client\";

import { OutputMode } from "@/types";

interface OutputModeSelectorProps {
  value: OutputMode;
  onChange: (value: OutputMode) => void;
}

const modes: { value: OutputMode; label: string; description: string }[] = [
  { value: "title-highlights", label: "Title + Highlights", description: "Title (\u226475 chars) + Highlight (\u2264125 chars)" },
  { value: "bullets", label: "Bullet Points", description: "5 Amazon-style bullet points" },
  { value: "description", label: "Product Description", description: "Full product description" },
  { value: "all", label: "Generate All", description: "Title + Highlights + Bullets + Description" },
];

export default function OutputModeSelector({ value, onChange }: OutputModeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        Output Mode
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {modes.map((mode) => (
          <button
            key={mode.value}
            className="text-left p-3 rounded-lg border text-sm transition-all"
            style={{
              background: value === mode.value ? "var(--accent)" : "var(--bg-secondary)",
              borderColor: value === mode.value ? "var(--accent)" : "var(--border)",
              color: value === mode.value ? "#fff" : "var(--text-primary)",
            }}
            onClick={() => onChange(mode.value)}
          >
            <div className="font-medium">{mode.label}</div>
            <div className="text-xs mt-0.5 opacity-80">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
""").encode("utf-8"))
print("Fixed OutputModeSelector.tsx")

# 3. ProductInputTextarea.tsx - rewrite
path = os.path.join(base, "components", "ProductInputTextarea.tsx")
with open(path, "wb") as f:
    f.write((r"""\"use client\";

interface ProductInputTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductInputTextarea({ value, onChange }: ProductInputTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        Product Information
      </label>
      <textarea
        className="textarea-field font-mono text-sm"
        rows={10}
        placeholder={"Paste your product information here. You can include:\n\n- Product features and specifications\n- Dimensions, materials, and certifications\n- Use cases and target scenarios\n- Your own draft copy (English, Chinese, or mixed)\n- Competitor listings as reference\n- Any combination of raw product data\n\nThe system will extract key selling points and generate Amazon-ready copy."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
""").encode("utf-8"))
print("Fixed ProductInputTextarea.tsx")

# 4. validators.ts - rewrite
path = os.path.join(base, "lib", "validators.ts")
with open(path, "wb") as f:
    f.write((r"""import { GeneratedOutput, ValidationResult } from "@/types";

export function validateOutput(
  output: GeneratedOutput,
  brand: string,
  titleMaxLength: number,
  highlightMaxLength: number,
  shouldHaveTitle: boolean,
  shouldHaveHighlights: boolean,
  shouldHaveBullets: boolean,
  shouldHaveDescription: boolean
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (shouldHaveTitle && output.title) {
    if (output.title.length > titleMaxLength) {
      const msg = "Title exceeds " + titleMaxLength + " character limit (current: " + output.title.length + ")";
      errors.push(msg);
    }
    if (!output.title.startsWith(brand)) {
      errors.push("Title must start with the brand name");
    }
    if (output.title.length < 15) {
      warnings.push("Title is very short (less than 15 characters), consider adding more detail");
    }
  }

  if (shouldHaveHighlights && output.highlights) {
    if (output.highlights.length > highlightMaxLength) {
      const msg = "Highlights exceed " + highlightMaxLength + " character limit (current: " + output.highlights.length + ")";
      errors.push(msg);
    }
  }

  if (shouldHaveBullets && output.bullets) {
    if (output.bullets.length !== 5) {
      const msg = "Expected 5 bullet points, got " + output.bullets.length;
      errors.push(msg);
    }
    output.bullets.forEach(function(b, i) {
      if (b.length < 30) {
        warnings.push("Bullet " + (i + 1) + " is very short, consider expanding");
      }
      if (b.length > 500) {
        warnings.push("Bullet " + (i + 1) + " is very long, consider condensing");
      }
    });
  }

  if (shouldHaveDescription && output.description) {
    if (output.description.length < 100) {
      warnings.push("Description is quite short, consider adding more detail");
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateInput(rawText: string, brand: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawText.trim()) {
    errors.push("Please enter product information");
  }

  if (!brand.trim()) {
    errors.push("Please enter a brand name");
  }

  if (brand.length > 30) {
    warnings.push("Brand name is quite long and will consume significant title character space");
  }

  if (rawText.trim().length < 20) {
    warnings.push("Product information is very brief, results may be less accurate");
  }

  return { valid: errors.length === 0, errors, warnings };
}
""").encode("utf-8"))
print("Fixed validators.ts")

# 5. generateBullets.ts - fix the syntax error in bullet 5
path = os.path.join(base, "lib", "generateBullets.ts")
with open(path, "wb") as f:
    f.write((r"""import { ProductFacts, RankedSellingPoint } from "@/types";
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
""").encode("utf-8"))
print("Fixed generateBullets.ts")

print("All files fixed successfully")
