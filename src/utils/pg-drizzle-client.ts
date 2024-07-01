import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("");

const DB_USER = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_HOST = process.env.POSTGRES_HOST;
const DB_PORT = process.env.POSTGRES_PORT;
const DB = process.env.POSTGRES_DB;

const client = postgres(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB}`, {
  max: 1,
});
export const drizzleClient = drizzle(client);

// export const client = new postgres({
//   host: "127.0.0.1",
//   port: 5433,
//   user: "pd-chat-user",
//   password: "pass",
//   database: "pd-chat",
// });
//
// const dbConnect = async () => {
//   try {
//     await client.connect();
//     console.log("connected");
//   } catch (error) {
//     console.error(`An error occurred while connecting to pg database ${error}`);
//   }
// };
//
