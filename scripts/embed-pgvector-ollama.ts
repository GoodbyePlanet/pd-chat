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
  console.log("CREATING EMBEDDINGS FOR PG VECTOR DATABASE......");

  // check pgvector connection - DONE
  // connect to ollama client
  // go through documents and embed content using ollama
  // store embedded vectors to pgvector DB
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
