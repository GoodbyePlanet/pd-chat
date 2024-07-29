CREATE TABLE IF NOT EXISTS "documentsOpenAI" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"docsurl" text NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_index_openai" ON "documentsOpenAI" USING hnsw ("embedding" vector_cosine_ops);