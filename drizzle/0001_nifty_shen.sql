CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"docsurl" text NOT NULL,
	"embedding" vector(768)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documentsMistral" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"docsurl" text NOT NULL,
	"embedding" vector(1024)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_index" ON "documents" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_index_mistral" ON "documentsMistral" USING hnsw ("embedding" vector_cosine_ops);