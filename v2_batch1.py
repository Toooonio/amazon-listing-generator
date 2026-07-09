import os
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

def w(fname, content):
    path = os.path.join(base, fname)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {fname}")

# 1. .env.local
w(".env.local", "OPENAI_API_KEY=your_api_key_here\n")

# 2. lib/openai.ts
w("lib/openai.ts", '''import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export interface OpenAICallOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function callOpenAI(options: OpenAICallOptions): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    model = "gpt-4o-mini",
    maxTokens = 1024,
    temperature = 0.7,
  } = options;

  const openai = getClient();

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature,
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  return content;
}

export async function callOpenAIJSON<T>(
  options: OpenAICallOptions
): Promise<T> {
  const text = await callOpenAI({
    ...options,
    temperature: options.temperature ?? 0.3,
  });

  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as T;
  }

  throw new Error("Failed to parse JSON from OpenAI response");
}
''')

# 3. lib/factExtractor.ts
w("lib/factExtractor.ts", '''export interface ExtractedFacts {
  productType: string;
  mainKeyword: string;
  features: string[];
  specifications: string[];
  materials: string[];
  certifications: string[];
  useCases: string[];
  targetCustomer: string[];
}

export function buildExtractionPrompt(rawText: string, detectedLanguage: string): string {
  return \`Extract structured product information from the text below.

Input text:
"""${rawText}"""

Return a JSON object with EXACTLY these fields:
{
  "productType": "the core product category (e.g. Nugget Ice Maker, Blender, Pet Bed)",
  "mainKeyword": "the single most important search keyword for Amazon",
  "features": ["list", "of", "key", "features"],
  "specifications": ["measurable specs like capacity, dimensions, power, weight"],
  "materials": ["materials used"],
  "certifications": ["certifications like ETL, FCC, CE, RoHS"],
  "useCases": ["usage scenarios like home, office, travel"],
  "targetCustomer": ["target audience descriptions"]
}

Rules:
- Only include information that is explicitly stated or directly implied in the text.
- Do not fabricate or guess details.
- If a field has no relevant information, return an empty array [].
- The input language is: ${detectedLanguage}
- Output JSON only, no markdown, no extra text.\`;
}

export function extractFactsWithAI(
  rawText: string,
  brand: string,
  detectedLanguage: string
): ExtractedFacts {
  // Client-side placeholder - actual AI extraction happens server-side
  // This function signature is kept for compatibility
  return {
    productType: "",
    mainKeyword: "",
    features: [],
    specifications: [],
    materials: [],
    certifications: [],
    useCases: [],
    targetCustomer: [],
  };
}
''')

# 4. lib/languageProcessor.ts
w("lib/languageProcessor.ts", '''export interface LanguageInstruction {
  code: string;
  name: string;
  amazonSite: string;
  writingGuide: string;
}

const languageMap: Record<string, LanguageInstruction> = {
  en: {
    code: "en",
    name: "English",
    amazonSite: "Amazon.com (US)",
    writingGuide: "Write in natural American English. Follow Amazon US listing conventions. Use persuasive but factual copy. Avoid British spellings.",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    amazonSite: "Amazon Japan / Global",
    writingGuide: "Use Simplified Chinese. Write in a clear, benefit-oriented style. Use Amazon marketplace conventions for Chinese-language buyers.",
  },
  de: {
    code: "de",
    name: "German",
    amazonSite: "Amazon.de",
    writingGuide: "Use proper German with correct capitalization of nouns and verb position. German Amazon listings tend to be factual, detailed, and technical.",
  },
  fr: {
    code: "fr",
    name: "French",
    amazonSite: "Amazon.fr",
    writingGuide: "Use natural French with proper grammar. French listings are often more descriptive and lifestyle-oriented.",
  },
  es: {
    code: "es",
    name: "Spanish",
    amazonSite: "Amazon.es",
    writingGuide: "Use neutral Spanish. Spanish listings tend to be benefit-driven and warm in tone.",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    amazonSite: "Amazon.co.jp",
    writingGuide: "Use natural Japanese with appropriate politeness. Japanese Amazon listings should be detailed, precise, and trust-oriented.",
  },
};

export function getLanguageInstruction(code: string): LanguageInstruction {
  return languageMap[code] || languageMap.en;
}

export function buildLanguageInstruction(code: string): string {
  const inst = getLanguageInstruction(code);
  return \`Target Language: ${inst.name}
Target Marketplace: ${inst.amazonSite}
Writing Guide: ${inst.writingGuide}

IMPORTANT: This is NOT a translation task. Do NOT translate the input. You must generate native Amazon listing copy directly in ${inst.name} following the marketplace conventions above.\`;
}

export function getAmazonSite(code: string): string {
  return getLanguageInstruction(code).amazonSite;
}
''')

# 5. lib/compliance.ts
w("lib/compliance.ts", '''const FORBIDDEN_TERMS = [
  "best", "perfect", "no.1", "no. 1", "top-rated", "top rated",
  "guaranteed", "100% safe", "100%",
  "the most powerful", "the best",
  "must-have", "must have", "buy now", "don't miss out",
  "wow your guests", "life-changing", "game-changing",
  "better than all competitors", "more powerful than others",
  "best on amazon", "best on the market",
  "cure", "treat", "prevent", "diagnose", "heal",
  "therapeutic", "medical grade",
];

const SENSITIVE_COMPARISONS = [
  "better than", "stronger than", "faster than", "superior to",
  "outperform", "beats", "crushes", "destroys", "annihilates",
];

export interface ComplianceResult {
  clean: boolean;
  violations: string[];
  cleanedText: string;
}

export function checkCompliance(text: string): ComplianceResult {
  const violations: string[] = [];
  let cleanedText = text;
  const lowerText = text.toLowerCase();

  for (const term of FORBIDDEN_TERMS) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "gi");
    if (regex.test(lowerText)) {
      violations.push(\`Contains forbidden term: "\${term}"\`);
      cleanedText = cleanedText.replace(regex, "");
    }
  }

  for (const comp of SENSITIVE_COMPARISONS) {
    if (lowerText.includes(comp)) {
      violations.push(\`Contains unsubstantiated comparison: "\${comp}"\`);
    }
  }

  // Check for excessive capitalization (keyword stuffing)
  const words = text.split(/\\s+/);
  const upperWords = words.filter((w) => w.length > 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  if (upperWords.length > 3) {
    violations.push(\`Excessive capitalization detected (\${upperWords.length} uppercase words) - possible keyword stuffing\`);
  }

  // Check for repeated words (keyword stuffing)
  const wordFreq: Record<string, number> = {};
  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length > 2) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
  });
  for (const [word, count] of Object.entries(wordFreq)) {
    if (count > 3) {
      violations.push(\`Word "\${word}" appears \${count} times - excessive repetition\`);
    }
  }

  // Clean up extra spaces from removed terms
  cleanedText = cleanedText.replace(/\\s{2,}/g, " ").trim();

  return {
    clean: violations.length === 0,
    violations,
    cleanedText,
  };
}

export function cleanCopy(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/\\s{2,}/g, " ");
  cleaned = cleaned.replace(/^[\\s,;:.!?\\-]+/, "");
  cleaned = cleaned.replace(/[\\s,;:.!?\\-]+$/, "");
  if (cleaned.length > 0 && /[a-zA-Z0-9\\]]/.test(cleaned[cleaned.length - 1])) {
    cleaned += ".";
  }
  return cleaned.trim();
}

export function validateAllOutputs(
  title?: string,
  highlights?: string,
  bullets?: string[],
  description?: string
): string[] {
  const warnings: string[] = [];
  const items: [string, string | undefined][] = [
    ["Title", title],
    ["Highlights", highlights],
    ...(bullets || []).map((b, i) => [\`Bullet \${i + 1}\`, b] as [string, string | undefined]),
    ["Description", description],
  ];

  for (const [label, text] of items) {
    if (text) {
      const result = checkCompliance(text);
      result.violations.forEach((v) => warnings.push(\`[\${label}] \${v}\`));
    }
  }

  return warnings;
}
''')

# 6. lib/duplicateChecker.ts
w("lib/duplicateChecker.ts", '''export interface DuplicateCheckResult {
  hasIssues: boolean;
  issues: string[];
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "its", "your", "our",
  "their", "this", "that", "these", "those", "from", "into", "about",
  "than", "then", "also", "very", "just", "not", "no", "so",
]);

function getSignificantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, "")
    .split(/\\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function getWordFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const word of getSignificantWords(text)) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}

export function checkDuplicateBetween(
  sourceA: string,
  sourceB: string,
  labelA: string,
  labelB: string
): DuplicateCheckResult {
  const issues: string[] = [];

  const wordsA = getSignificantWords(sourceA);
  const wordsB = getSignificantWords(sourceB);

  const setB = new Set(wordsB);
  const overlaps = wordsA.filter((w) => setB.has(w));

  if (overlaps.length > 5) {
    issues.push(
      \`\${labelA} and \${labelB} share \${overlaps.length} significant words: "\${overlaps.slice(0, 5).join(", ")}...\"
    );
  }

  // Check word frequency across both texts
  const combinedFreq = getWordFrequency(sourceA + " " + sourceB);
  for (const [word, count] of combinedFreq) {
    if (count > 3) {
      issues.push(\`Word "\${word}" appears \${count} times across \${labelA} and \${labelB}\`);
    }
  }

  return {
    hasIssues: issues.length > 0,
    issues,
  };
}

export function checkAllDuplicates(
  title?: string,
  highlights?: string,
  bullets?: string[],
  description?: string
): string[] {
  const allIssues: string[] = [];

  if (title && highlights) {
    const result = checkDuplicateBetween(title, highlights, "Title", "Highlights");
    allIssues.push(...result.issues);
  }

  if (title && bullets) {
    for (let i = 0; i < bullets.length; i++) {
      const result = checkDuplicateBetween(title, bullets[i], "Title", \`Bullet \${i + 1}\`);
      allIssues.push(...result.issues);
    }
  }

  if (bullets && description) {
    const allBullets = bullets.join(" ");
    const result = checkDuplicateBetween(description, allBullets, "Description", "Bullets");
    allIssues.push(...result.issues);
  }

  return allIssues;
}

export function generateDedupeReport(
  title?: string,
  highlights?: string,
  bullets?: string[],
  description?: string
): string {
  const issues = checkAllDuplicates(title, highlights, bullets, description);
  if (issues.length === 0) return "No deduplication issues found.";
  return "Deduplication warnings:\\n" + issues.map((i) => "- " + i).join("\\n");
}
''')

print("Batch 1 complete: .env.local, openai.ts, factExtractor.ts, languageProcessor.ts, compliance.ts, duplicateChecker.ts")
