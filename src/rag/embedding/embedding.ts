import { EmbeddingProviders, Models } from "@/types";
import { BaseEmbedding } from "@/rag/embedding/base-embedding";
import { LlamaEmbedding } from "@/rag/embedding/llama-embedding";
import { MistralEmbedding } from "@/rag/embedding/mistral-embedding";
import { OpenaiEmbedding } from "@/rag/embedding/openai-embedding";

type EmbeddingClass = {
  [key: string]: BaseEmbedding;
};

export class Embedding {
  embeddingProvider: BaseEmbedding;

  constructor(model: string) {
    this.embeddingProvider = this.embeddingClass[this.getEmbeddingProviderByModel(model)];
  }

  public async generate(input: string): Promise<number[]> {
    try {
      return this.embeddingProvider.doEmbed(input);
    } catch (error: any) {
      console.error(
        `An error occurred while generating embedding for with ${this.embeddingProvider} provider!`
      );
      throw error;
    }
  }

  private embeddingClass: EmbeddingClass = {
    OLLAMA: new LlamaEmbedding(),
    MISTRAL: new MistralEmbedding(),
    OPEN_AI: new OpenaiEmbedding(),
  };

  private modelToProviderMap = new Map<string, EmbeddingProviders>([
    // Since Anthropic doesn't have its own embedding model we use Ollama embedding model
    // Same goes for the rest of models from https://ollama.com - gemma2, phi3 ...
    [Models.CLAUDE_3_HAIKU, EmbeddingProviders.OLLAMA],
    [Models.GEMMA_2, EmbeddingProviders.OLLAMA],
    [Models.PHI_3, EmbeddingProviders.OLLAMA],
    [Models.LLAMA_3, EmbeddingProviders.OLLAMA],
    [Models.LLAMA_3_1, EmbeddingProviders.OLLAMA],
    [Models.MISTRAL_LARGE, EmbeddingProviders.MISTRAL],
    [Models.DAVINCI_TURBO, EmbeddingProviders.OPEN_AI],
  ]);

  private getEmbeddingProviderByModel(model: string): EmbeddingProviders | string {
    return this.modelToProviderMap.get(model) || "Unknown model";
  }
}
