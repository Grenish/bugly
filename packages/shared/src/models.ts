export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai" | "google";

export type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

const pricing = (
  inputUsdPerMillionTokens: number,
  outputUsdPerMillionTokens: number
): ModelPricing => ({
  inputUsdPerMillionTokens,
  outputUsdPerMillionTokens,
});

export const ANTHROPIC_CHAT_MODELS = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    pricing: pricing(3, 15),
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export const OPENAI_CHAT_MODELS = [
  {
    id: "gpt-5.5",
    provider: "openai",
    pricing: pricing(5, 30),
  },
  {
    id: "gpt-5.4",
    provider: "openai",
    pricing: pricing(2.5, 15),
  },
  {
    id: "gpt-5.4-mini",
    provider: "openai",
    pricing: pricing(0.75, 4.5),
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export const GOOGLE_CHAT_MODELS = [
  {
    id: "gemini-3.1-pro-preview",
    provider: "google",
    pricing: pricing(2, 12),
  },
  {
    id: "gemini-3.1-flash-lite",
    provider: "google",
    pricing: pricing(0.25, 1.5),
  },
  {
    id: "gemini-3.5-flash",
    provider: "google",
    pricing: pricing(1.5, 9),
  },
] as const satisfies readonly SupportedChatModelDefinition[];

// Hardcoded for now.
// TODO: keep pricing in sync with provider pricing pages.
export const SUPPORTED_CHAT_MODELS = [
  ...ANTHROPIC_CHAT_MODELS,
  ...OPENAI_CHAT_MODELS,
  ...GOOGLE_CHAT_MODELS,
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];
export type SupportedChatModelId = SupportedChatModel["id"];

export const DEFAULT_CHAT_MODEL_ID: SupportedChatModelId = "gemini-3.5-flash";

export function findSupportedChatModel(modelId: string): SupportedChatModel | undefined {
  return SUPPORTED_CHAT_MODELS.find((model) => model.id === modelId);
}

export function isSupportedChatModelId(modelId: string): modelId is SupportedChatModelId {
  return findSupportedChatModel(modelId) !== undefined;
}
