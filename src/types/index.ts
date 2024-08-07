export enum Models {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  LLAMA_3 = "llama3",
  LLAMA_3_1 = "llama3.1",
  GEMMA_2 = "gemma2",
  PHI_3 = "phi3:3.8b",
  CLAUDE_3_HAIKU = "claude-3-haiku-20240307",
  MISTRAL_LARGE = "mistral-large-latest",
}

export enum EmbeddingModels {
  OPEN_AI_EMBEDDING = "text-embedding-3-small",
  OLLAMA_EMBEDDING = "nomic-embed-text",
  MISTRAL_EMBEDDING = "mistral-embed",
}

export enum EmbeddingProviders {
  OPEN_AI = "OPEN_AI",
  OLLAMA = "OLLAMA",
  MISTRAL = "MISTRAL",
}

export enum Databases {
  PG_VECTOR = "pgVector",
  SUPABASE = "supabase",
}

export type Document = {
  title: string;
  content: string;
  docsUrl: string;
};

export type SimilarDocument = {
  title: string;
  content: string;
  docsurl: string;
  similarity: number;
};

export type ChatResponse = {
  text?: string;
  error?: string;
};
