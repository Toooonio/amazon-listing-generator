import os, re
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

# Fix 1: page.tsx - make regenerate functions async
path = os.path.join(base, "app", "page.tsx")
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix regenerate functions
content = content.replace(
    "const regenerateTitle = useCallback(() => {",
    "const regenerateTitle = useCallback(async () => {"
)
content = content.replace(
    "const regenerateHighlights = useCallback(() => {",
    "const regenerateHighlights = useCallback(async () => {"
)
content = content.replace(
    "const regenerateBullets = useCallback(() => {",
    "const regenerateBullets = useCallback(async () => {"
)
content = content.replace(
    "const regenerateDescription = useCallback(() => {",
    "const regenerateDescription = useCallback(async () => {"
)

# Also need to fix the indentation of the await lines
# Some lines have 6 spaces indent instead of 8 (due to previous fix removing setTimeout wrapper)
content = content.replace(
    "      const genResult = await generateAmazonCopy({",  # 6 spaces
    "        const genResult = await generateAmazonCopy({"  # 8 spaces
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed page.tsx regenerate functions")

# Fix 2: duplicateChecker.ts - fix template literal \$ issue
path2 = os.path.join(base, "lib", "duplicateChecker.ts")
with open(path2, "rb") as f:
    data = f.read()

# Replace \$ with $ in template literal contexts
# The issue is \${variable} inside template literals
# It should be ${variable}
import re
fixed = data.replace(b"\\${", b"${")

with open(path2, "wb") as f:
    f.write(fixed)
print("Fixed duplicateChecker.ts")

print("Done")
