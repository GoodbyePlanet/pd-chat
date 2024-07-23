import { z } from "zod";

const environmentVariables = z.object({
  OPENAI_API_KEY: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_AUTH_SECRET: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string(),
  ANTHROPIC_API_KEY: z.string(),
  MISTRAL_API_KEY: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof environmentVariables> {}
  }
}
