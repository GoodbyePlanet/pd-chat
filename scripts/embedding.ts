import ollama from "ollama";
import { openaiClient } from "@/utils/openaiClient";
import { Models, EmbeddingProviders, EmbeddingModels } from "@/types";
import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";

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
  const openAIEmbedding = openaiClient.embedding(EmbeddingModels.OPEN_AI_EMBEDDING, {
    dimensions: 1536,
    user: "test-pd-chat-user",
  });
  const embeddingResponse = await openAIEmbedding.doEmbed({ values: [input] });

  // TODO: this has to be tested since...
  return embeddingResponse.embeddings.flatMap((embedding: EmbeddingModelV1Embedding) => embedding);
};

const embedWithNomic = async (input: string): Promise<number[]> => {
  const response = await ollama.embeddings({
    model: EmbeddingModels.OLLAMA_EMBEDDING,
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
