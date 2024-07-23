import ollama from "ollama";
import { openaiClient } from "@/rag/llm-clients/openaiClient";
import { EmbeddingModels, EmbeddingProviders } from "@/types";
import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";
import { mistral } from "@/rag/llm-clients/mistral-client";

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
    dimensions: 1536, // TODO: this will probably not work, but check it out!
    user: "test-pd-chat-user",
  });
  const embeddingResponse = await openAIEmbedding.doEmbed({ values: [input] });

  // TODO: this has to be tested...
  return embeddingResponse.embeddings.flatMap((embedding: EmbeddingModelV1Embedding) => embedding);
};

const embedWithNomic = async (input: string): Promise<number[]> => {
  const response = await ollama.embeddings({
    model: EmbeddingModels.OLLAMA_EMBEDDING,
    prompt: input,
  });

  return response.embedding;
};

const embedWithMistral = async (input: string): Promise<number[]> => {
  const mistralEmbedding = mistral.embedding(EmbeddingModels.MISTRAL_EMBEDDING);
  const response = await mistralEmbedding.doEmbed({ values: [input] });

  return response.embeddings.flatMap((embedding: EmbeddingModelV1Embedding) => embedding);
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
  MISTRAL: embedWithMistral,
};

export const EMBEDDING_PROVIDERS: Providers = {
  OPEN_AI: "text-embedding-ada-002",
  OLLAMA: "nomic-embed-text",
  MISTRAL: "mistral-embed",
};
