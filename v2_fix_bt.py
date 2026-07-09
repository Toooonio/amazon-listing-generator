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
        print(f"Skipping {fname}")
        continue
    
    with open(path, "rb") as f:
        data = f.read()
    
    # Replace \` with ` (backslash-backtick with backtick)
    # In bytes: \x5c\x60 -> \x60
    fixed = data.replace(b"\x5c\x60", b"\x60")
    
    if fixed != data:
        with open(path, "wb") as f:
            f.write(fixed)
        changed = len(data) - len(fixed)
        print(f"Fixed {fname}: {data.count(b'\x5c\x60')} -> {fixed.count(b'\x5c\x60')} occurrences")
    else:
        print(f"OK {fname}: no changes needed")

print("Done fixing backtick escaping")
