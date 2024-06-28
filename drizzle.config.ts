import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/drizzle-schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: "127.0.0.1",
    user: "pd-chat-user",
    password: "pass",
    database: "pd-chat",
  },
});
