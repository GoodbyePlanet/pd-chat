import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";

import benefits from "@/documents/benefits.json";
import culture from "@/documents/culture.json";
import improvementTime from "@/documents/improvement-time.json";
import knowledgeSharing from "@/documents/knowledge-sharing.json";
import logs from "@/documents/logs.json";
import profitShare from "@/documents/profit-share.json";
import vacationDaysOff from "@/documents/vacation-days-off.json";

type Document = {
  title: string;
  content: string;
  docsUrl: string;
};

const generateEmbeddings = async (documents: Document[]): Promise<void> => {
  console.log("creating embeddings started...");

  try {
    for (const document of documents) {
      console.log("embedding for doc", document.title);
      const input = document.content.replace(/\n/g, " ");

      const embeddingResponse = await openaiClient.createEmbedding({
        model: "text-embedding-ada-002",
        input,
      });

      const [{ embedding }] = embeddingResponse.data.data;

      await supabaseClient.from("documents").insert({
        title: document.title,
        content: document.content,
        docsurl: document.docsUrl,
        embedding,
      });
      console.log("Document saved for ", document.title);
    }
  } catch (error: any) {
    console.error("An error occurred while creating/saving embedding");
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
