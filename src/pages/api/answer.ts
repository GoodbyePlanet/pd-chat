import type { NextApiRequest, NextApiResponse } from "next";
import dedent from "ts-dedent";
import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";
import { EmbeddingModels, Models } from "@/types";
import { EmbeddingModelV1Embedding } from "@ai-sdk/provider";

type Data = {
  answer: string;
};

type ErrorResponse = {
  message: string;
};

type Chunk = {
  title: string;
  content: string;
  docsurl: string;
};

async function getQueryEmbedding(input: string) {
  const embedding = openaiClient.embedding(EmbeddingModels.OPEN_AI_EMBEDDING);

  return embedding.doEmbed({ values: [input] });
}

async function getContentFromDB(
  embedding: Array<number>
): Promise<{ data: Array<Chunk>; error: any }> {
  const { data, error } = await supabaseClient.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.01,
    match_count: 2,
  });

  return { data, error };
}

function extractAndSanitizeQuestion(req: NextApiRequest): string {
  const { question } = req.body;
  return question.trim().replace(/\n/g, " ");
}

function createSystemContext(contentText: string, docsUrl: string): string {
  return dedent`You are very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. 
      Please refer to the official documentation ${docsUrl} or ask directly your Unit lead manager.
    `;
}

function createChatCompletionMessages(contentText: string, docsUrl: string, input: string) {
  return [
    { role: "system", content: createSystemContext(contentText, docsUrl) },
    {
      role: "user",
      content: input,
    },
  ];
}

function createChatCompletionRequest(chunks: Array<Chunk>, input: string) {
  const contentChunk = chunks[0];
  const contentText = `${contentChunk.content.trim()}\n`;
  const docsUrl = contentChunk.docsurl;

  return {
    model: Models.DAVINCI_TURBO,
    messages: createChatCompletionMessages(contentText, docsUrl, input),
    max_tokens: 512,
    temperature: 0,
  };
}

// TODO: this whole thing has to be tested, which this commit only typescript compilation errors are fixed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    const input = extractAndSanitizeQuestion(req);
    const queryEmbedding = await getQueryEmbedding(input);

    if (queryEmbedding === null || queryEmbedding === undefined) {
      res.status(500).json({ message: "Failed to create an embedding for question!" });
    }

    const embedding = queryEmbedding.embeddings.flatMap(
      (embedding: EmbeddingModelV1Embedding) => embedding
    );
    const { data: chunks, error: matchError } = await getContentFromDB(embedding);

    if (matchError) {
      console.error("Match error", matchError);
      res.status(500).json({ message: "Failed to match any document!" });
    }

    const chat = openaiClient.chat(Models.DAVINCI_TURBO);
    const contentChunk = chunks[0];
    const contentText = `${contentChunk.content.trim()}\n`;
    const docsUrl = contentChunk.docsurl;
    const context = createSystemContext(contentText, docsUrl);
    const chatResponse = await chat.doGenerate({
      inputFormat: "messages",
      mode: { type: "regular" },
      prompt: [
        { role: "system", content: context },
        { role: "user", content: [{ type: "text", text: input }] },
      ],
    });

    if (chatResponse.finishReason === "error") {
      res.status(500).json({ message: "Failed to create chat completion!" });
    }

    const answer = chatResponse.text || "";
    res.status(200).json({ answer });
  } catch (error: any) {
    console.error("An error occurred", error);
    res.status(500).json({ message: error.message });
  }
}
