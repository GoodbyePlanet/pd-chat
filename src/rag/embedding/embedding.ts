import ollama from "ollama";
import { openaiClient } from "@/rag/llm-clients/openaiClient";
import { EmbeddingModels, EmbeddingProviders, Models } from "@/types";
import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";
import { mistral } from "@/rag/llm-clients/mistral-client";

// TODO: Make this more generic
export class Embedding {
  embeddingProvider: string;

  constructor(model: string) {
    this.embeddingProvider = this.getEmbeddingProvider(model);
  }

  private modelToProviderMap = new Map<string, EmbeddingProviders>([
    // Since Anthropic doesn't have its own embedding model we use Ollama embedding model
    // Same goes for the rest of models from https://ollama.com
    [Models.CLAUDE_3_HAIKU, EmbeddingProviders.OLLAMA],
    [Models.GEMMA_2, EmbeddingProviders.OLLAMA],
    [Models.PHI_3, EmbeddingProviders.OLLAMA],
    [Models.LLAMA_3, EmbeddingProviders.OLLAMA],
    [Models.LLAMA_3_1, EmbeddingProviders.OLLAMA],
    [Models.MISTRAL_LARGE, EmbeddingProviders.MISTRAL],
    [Models.DAVINCI_TURBO, EmbeddingProviders.OPEN_AI],
  ]);

  private getEmbeddingProvider(model: string): EmbeddingProviders | string {
    return this.modelToProviderMap.get(model) || "Unknown model";
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
    dimensions: 1536, // TODO: this will probably not work, but check it out
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
