import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

loadEnvConfig("");

(async (): Promise<void> => {
  const DB_USER = process.env.POSTGRES_USER;
  const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
  const DB_HOST = process.env.POSTGRES_HOST;
  const DB_PORT = process.env.POSTGRES_PORT;
  const DB = process.env.POSTGRES_DB;

  const migrationsClient = postgres(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB}`,
    {
      max: 1,
    }
  );
  const db = drizzle(migrationsClient);
  await migrate(db, { migrationsFolder: "./drizzle" });
  await migrationsClient.end();
})();
