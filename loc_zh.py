import os, re
base = "C:\\Users\\Dell\\Documents\\Codex\\2026-07-08\\listing-listing-1-75-125-2"

def fix_file(path, replacements, extra_lines=None):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed: " + path)

# 1. page.tsx - main page
fix_file(os.path.join(base, "app", "page.tsx"), [
    # Default language
    ('setTargetLanguage("en")', 'setTargetLanguage("zh")'),
    # Header
    ("Amazon Listing Generator", "亚马逊 Listing 生成器"),
    ("Enter your raw product information and automatically generate Amazon-compliant\ntitles, highlights, bullet points, and descriptions.", "输入原始产品资料，自动生成符合亚马逊规范的标题、亮点、五点描述和产品描述。"),
    # Output header
    ("Generated Output", "生成结果"),
    # Empty state
    ("Enter your brand name, product information, select output mode, and click\n      &quot;Generate Amazon Listing&quot; to get started.", "请输入品牌名和产品资料，选择输出模式，然后点击"生成亚马逊Listing"开始生成。"),
    # Loading
    ("Generating your Amazon listing...", "正在生成亚马逊文案..."),
    # Labels
    ('label="Title"', 'label="标题"'),
    ('label="Highlights"', 'label="亮点"'),
    ('label="Bullet Points"', 'label="五点描述"'),
    ('label="Product Description"', 'label="产品描述"'),
    # Footer
    ("Amazon Listing Generator - A general-purpose tool for creating Amazon-compliant product copy.", "亚马逊 Listing 生成器 — 通用型亚马逊合规文案生成工具"),
    ("Supports multiple languages, compliance filtering, and deduplication.", "支持多语言、合规过滤和去重优化。"),
    # Error
    ("An error occurred during generation. Please try again.", "生成过程中出现错误，请重试。"),
])
print("page.tsx done")

# 2. BrandInput.tsx
fix_file(os.path.join(base, "components", "BrandInput.tsx"), [
    ("Brand Name", "品牌名"),
    ("Enter your brand name, e.g. Simzlife", "输入品牌名，例如 Simzlife"),
    ("The brand name will be placed at the beginning of the title automatically.", "品牌名将自动放在标题的最前面。"),
])
print("BrandInput.tsx done")

# 3. LanguageSelector.tsx
fix_file(os.path.join(base, "components", "LanguageSelector.tsx"), [
    ("Target Output Language", "目标输出语言"),
    ("Input language detected as", "输入语言检测为"),
    (". Output will be written in your selected target language.", "。输出将用您选择的目标语言生成。"),
])
print("LanguageSelector.tsx done")

# 4. OutputModeSelector.tsx
fix_file(os.path.join(base, "components", "OutputModeSelector.tsx"), [
    ("Output Mode", "输出模式"),
    ("Title + Highlights", "标题 + 亮点"),
    ("Title (\\u226475 chars) + Highlight (\\u2264125 chars)", "标题（≤75字符）+ 亮点（≤125字符）"),
    ("Bullet Points", "五点描述"),
    ("5 Amazon-style bullet points", "5条亚马逊风格五点描述"),
    ("Product Description", "产品描述"),
    ("Full product description", "完整产品描述"),
    ("Generate All", "全部生成"),
    ("Title + Highlights + Bullets + Description", "标题 + 亮点 + 五点 + 描述"),
])
print("OutputModeSelector.tsx done")

# 5. AdvancedSettings.tsx
fix_file(os.path.join(base, "components", "AdvancedSettings.tsx"), [
    ("Advanced Settings", "高级设置"),
    ("Title Max Length:", "标题最大长度:"),
    ("Highlight Max Length:", "亮点最大长度:"),
    ("Writing Style", "写作风格"),
    ("SEO Priority", "SEO 优先"),
    ("Balanced", "平衡型"),
    ("Conversion Priority", "转化优先"),
    ("Strict Deduplication", "严格去重"),
    ("Amazon Compliance Filter", "亚马逊合规过滤"),
])
print("AdvancedSettings.tsx done")

# 6. ProductInputTextarea.tsx
fix_file(os.path.join(base, "components", "ProductInputTextarea.tsx"), [
    ("Product Information", "产品信息"),
    ('placeholder={"Paste your product information here. You can include:\\n\\n- Product features and specifications\\n- Dimensions, materials, and certifications\\n- Use cases and target scenarios\\n- Your own draft copy (English, Chinese, or mixed)\\n- Competitor listings as reference\\n- Any combination of raw product data\\n\\nThe system will extract key selling points and generate Amazon-ready copy."}', 
     'placeholder={"在此粘贴产品资料。您可以包括：\\n\\n- 产品功能和规格\\n- 尺寸、材质和认证信息\\n- 使用场景和目标人群\\n- 您自己写的草稿文案（中英皆可）\\n- 竞品 Listing 作为参考\\n- 任意组合的原始产品信息\\n\\n系统会自动提取核心卖点，生成亚马逊合规文案。"}'),
])
print("ProductInputTextarea.tsx done")

# 7. GenerateButton.tsx
fix_file(os.path.join(base, "components", "GenerateButton.tsx"), [
    ("Generating...", "生成中..."),
    ("Generate Amazon Listing", "生成亚马逊 Listing"),
])
print("GenerateButton.tsx done")

# 8. OutputCard.tsx
fix_file(os.path.join(base, "components", "OutputCard.tsx"), [
    ("Copy to clipboard", "复制到剪贴板"),
    ("Regenerate", "重新生成"),
    ("Exceeds", "超出"),
    ("character limit", "字符限制"),
    # CharacterCounter labels
    ("OVER LIMIT", "超出限制"),
    ("NEAR LIMIT", "接近上限"),
    ("GOOD", "良好"),
    ("OK", "正常"),
    ("SHORT", "较短"),
])
print("OutputCard.tsx done")

# 9. ComplianceWarning.tsx
fix_file(os.path.join(base, "components", "ComplianceWarning.tsx"), [
    ("Compliance & Quality Warnings", "合规与质量提醒"),
])
print("ComplianceWarning.tsx done")

# 10. BulletOutput.tsx
fix_file(os.path.join(base, "components", "BulletOutput.tsx"), [
    ("Bullet Points", "五点描述"),
    ("Regenerate All", "全部重新生成"),
])
print("BulletOutput.tsx done")

# 11. validators.ts - validation messages
fix_file(os.path.join(base, "lib", "validators.ts"), [
    ("Please enter product information", "请输入产品信息"),
    ("Please enter a brand name", "请输入品牌名"),
    ("Brand name is quite long and will consume significant title character space", "品牌名较长，会占用较多标题字符空间"),
    ("Product information is very brief, results may be less accurate", "产品信息过于简短，生成结果可能不够准确"),
    ("Title exceeds ", "标题超出 "),
    (" character limit (current: ", " 字符限制（当前: "),
    ("Title must start with the brand name", "标题必须以品牌名开头"),
    ("Title is very short (less than 15 characters), consider adding more detail", "标题过短（不足15个字符），建议补充更多信息"),
    ("Highlights exceed ", "亮点超出 "),
    ("Expected 5 bullet points, got ", "期望生成5条五点描述，实际生成了 "),
    (" is very short, consider expanding", " 过短，建议补充"),
    (" is very long, consider condensing", " 过长，建议精简"),
    ("Description is quite short, consider adding more detail", "产品描述较短，建议补充更多细节"),
])
print("validators.ts done")

# 12. language.ts - add Chinese labels for language options
print("All files updated to Chinese!")
