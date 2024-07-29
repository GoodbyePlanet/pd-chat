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

export const documentsMistral = pgTable(
  "documentsMistral",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    docsurl: text("docsurl").notNull(),
    embedding: vector("embedding", { dimensions: 1024 }),
  },
  (table) => ({
    cosine: index("cosine_index_mistral").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);

export const documentsOpenAI = pgTable(
  "documentsOpenAI",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    docsurl: text("docsurl").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => ({
    cosine: index("cosine_index_openai").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);
