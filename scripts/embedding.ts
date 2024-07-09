import ollama from "ollama";
import { openaiClient } from "@/utils/openaiClient";
import { AIModels, EmbeddingProviders } from "@/types";

export class Embedding {
  embeddingProvider: string;

  constructor(embeddingProvider: string = EmbeddingProviders.OLLAMA) {
    this.embeddingProvider = embeddingProvider;
  }

  public async generate(input: string): Promise<number[]> {
    const embedFunc = EMBED_FUNC[this.embeddingProvider as keyof EmbedFunc];

    try {
      return embedFunc(input);
    } catch (error: any) {
      console.error(
        `An error occurred while generating embedding for with ${this.embeddingProvider} provider!`
      );
      throw error;
    }
  }
}

const embedWithAda002 = async (input: string): Promise<number[]> => {
  const embeddingResponse = await openaiClient.createEmbedding({
    model: EMBEDDING_PROVIDERS.OPEN_AI,
    input,
  });

  const [{ embedding }] = embeddingResponse.data.data;
  return embedding;
};

const embedWithNomic = async (input: string): Promise<number[]> => {
  const response = await ollama.embeddings({
    model: AIModels.OLLAMA_EMBEDDING,
    prompt: input,
  });

  return response.embedding;
};

type EmbedFunc = {
  [key: string]: (input: string) => Promise<number[]>;
};

type Providers = {
  [key: string]: string;
};

const EMBED_FUNC: EmbedFunc = {
  OPEN_AI: embedWithAda002,
  OLLAMA: embedWithNomic,
};

export const EMBEDDING_PROVIDERS: Providers = {
  OPEN_AI: "text-embedding-ada-002",
  OLLAMA: "nomic-embed-text",
};
