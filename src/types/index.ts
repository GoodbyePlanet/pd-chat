export enum Models {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  LLAMA_3 = "llama3",
  CLAUDE_3_HAIKU = "claude-3-haiku-20240307",
}

export enum EmbeddingModels {
  OPEN_AI_EMBEDDING = "text-embedding-ada-002",
  OLLAMA_EMBEDDING = "nomic-embed-text",
}

export enum Databases {
  PG_VECTOR = "pgVector",
  SUPABASE = "supabase",
}

export enum EmbeddingProviders {
  OPEN_AI = "OPEN_AI",
  OLLAMA = "OLLAMA",
}

export enum LLM {
  OPEN_AI = "OPEN_AI",
  OLLAMA = "OLLAMA",
  ANTHROPIC = "ANTHROPIC",
}

export type Document = {
  title: string;
  content: string;
  docsUrl: string;
};
