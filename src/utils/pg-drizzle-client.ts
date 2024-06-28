import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = postgres("postgres://pd-chat-user:pass@127.0.0.1:5433/pd-chat", { max: 1 });
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
