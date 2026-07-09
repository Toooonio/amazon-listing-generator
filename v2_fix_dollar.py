import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

files = [
    "lib/compliance.ts",
    "lib/duplicateChecker.ts",  # already partially fixed
    "lib/factExtractor.ts",
    "lib/languageProcessor.ts",
]

for fname in files:
    path = os.path.join(base, fname)
    with open(path, "rb") as f:
        data = f.read()
    
    # Fix: replace \$ with $ (backslash-dollar with just dollar)
    # This is needed for template literals: \${var} -> ${var}
    fixed = data.replace(b"\\${", b"${")
    
    if fixed != data:
        count = data.count(b"\\${")
        with open(path, "wb") as f:
            f.write(fixed)
        print(f"Fixed {fname}: {count} occurrences of \\$")
    else:
        print(f"OK {fname}: no issues")

print("Done")
