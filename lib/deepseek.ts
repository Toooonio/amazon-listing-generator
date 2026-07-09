export interface DeepSeekCallOptions {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";

function getApiKey(): string {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY environment variable is not set");
  }
  return apiKey;
}

async function callDeepSeekAPI(
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL,
  maxTokens: number = 2048,
  temperature: number = 0.7
): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(DEEPSEEK_BASE_URL + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error("DeepSeek API error: " + response.status + " - " + errorText);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("DeepSeek returned empty response");
  }

  return content;
}

export async function callDeepSeek(options: DeepSeekCallOptions): Promise<string> {
  const {
    systemPrompt,
    userPrompt,
    model = DEFAULT_MODEL,
    maxTokens = 2048,
    temperature = 0.7,
  } = options;

  return callDeepSeekAPI(systemPrompt, userPrompt, model, maxTokens, temperature);
}

export async function callDeepSeekJSON<T>(
  options: DeepSeekCallOptions
): Promise<T> {
  const text = await callDeepSeekAPI(
    options.systemPrompt,
    options.userPrompt,
    options.model || DEFAULT_MODEL,
    options.maxTokens || 2048,
    options.temperature ?? 0.3
  );

  // Try to extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as T;
  }

  throw new Error("Failed to parse JSON from DeepSeek response");
}

export { callDeepSeek as callAI, callDeepSeekJSON as callAIJSON };
