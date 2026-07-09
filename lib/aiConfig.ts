export const AI_CONFIG = {
  provider: "deepseek" as AIProvider,
  model: "deepseek-chat",
  temperature: 0.7,
  maxTokens: 2048,
};

export type AIProvider = "deepseek" | "openai" | "claude" | "gemini";

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
}

export function getProviderConfig(): AIProviderConfig {
  return AI_CONFIG;
}
