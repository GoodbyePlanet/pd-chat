import { Databases, Document, EmbeddingProviders, Models } from "@/types";
import { Embedding } from "@/rag/embedding/embedding";
import { DatabaseClient } from "@/rag/llm-clients/database-client";

import benefits from "@/documents/benefits.json";
import culture from "@/documents/culture.json";
import improvementTime from "@/documents/improvement-time.json";
import knowledgeSharing from "@/documents/knowledge-sharing.json";
import logs from "@/documents/logs.json";
import profitShare from "@/documents/profit-share.json";
import vacationDaysOff from "@/documents/vacation-days-off.json";

(async () => {
  const documents: Document[] = [
    benefits,
    culture,
    improvementTime,
    knowledgeSharing,
    logs,
    profitShare,
    vacationDaysOff,
  ];

  // Storing embeddings using Ollama embedding model
  const databaseClient = new DatabaseClient(Databases.PG_VECTOR, Models.LLAMA_3);
  const embedding = new Embedding(Models.LLAMA_3);
  await databaseClient.storeEmbeddingsInDB(documents, embedding);

  // Since Mistral embedding model have vectors of dimension 1024 we need to add embeddings to different table
  const databaseClientMistral = new DatabaseClient(Databases.PG_VECTOR, Models.MISTRAL_LARGE);
  const embeddingMistral = new Embedding(Models.MISTRAL_LARGE);
  await databaseClientMistral.storeEmbeddingsInDB(documents, embeddingMistral);

  // Since OpenAI embedding model have vectors of dimension 1536 we need to add embeddings to different table
  const databaseClientOpenAI = new DatabaseClient(Databases.PG_VECTOR, Models.DAVINCI_TURBO);
  const embeddingOpenAI = new Embedding(Models.DAVINCI_TURBO);
  await databaseClientOpenAI.storeEmbeddingsInDB(documents, embeddingOpenAI);
})();
