CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"docsurl" text NOT NULL,
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_index" ON "documents" USING hnsw ("embedding" vector_cosine_ops);