import ollama from "ollama";
import { generateText } from "ai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import dedent from "ts-dedent";
import { EmbeddingModels, Models } from "@/types";
import { client, drizzleClient } from "@/database/pg-drizzle-client";
import { documents } from "../drizzle-schema";
import { openaiClient } from "@/rag/llm-clients/openaiClient";
import { supabaseClient } from "@/database/supabaseClient";
import { anthropic } from "@/rag/llm-clients/anthropicClient";

const similaritySearchWithOpenAI = async (): Promise<void> => {
  const openAIEmbedding = openaiClient.embedding(EmbeddingModels.OPEN_AI_EMBEDDING, {
    dimensions: 1536,
    user: "test-pd-chat-user",
  });
  const embeddingResponse = await openAIEmbedding.doEmbed({
    values: ["In which cities ProductDock has offices?"],
  });
  const embedding = embeddingResponse.embeddings;
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
    model: EmbeddingModels.OLLAMA_EMBEDDING,
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
    model: Models.LLAMA_3,
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

const chatWithAnthropic = async (userInput: string): Promise<void> => {
  const queryEmbeddings = await getOllamaEmbeddings(userInput);
  const similarDocuments = await getSimilarDocuments(queryEmbeddings);
  const context = createSystemContext(similarDocuments[0].content, similarDocuments[0].docsurl);

  const response = await generateText({
    model: anthropic.chat(Models.CLAUDE_3_HAIKU),
    messages: [
      { role: "system", content: context },
      { role: "user", content: userInput },
    ],
  });

  console.log("RESPONSE", response.text);
};

(async () => {
  // await chatWithOllama3("What is profit share?");
  await chatWithAnthropic("What is profit share?");
})();
