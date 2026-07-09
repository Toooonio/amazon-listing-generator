import os, re
base = "C:/Users/Dell/Documents/Codex/2026-07-08/listing-listing-1-75-125-2"

def read(fname):
    path = os.path.join(base, fname)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(fname, content):
    path = os.path.join(base, fname)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Written: {fname}")

# 1. Fix generator.ts
old_gen = read("lib/generator.ts")

# Find the exact function to replace
# Remove old imports that are no longer needed
lines = old_gen.split("\n")
new_lines = []
for line in lines:
    if "validateOutput" in line and "import" in line:
        continue
    if "generateTitle" in line and "import" in line:
        continue
    if "generateHighlight" in line and "import" in line:
        continue
    if "generateBullets" in line and "import" in line:
        continue
    if "generateDescription" in line and "import" in line:
        continue
    if "dedupeCopy" in line and "import" in line:
        continue
    if "validateCompliance" in line and "import" in line:
        continue
    if "rankSellingPoints" in line and "import" in line:
        continue
    new_lines.append(line)

# Add fetch import
new_text = "\n".join(new_lines)

# Now replace the generateAmazonCopy function
old_func = 'export function generateAmazonCopy(\n  request: GenerateRequest\n): GenerateResult {'
new_func_start = 'export async function generateAmazonCopy(\n  request: GenerateRequest\n): Promise<GenerateResult> {'

if old_func in new_text:
    new_text = new_text.replace(old_func, new_func_start)
    print("Replaced function signature")
else:
    print("Could not find function signature to replace")
    print("Looking for variations...")
    for line in new_text.split("\n"):
        if "generateAmazonCopy" in line:
            print("Found:", line)

# Replace the body of the function
old_body = '''  const { rawText, brand, targetLanguage, mode, settings } = request;

  const detectedLanguage = detectLanguage(rawText);
  const facts: ProductFacts = extractFacts(rawText, brand, detectedLanguage);
  const rankedPoints: RankedSellingPoint[] = rankSellingPoints(facts, settings.writingStyle);

  const output: GeneratedOutput = {};
  const warnings: string[] = [];'''

new_body = '''  const { rawText, brand, targetLanguage, mode, settings } = request;

  // Validate input first
  const inputValidation = validateInput(rawText, brand);
  if (!inputValidation.valid) {
    return {
      output: {},
      warnings: inputValidation.errors,
      validationErrors: inputValidation.errors,
      complianceWarnings: [],
    };
  }

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: brand.trim(),
        language: targetLanguage,
        mode,
        productInfo: rawText,
        settings: {
          titleMaxLength: settings.titleMaxLength,
          highlightMaxLength: settings.highlightMaxLength,
          writingStyle: settings.writingStyle,
          strictDedupe: settings.strictDedupe,
          amazonCompliance: settings.amazonCompliance,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        output: {},
        warnings: [errorData.error || "API request failed with status " + response.status],
        validationErrors: [],
        complianceWarnings: [],
      };
    }

    const data = await response.json();

    const output: GeneratedOutput = {
      title: data.title,
      highlights: data.highlights,
      bullets: data.bullets,
      description: data.description,
    };

    return {
      output,
      warnings: data.warnings || [],
      validationErrors: [],
      complianceWarnings: data.complianceWarnings || [],
    };
  } catch (err) {
    return {
      output: {},
      warnings: ["Network error: " + (err instanceof Error ? err.message : "Failed to connect to API")],
      validationErrors: [],
      complianceWarnings: [],
    };
  }'''

if old_body in new_text:
    new_text = new_text.replace(old_body, new_body)
    print("Replaced function body")
else:
    print("Could not find exact function body to replace")
    # Find a unique part to replace
    idx = new_text.find("detectedLanguage = detectLanguage(rawText)")
    if idx > 0:
        print(f"Found 'detectedLanguage' at position {idx}")
    else:
        print("Looking for body parts...")
        for i, line in enumerate(new_text.split("\n")):
            if "detectedLanguage" in line or "extractFacts" in line or "rankSellingPoints" in line:
                print(f"Line {i}: {line}")

# Remove the rest of the old function body
old_tail_start = '''  const shouldGenerateTitle = mode === "title-highlights" || mode === "all";'''
old_tail_end = '''  return {
    output,
    warnings,
    validationErrors: validation.errors,
    complianceWarnings,
  };'''

if old_tail_start in new_text and old_tail_end in new_text:
    # Remove everything from old_tail_start to old_tail_end inclusive
    start_idx = new_text.find(old_tail_start)
    end_idx = new_text.find(old_tail_end) + len(old_tail_end)
    new_text = new_text[:start_idx] + '''  return {
    output: {},
    warnings: [],
    validationErrors: [],
    complianceWarnings: [],
  };''' + new_text[end_idx:]
    print("Removed old function tail")
else:
    print("Could not find function tail to remove")
    print("old_tail_start found:", old_tail_start in new_text)
    print("old_tail_end found:", old_tail_end in new_text)

write("lib/generator.ts", new_text)

# 2. Update page.tsx - make handleGenerate async
old_page = read("app/page.tsx")

# Replace the handleGenerate to be async
old_handle = '''  const handleGenerate = useCallback(() => {
    const inputValidation = validateInput(productText, brand);
    if (!inputValidation.valid) {
      setResult({
        output: {},
        warnings: inputValidation.errors,
        validationErrors: inputValidation.errors,
        complianceWarnings: [],
      });
      return;
    }

    setLoading(true);

    // Use setTimeout to allow UI to update before computation
    setTimeout(() => {
      try {
        const genResult = generateAmazonCopy({
          rawText: productText,
          brand: brand.trim(),
          targetLanguage,
          mode,
          settings,
        });
        setResult(genResult);
      } catch (err) {
        setResult({
          output: {},
          warnings: ["\\u751f\\u6210\\u8fc7\\u7a0b\\u4e2d\\u51fa\\u73b0\\u9519\\u8bef\\uff0c\\u8bf7\\u91cd\\u8bd5\\u3002"],
          validationErrors: [],
          complianceWarnings: [],
        });
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [productText, brand, targetLanguage, mode, settings]);'''

new_handle = '''  const handleGenerate = useCallback(async () => {
    const inputValidation = validateInput(productText, brand);
    if (!inputValidation.valid) {
      setResult({
        output: {},
        warnings: inputValidation.errors,
        validationErrors: inputValidation.errors,
        complianceWarnings: [],
      });
      return;
    }

    setLoading(true);

    try {
      const genResult = await generateAmazonCopy({
        rawText: productText,
        brand: brand.trim(),
        targetLanguage,
        mode,
        settings,
      });
      setResult(genResult);
    } catch (err) {
      setResult({
        output: {},
        warnings: ["\\u751f\\u6210\\u8fc7\\u7a0b\\u4e2d\\u51fa\\u73b0\\u9519\\u8bef\\uff0c\\u8bf7\\u91cd\\u8bd5\\u3002"],
        validationErrors: [],
        complianceWarnings: [],
      });
    } finally {
      setLoading(false);
    }
  }, [productText, brand, targetLanguage, mode, settings]);'''

if old_handle in old_page:
    new_page = old_page.replace(old_handle, new_handle)
    write("app/page.tsx", new_page)
    print("Updated page.tsx handleGenerate")
else:
    print("Could not find exact handleGenerate function to replace")
    # Try to find and replace just the setTimeout version
    if "setTimeout" in old_page:
        print("Found setTimeout in page - trying alternative replacement")
        # Try with the Chinese error text version
        alt_old = old_handle.replace("\\\\u751f\\\\u6210\\\\u8fc7\\\\u7a0b\\\\u4e2d\\\\u51fa\\\\u73b0\\\\u9519\\\\u8bef\\\\uff0c\\\\u8bf7\\\\u91cd\\\\u8bd5\\\\u3002", "An error occurred during generation. Please try again.")
        if alt_old in old_page:
            new_page = old_page.replace(alt_old, new_handle)
            write("app/page.tsx", new_page)
            print("Updated page.tsx (alt version)")
        else:
            print("Still couldn't find the function")

print("Batch 4 complete")
