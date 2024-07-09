export enum AIModels {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  OPEN_AI_EMBEDDING = "text-embedding-ada-002",
  OLLAMA_EMBEDDING = "nomic-embed-text",
  LLAMA_3 = "llama3",
  CLAUDE_3_HAIKU = "claude-3-haiku-20240307",
}

export enum Databases {
  PG_VECTOR = "pgVector",
  SUPABASE = "supabase",
}

export enum EmbeddingProviders {
  OPEN_AI = "OPEN_AI",
  OLLAMA = "OLLAMA",
}

export type Document = {
  title: string;
  content: string;
  docsUrl: string;
};
