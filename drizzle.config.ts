import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("");

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle-schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
