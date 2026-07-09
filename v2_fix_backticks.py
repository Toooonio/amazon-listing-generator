import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

files = [
    "lib/factExtractor.ts",
    "lib/languageProcessor.ts",
    "lib/compliance.ts",
    "lib/duplicateChecker.ts",
    "prompts/titlePrompt.ts",
    "prompts/highlightPrompt.ts",
    "prompts/bulletPrompt.ts",
    "prompts/descriptionPrompt.ts",
    "app/api/generate/route.ts",
]

for fname in files:
    path = os.path.join(base, fname)
    if not os.path.exists(path):
        print(f"Skipping {fname} - not found")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if file has backtick characters
    has_backtick = "`" in content
    has_backslash = "\\" in content
    
    if not has_backtick and has_backslash:
        # The content has backslashes but no backticks
        # The template literals were written as \` (backslash-backtick)
        # but since PowerShell mangled them, let's see what we got
        print(f"Fixing: {fname}")
        
        # Replace the pattern: $ followed by {variable} inside a template literal
        # The issue is that raw Python strings treat \` as literal backslash-backtick
        # So we need to convert those to proper backtick
        
        # First, let's see what's actually in the file around template literal areas
        for marker in ["return \\", "Target Language", "${", "`Attach", "`Generate"]:
            idx = content.find(marker)
            if idx >= 0:
                context = content[max(0,idx-10):idx+30]
                print(f"  Found pattern at {idx}: {repr(context)}")
        
        # The fix: replace \` with `
        # But only in specific patterns (not general backslashes)
        fixed = content.replace("\\`", "`")
        with open(path, "w", encoding="utf-8") as f:
            f.write(fixed)
        print(f"  -> Fixed backtick escaping")
    elif has_backtick:
        print(f"OK: {fname} - has proper backticks")
    else:
        print(f"OK: {fname} - no template literals")

print("Done checking files")
