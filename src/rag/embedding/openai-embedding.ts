import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";
import { BaseEmbedding } from "@/rag/embedding/base-embedding";
import { openaiClient } from "@/rag/llm-clients/openaiClient";
import { EmbeddingModels } from "@/types";

export class OpenaiEmbedding extends BaseEmbedding {
  public async doEmbed(input: string): Promise<Array<number>> {
    const openAIEmbedding = openaiClient.embedding(EmbeddingModels.OPEN_AI_EMBEDDING, {
      dimensions: 1536, // TODO: this will probably not work, but check it out
      user: "test-pd-chat-user",
    });
    const embeddingResponse = await openAIEmbedding.doEmbed({ values: [input] });

    // TODO: this has to be tested...
    return embeddingResponse.embeddings.flatMap(
      (embedding: EmbeddingModelV1Embedding) => embedding
    );
  }
}
