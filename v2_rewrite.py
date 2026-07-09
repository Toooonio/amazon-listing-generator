import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

# Rewrite duplicateChecker.ts completely without template literals
path = os.path.join(base, "lib", "duplicateChecker.ts")

# Use string concatenation instead of template literals
content = (
    "export interface DuplicateCheckResult {\n"
    "  hasIssues: boolean;\n"
    "  issues: string[];\n"
    "}\n"
    "\n"
    "const STOP_WORDS = new Set([\n"
    '  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",\n'
    '  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",\n'
    '  "have", "has", "had", "do", "does", "did", "will", "would", "could",\n'
    '  "should", "may", "might", "can", "shall", "its", "it\'s", "your", "our",\n'
    '  "their", "this", "that", "these", "those", "from", "into", "about",\n'
    '  "than", "then", "also", "very", "just", "not", "no", "so",\n'
    "]);\n"
    "\n"
    "function getSignificantWords(text: string): string[] {\n"
    "  return text\n"
    '    .toLowerCase()\n'
    '    .replace(/[^a-z0-9\\s\'-]/g, "")\n'
    "    .split(/\\s+/)\n"
    '    .filter(function(w) { return w.length > 2 && !STOP_WORDS.has(w); });\n'
    "}\n"
    "\n"
    "export function checkDuplicateBetween(\n"
    "  sourceA: string,\n"
    "  sourceB: string,\n"
    "  labelA: string,\n"
    "  labelB: string\n"
    "): DuplicateCheckResult {\n"
    "  const issues: string[] = [];\n"
    "  const wordsA = getSignificantWords(sourceA);\n"
    "  const wordsB = getSignificantWords(sourceB);\n"
    "  const setB = new Set(wordsB);\n"
    '  const overlaps = wordsA.filter(function(w) { return setB.has(w); });\n'
    "  if (overlaps.length > 5) {\n"
    '    issues.push(labelA + " and " + labelB + " share " + overlaps.length + " significant words: \\"" + overlaps.slice(0, 5).join(", ") + "...\\"");\n'
    "  }\n"
    "  const combinedFreq: Map<string, number> = new Map();\n"
    '  const allWords = getSignificantWords(sourceA + " " + sourceB);\n'
    "  for (const w of allWords) {\n"
    "    combinedFreq.set(w, (combinedFreq.get(w) || 0) + 1);\n"
    "  }\n"
    "  for (const [word, count] of combinedFreq) {\n"
    "    if (count > 3) {\n"
    '      issues.push(\'Word "\' + word + \'" appears \' + count + \' times across \' + labelA + \' and \' + labelB);\n'
    "    }\n"
    "  }\n"
    "  return { hasIssues: issues.length > 0, issues };\n"
    "}\n"
    "\n"
    "export function checkAllDuplicates(\n"
    "  title?: string,\n"
    "  highlights?: string,\n"
    "  bullets?: string[],\n"
    "  description?: string\n"
    "): string[] {\n"
    "  const allIssues: string[] = [];\n"
    "  if (title && highlights) {\n"
    '    const result = checkDuplicateBetween(title, highlights, "Title", "Highlights");\n'
    "    for (const i of result.issues) allIssues.push(i);\n"
    "  }\n"
    "  if (title && bullets) {\n"
    "    for (let i = 0; i < bullets.length; i++) {\n"
    '      const result = checkDuplicateBetween(title, bullets[i], "Title", "Bullet " + (i + 1));\n'
    "      for (const j of result.issues) allIssues.push(j);\n"
    "    }\n"
    "  }\n"
    "  if (bullets && description) {\n"
    '    const allBullets = bullets.join(" ");\n'
    '    const result = checkDuplicateBetween(description, allBullets, "Description", "Bullets");\n'
    "    for (const i of result.issues) allIssues.push(i);\n"
    "  }\n"
    "  return allIssues;\n"
    "}\n"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Rewrote duplicateChecker.ts without template literals")
