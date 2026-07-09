import { GeneratedOutput, ValidationResult } from "@/types";

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
      const msg = "标题超出 " + titleMaxLength + " 字符限制（当前: " + output.title.length + ")";
      errors.push(msg);
    }
    if (!output.title.startsWith(brand)) {
      errors.push("标题必须以品牌名开头");
    }
    if (output.title.length < 15) {
      warnings.push("标题过短（不足15个字符），建议补充更多信息");
    }
  }

  if (shouldHaveHighlights && output.highlights) {
    if (output.highlights.length > highlightMaxLength) {
      const msg = "亮点超出 " + highlightMaxLength + " 字符限制（当前: " + output.highlights.length + ")";
      errors.push(msg);
    }
  }

  if (shouldHaveBullets && output.bullets) {
    if (output.bullets.length !== 5) {
      const msg = "期望生成5条五点描述，实际生成了 " + output.bullets.length;
      errors.push(msg);
    }
    output.bullets.forEach(function(b, i) {
      if (b.length < 30) {
        warnings.push("Bullet " + (i + 1) + " 过短，建议补充");
      }
      if (b.length > 500) {
        warnings.push("Bullet " + (i + 1) + " 过长，建议精简");
      }
    });
  }

  if (shouldHaveDescription && output.description) {
    if (output.description.length < 100) {
      warnings.push("产品描述较短，建议补充更多细节");
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateInput(rawText: string, brand: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawText.trim()) {
    errors.push("请输入产品信息");
  }

  if (!brand.trim()) {
    errors.push("请输入品牌名");
  }

  if (brand.length > 30) {
    warnings.push("品牌名较长，会占用较多标题字符空间");
  }

  if (rawText.trim().length < 20) {
    warnings.push("产品信息过于简短，生成结果可能不够准确");
  }

  return { valid: errors.length === 0, errors, warnings };
}
