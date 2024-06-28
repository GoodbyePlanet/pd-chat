import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

(async () => {
  const migrationsClient = postgres("postgres://pd-chat-user:pass@127.0.0.1:5433/pd-chat", {
    max: 1,
  });
  const db = drizzle(migrationsClient);
  await migrate(db, { migrationsFolder: "./drizzle" });
  await migrationsClient.end();
})();
