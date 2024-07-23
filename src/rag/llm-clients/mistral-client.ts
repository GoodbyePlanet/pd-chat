import { createMistral } from "@ai-sdk/mistral";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("");

export const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});
