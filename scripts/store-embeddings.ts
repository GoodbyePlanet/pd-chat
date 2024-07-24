import { Databases, Document, EmbeddingProviders, LLM } from "@/types";
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

  // Here you can change database model and embedding provider
  const databaseClient = new DatabaseClient(Databases.PG_VECTOR, LLM.OLLAMA_3);
  const embedding = new Embedding(EmbeddingProviders.OLLAMA);

  await databaseClient.storeEmbeddingsInDB(documents, embedding);
})();
