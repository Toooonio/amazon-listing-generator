import os

base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

def fix(filepath, pairs):
    path = os.path.join(base, filepath)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in pairs:
        content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated:", filepath)

# ============ app/page.tsx ============
fix("app/page.tsx", [
    ('setTargetLanguage("en")', 'setTargetLanguage("zh")'),
    ("Amazon Listing Generator", "\u4e9a\u9a6c\u900a Listing \u751f\u6210\u5668"),
    ("Generated Output", "\u751f\u6210\u7ed3\u679c"),
    ("Enter your raw product information and automatically generate Amazon-compliant\ntitles, highlights, bullet points, and descriptions.",
     "\u8f93\u5165\u539f\u59cb\u4ea7\u54c1\u8d44\u6599\uff0c\u81ea\u52a8\u751f\u6210\u7b26\u5408\u4e9a\u9a6c\u900a\u89c4\u8303\u7684\u6807\u9898\u3001\u4eae\u70b9\u3001\u4e94\u70b9\u63cf\u8ff0\u548c\u4ea7\u54c1\u63cf\u8ff0\u3002"),
    ("Enter your brand name, product information, select output mode, and click\n      &quot;Generate Amazon Listing&quot; to get started.",
     "\u8bf7\u8f93\u5165\u54c1\u724c\u540d\u548c\u4ea7\u54c1\u8d44\u6599\uff0c\u9009\u62e9\u8f93\u51fa\u6a21\u5f0f\uff0c\u7136\u540e\u70b9\u51fb\u201c\u751f\u6210\u4e9a\u9a6c\u900a Listing\u201d\u5f00\u59cb\u751f\u6210\u3002"),
    ("Generating your Amazon listing...", "\u6b63\u5728\u751f\u6210\u4e9a\u9a6c\u900a\u6587\u6848..."),
    ('label="Title"', 'label="\u6807\u9898"'),
    ('label="Highlights"', 'label="\u4eae\u70b9"'),
    ('label="Bullet Points"', 'label="\u4e94\u70b9\u63cf\u8ff0"'),
    ('label="Product Description"', 'label="\u4ea7\u54c1\u63cf\u8ff0"'),
    ("Amazon Listing Generator - A general-purpose tool for creating Amazon-compliant product copy.",
     "\u4e9a\u9a6c\u900a Listing \u751f\u6210\u5668 \u2014 \u901a\u7528\u578b\u4e9a\u9a6c\u900a\u5408\u89c4\u6587\u6848\u751f\u6210\u5de5\u5177"),
    ("Supports multiple languages, compliance filtering, and deduplication.",
     "\u652f\u6301\u591a\u8bed\u8a00\u3001\u5408\u89c4\u8fc7\u6ee4\u548c\u53bb\u91cd\u4f18\u5316\u3002"),
    ("An error occurred during generation. Please try again.",
     "\u751f\u6210\u8fc7\u7a0b\u4e2d\u51fa\u73b0\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002"),
])

# ============ components/BrandInput.tsx ============
fix("components/BrandInput.tsx", [
    ("Brand Name", "\u54c1\u724c\u540d"),
    ("Enter your brand name, e.g. Simzlife",
     "\u8f93\u5165\u54c1\u724c\u540d\uff0c\u4f8b\u5982 Simzlife"),
    ("The brand name will be placed at the beginning of the title automatically.",
     "\u54c1\u724c\u540d\u5c06\u81ea\u52a8\u653e\u5728\u6807\u9898\u7684\u6700\u524d\u9762\u3002"),
])

# ============ components/LanguageSelector.tsx ============
fix("components/LanguageSelector.tsx", [
    ("Target Output Language", "\u76ee\u6807\u8f93\u51fa\u8bed\u8a00"),
    ("Input language detected as", "\u8f93\u5165\u8bed\u8a00\u68c0\u6d4b\u4e3a"),
    (". Output will be written in your selected target language.",
     "\u3002\u8f93\u51fa\u5c06\u7528\u60a8\u9009\u62e9\u7684\u76ee\u6807\u8bed\u8a00\u751f\u6210\u3002"),
])

# ============ components/OutputModeSelector.tsx ============
fix("components/OutputModeSelector.tsx", [
    ("Output Mode", "\u8f93\u51fa\u6a21\u5f0f"),
    ("Title + Highlights", "\u6807\u9898 + \u4eae\u70b9"),
    ("5 Amazon-style bullet points", "5\u6761\u4e9a\u9a6c\u900a\u98ce\u683c\u4e94\u70b9\u63cf\u8ff0"),
    ("Full product description", "\u5b8c\u6574\u4ea7\u54c1\u63cf\u8ff0"),
    ("Generate All", "\u5168\u90e8\u751f\u6210"),
    ("Title + Highlights + Bullets + Description",
     "\u6807\u9898 + \u4eae\u70b9 + \u4e94\u70b9 + \u63cf\u8ff0"),
])

# ============ components/AdvancedSettings.tsx ============
fix("components/AdvancedSettings.tsx", [
    ("Advanced Settings", "\u9ad8\u7ea7\u8bbe\u7f6e"),
    ("Title Max Length:", "\u6807\u9898\u6700\u5927\u957f\u5ea6:"),
    ("Highlight Max Length:", "\u4eae\u70b9\u6700\u5927\u957f\u5ea6:"),
    ("Writing Style", "\u5199\u4f5c\u98ce\u683c"),
    ("SEO Priority", "SEO \u4f18\u5148"),
    ("Balanced", "\u5e73\u8861\u578b"),
    ("Conversion Priority", "\u8f6c\u5316\u4f18\u5148"),
    ("Strict Deduplication", "\u4e25\u683c\u53bb\u91cd"),
    ("Amazon Compliance Filter", "\u4e9a\u9a6c\u900a\u5408\u89c4\u8fc7\u6ee4"),
])

# ============ components/ProductInputTextarea.tsx ============
fix("components/ProductInputTextarea.tsx", [
    ("Product Information", "\u4ea7\u54c1\u4fe1\u606f"),
])

# ============ components/GenerateButton.tsx ============
fix("components/GenerateButton.tsx", [
    ("Generate Amazon Listing", "\u751f\u6210\u4e9a\u9a6c\u900a Listing"),
    ("Generating...", "\u751f\u6210\u4e2d..."),
])

# ============ components/OutputCard.tsx ============
fix("components/OutputCard.tsx", [
    ("Copy to clipboard", "\u590d\u5236\u5230\u526a\u8d34\u677f"),
    ("Regenerate", "\u91cd\u65b0\u751f\u6210"),
    ("Exceeds", "\u8d85\u51fa"),
    ("character limit", "\u5b57\u7b26\u9650\u5236"),
    ("OVER LIMIT", "\u8d85\u51fa\u9650\u5236"),
    ("NEAR LIMIT", "\u63a5\u8fd1\u4e0a\u9650"),
    ("GOOD", "\u826f\u597d"),
    ("OK", "\u6b63\u5e38"),
    ("SHORT", "\u8f83\u77ed"),
])

# ============ components/ComplianceWarning.tsx ============
fix("components/ComplianceWarning.tsx", [
    ("Compliance & Quality Warnings", "\u5408\u89c4\u4e0e\u8d28\u91cf\u63d0\u9192"),
])

# ============ components/BulletOutput.tsx ============
fix("components/BulletOutput.tsx", [
    ("Bullet Points", "\u4e94\u70b9\u63cf\u8ff0"),
    ("Regenerate All", "\u5168\u90e8\u91cd\u65b0\u751f\u6210"),
])

# ============ lib/validators.ts ============
fix("lib/validators.ts", [
    ("Please enter product information", "\u8bf7\u8f93\u5165\u4ea7\u54c1\u4fe1\u606f"),
    ("Please enter a brand name", "\u8bf7\u8f93\u5165\u54c1\u724c\u540d"),
    ("Brand name is quite long and will consume significant title character space",
     "\u54c1\u724c\u540d\u8f83\u957f\uff0c\u4f1a\u5360\u7528\u8f83\u591a\u6807\u9898\u5b57\u7b26\u7a7a\u95f4"),
    ("Product information is very brief, results may be less accurate",
     "\u4ea7\u54c1\u4fe1\u606f\u8fc7\u4e8e\u7b80\u77ed\uff0c\u751f\u6210\u7ed3\u679c\u53ef\u80fd\u4e0d\u591f\u51c6\u786e"),
    ("Title exceeds ", "\u6807\u9898\u8d85\u51fa "),
    (" character limit (current: ", " \u5b57\u7b26\u9650\u5236\uff08\u5f53\u524d: "),
    ("Title must start with the brand name", "\u6807\u9898\u5fc5\u987b\u4ee5\u54c1\u724c\u540d\u5f00\u5934"),
    ("Title is very short (less than 15 characters), consider adding more detail",
     "\u6807\u9898\u8fc7\u77ed\uff08\u4e0d\u8db315\u4e2a\u5b57\u7b26\uff09\uff0c\u5efa\u8bae\u8865\u5145\u66f4\u591a\u4fe1\u606f"),
    ("Highlights exceed ", "\u4eae\u70b9\u8d85\u51fa "),
    ("Expected 5 bullet points, got ", "\u671f\u671b\u751f\u62105\u6761\u4e94\u70b9\u63cf\u8ff0\uff0c\u5b9e\u9645\u751f\u6210\u4e86 "),
    (" is very short, consider expanding", " \u8fc7\u77ed\uff0c\u5efa\u8bae\u8865\u5145"),
    (" is very long, consider condensing", " \u8fc7\u957f\uff0c\u5efa\u8bae\u7cbe\u7b80"),
    ("Description is quite short, consider adding more detail",
     "\u4ea7\u54c1\u63cf\u8ff0\u8f83\u77ed\uff0c\u5efa\u8bae\u8865\u5145\u66f4\u591a\u7ec6\u8282"),
])

print("All files localized to Chinese successfully!")
