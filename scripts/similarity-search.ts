import ollama from "ollama";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { AIModels } from "@/types";
import { client, drizzleClient } from "@/utils/pg-drizzle-client";
import { documents } from "../drizzle-schema";
import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";
import dedent from "ts-dedent";

const similaritySearchWithOpenAI = async (): Promise<void> => {
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

const similaritySearchWithOllama = async (): Promise<void> => {
  const queryEmbedding = await getOllamaEmbeddings("Does ProductDock have offices in Banja Luka?");
  const similarDocuments = await getSimilarDocuments(queryEmbedding);

  await client.end();
};

const getSimilarDocuments = async (
  queryEmbedding: number[]
): Promise<
  {
    title: string;
    content: string;
    docsurl: string;
    similarity: number;
  }[]
> => {
  const similarity = sql<number>`1 - (
  ${cosineDistance(documents.embedding, queryEmbedding)}
  )`;

  return drizzleClient
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
};

const getOllamaEmbeddings = async (prompt: string): Promise<number[]> => {
  const embeddingResponse = await ollama.embeddings({
    model: AIModels.OLLAMA_EMBEDDING,
    prompt,
  });

  return embeddingResponse.embedding;
};

const createSystemContext = (contentText: string, docsUrl: string): string => {
  return dedent`You are very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. 
      Please refer to the official documentation ${docsUrl} or ask directly your Unit lead manager.
    `;
};

const chatWithOllama3 = async (userInput: string): Promise<void> => {
  const queryEmbeddings = await getOllamaEmbeddings(userInput);
  const similarDocuments = await getSimilarDocuments(queryEmbeddings);

  const context = createSystemContext(similarDocuments[0].content, similarDocuments[0].docsurl);

  const response = await ollama.chat({
    model: AIModels.LLAMA_3,
    messages: [
      {
        role: "system",
        content: context,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    stream: true,
  });

  for await (const part of response) {
    process.stdout.write(part.message.content);
  }
};

(async () => {
  await chatWithOllama3("What is profit share?");
})();
