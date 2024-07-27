import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";
import { BaseEmbedding } from "@/rag/embedding/base-embedding";
import { mistral } from "@/rag/llm-clients/mistral-client";
import { EmbeddingModels } from "@/types";

export class MistralEmbedding extends BaseEmbedding {
  public async doEmbed(input: string): Promise<Array<number>> {
    const mistralEmbedding = mistral.embedding(EmbeddingModels.MISTRAL_EMBEDDING);
    const response = await mistralEmbedding.doEmbed({ values: [input] });

    return response.embeddings.flatMap((embedding: EmbeddingModelV1Embedding) => embedding);
  }
}
