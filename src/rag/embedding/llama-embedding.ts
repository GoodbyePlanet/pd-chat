import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";
import { BaseEmbedding } from "@/rag/embedding/base-embedding";
import { EmbeddingModels } from "@/types";
import { ollama } from "@/rag/llm-clients/ollamaClient";

export class LlamaEmbedding extends BaseEmbedding {
  public async doEmbed(input: string): Promise<Array<number>> {
    const ollamaEmbedding = ollama.embedding(EmbeddingModels.OLLAMA_EMBEDDING);
    const response = await ollamaEmbedding.doEmbed({ values: [input] });

    return response.embeddings.flatMap((embedding: EmbeddingModelV1Embedding) => embedding);
  }
}
