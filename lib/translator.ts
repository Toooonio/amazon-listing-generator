import { callDeepSeek } from "./deepseek";

export async function translateToChinese(
  text: string,
  sourceLanguage: string = ""
): Promise<string> {
  if (!text || text.trim().length === 0) return "";

  const langHint = sourceLanguage ? "Source language: " + sourceLanguage + ". " : "";

  const prompt = [
    "Translate the following Amazon product copy into natural Chinese.",
    langHint,
    "Rules:",
    "- Output fluent, natural Chinese.",
    "- Preserve all product facts and selling points.",
    "- Do NOT add features or claims not present in the original.",
    "- Do NOT add explanatory prefixes like 'Translation:' or 'Chinese:'.",
    "- If the text contains brand names or model numbers, keep them untranslated.",
    "- Output ONLY the Chinese translation, nothing else.",
    "",
    "Text to translate:",
    text,
  ].join("\n");

  return callDeepSeek({
    systemPrompt: "You are a professional translator specializing in e-commerce product copy. Translate accurately and naturally.",
    userPrompt: prompt,
    temperature: 0.3,
    maxTokens: 1024,
  });
}

export async function translateBulletsToChinese(
  bullets: string[],
  sourceLanguage: string = ""
): Promise<string[]> {
  const results: string[] = [];
  for (const bullet of bullets) {
    const translated = await translateToChinese(bullet, sourceLanguage);
    results.push(translated);
  }
  return results;
}
