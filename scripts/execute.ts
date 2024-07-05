import { Document } from "@/types";
import { Embedding } from "./embedding";

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
    // culture,
    // improvementTime,
    // knowledgeSharing,
    // logs,
    // profitShare,
    // vacationDaysOff,
  ];

  const embedding = new Embedding();
  await embedding.storeEmbeddingsToDB(documents);
})();
