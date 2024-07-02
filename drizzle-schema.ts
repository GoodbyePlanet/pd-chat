import { index, pgTable, serial, text, vector } from "drizzle-orm/pg-core";

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    docsurl: text("docsurl").notNull(),
    embedding: vector("embedding", { dimensions: 768 }),
  },
  (table) => ({
    cosine: index("cosine_index").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);
