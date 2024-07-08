import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";
import { AIModels } from "@/types";
import ollama from "ollama";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { documents } from "../drizzle-schema";
import { client, drizzleClient } from "@/utils/pg-drizzle-client";

const executeQueryWithOpenAI = async (): Promise<void> => {
  const embeddingResponse = await openaiClient.createEmbedding({
    model: AIModels.OPEN_AI_EMBEDDING,
    input: "In which cities Productdock has offices?",
  });

  const [{ embedding }] = embeddingResponse.data.data;
  console.log("QUERY EMBEDDING", embedding);

  const { data: chunks, error } = await supabaseClient.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.01,
    match_count: 2,
  });

  if (error) {
    console.error(error);
  }

  console.log("DATA", chunks);
};

const executeQueryWithOllama = async (): Promise<void> => {
  const embeddingResponse = await ollama.embeddings({
    model: AIModels.OLLAMA_EMBEDDING,
    prompt: "Does ProductDock have offices in Banja Luka?",
  });

  const queryEmbedding = embeddingResponse.embedding;

  const similarity = sql<number>`1 - (
  ${cosineDistance(documents.embedding, queryEmbedding)}
  )`;

  const similarDocuments = await drizzleClient
    .select({
      title: documents.title,
      content: documents.content,
      docsurl: documents.docsurl,
      similarity,
    })
    .from(documents)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(1);

  console.log("SIMILAR DOCS", similarDocuments);
  await client.end();
};

(async () => {
  await executeQueryWithOllama();
})();
