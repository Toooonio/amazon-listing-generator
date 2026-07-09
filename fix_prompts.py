import os
base = "C:\\Users\\Dell\\Documents\\Codex\\2026-07-08\\listing-listing-1-75-125-2"

# Read each prompt file, check for backtick issues, fix them
files = ["titlePrompt.ts", "highlightPrompt.ts", "bulletsPrompt.ts", "descriptionPrompt.ts"]

for fname in files:
    path = os.path.join(base, "prompts", fname)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if file contains backticks from template literals  
    if "" in content:
        # The file has template literals that were mangled. Rewrite without template literals.
        print(f"File {fname} has template literals - manual fix needed")
        continue
    
    print(f"File {fname} looks ok")

print("Checked all prompt files")
