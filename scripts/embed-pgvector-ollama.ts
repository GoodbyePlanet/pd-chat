import ollama from "ollama";
import benefits from "@/documents/benefits.json";
import { drizzleClient } from "@/utils/pg-drizzle-client";
import { documents as documentsTable } from "../drizzle-schema";

type Document = {
  title: string;
  content: string;
  docsUrl: string;
};

const generateEmbeddings = async (documents: Document[]): Promise<void> => {
  console.log("CREATING EMBEDDINGS FOR PG VECTOR DATABASE......");

  try {
    for (const document of documents) {
      console.log("embedding for doc ", document.title);
      const input = document.content.replace(/\n/g, " ");

      const response = await ollama.embeddings({
        model: "nomic-embed-text",
        prompt: input,
      });

      const embedding = response.embedding;
      console.log("drizzle client", drizzleClient);
      await drizzleClient
        .insert(documentsTable)
        .values({
          title: document.title,
          content: document.content,
          docsurl: document.docsUrl,
          embedding,
        })
        .execute();
      console.log("DONE");
    }
  } catch (error: any) {
    console.error("An error occurred while creating/saving embedding");
  }
  // store embedded vectors to pgvector DB
};

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
  await generateEmbeddings(documents);
})();
