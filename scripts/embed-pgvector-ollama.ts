import ollama from "ollama";
import { drizzleClient } from "@/utils/pg-drizzle-client";
import { documents as documentsTable } from "../drizzle-schema";
import benefits from "@/documents/benefits.json";
import culture from "@/documents/culture.json";
import improvementTime from "@/documents/improvement-time.json";
import knowledgeSharing from "@/documents/knowledge-sharing.json";
import logs from "@/documents/logs.json";
import profitShare from "@/documents/profit-share.json";
import vacationDaysOff from "@/documents/vacation-days-off.json";
import { AIModels } from "@/types";
import { Document } from "@/types";

const generateEmbeddings = async (documents: Document[]): Promise<void> => {
  console.log("CREATING EMBEDDINGS FOR PG VECTOR DATABASE......");

  try {
    for (const document of documents) {
      const input = document.content.replace(/\n/g, " ");

      const response = await ollama.embeddings({
        model: AIModels.OLLAMA_EMBEDDING,
        prompt: input,
      });
      const embedding = response.embedding;

      await drizzleClient
        .insert(documentsTable)
        .values({
          title: document.title,
          content: document.content,
          docsurl: document.docsUrl,
          embedding,
        })
        .execute();
      console.log("DONE for: ", document.title);
    }
  } catch (error: any) {
    console.error("An error occurred while creating/saving embeddings");
  }
};

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
  await generateEmbeddings(documents);
})();
