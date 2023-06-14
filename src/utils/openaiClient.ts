import { loadEnvConfig } from "@next/env";
import { Configuration, OpenAIApi } from "openai";

loadEnvConfig("");

const openaiConfig = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

export const openaiClient = new OpenAIApi(openaiConfig);
