export enum AIModels {
  DAVINCI_TURBO = "gpt-3.5-turbo",
  OPEN_AI_EMBEDDING = "text-embedding-ada-002",
  OLLAMA_EMBEDDING = "nomic-embed-text",
}

export type Document = {
  title: string;
  content: string;
  docsUrl: string;
};
