import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"
path = os.path.join(base, "lib", "duplicateChecker.ts")

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Replace for...of over Map with forEach
old_for = """  for (const [word, count] of combinedFreq) {
    if (count > 3) {
      issues.push('Word "' + word + '" appears ' + count + ' times across ' + labelA + ' and ' + labelB);
    }
  }"""

new_for = """  combinedFreq.forEach(function(count, word) {
    if (count > 3) {
      issues.push('Word "' + word + '" appears ' + count + ' times across ' + labelA + ' and ' + labelB);
    }
  });"""

if old_for in content:
    content = content.replace(old_for, new_for)
    print("Fixed Map iteration")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done fixing duplicateChecker.ts")
