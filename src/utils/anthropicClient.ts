import { createAnthropic } from "@ai-sdk/anthropic";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("");

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
