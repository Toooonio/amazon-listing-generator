import os

base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

def do_replace(filepath, pairs):
    path = os.path.join(base, filepath)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in pairs:
        content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated:", filepath)

# page.tsx
do_replace("app/page.tsx", [
    ('setTargetLanguage("en")', 'setTargetLanguage("zh")'),
])

# BrandInput
do_replace("components/BrandInput.tsx", [
    ("Brand Name", "\u54c1\u724c\u540d"),
])

# GenerateButton
do_replace("components/GenerateButton.tsx", [
    ("Generate Amazon Listing", "\u751f\u6210\u4e9a\u9a6c\u900a Listing"),
    ("Generating...", "\u751f\u6210\u4e2d..."),
])

print("Test run successful")
