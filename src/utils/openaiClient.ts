import { loadEnvConfig } from "@next/env";
import { createOpenAI } from "@ai-sdk/openai";

loadEnvConfig("");

export const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});
