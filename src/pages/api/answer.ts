import type { NextApiRequest, NextApiResponse } from "next";
import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";
import { OpenAIModel } from "@/types";
import dedent from "ts-dedent";
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
  CreateEmbeddingResponse,
} from "openai/api";
import { AxiosResponse } from "axios";

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

async function getQueryEmbedding(
  input: string
): Promise<AxiosResponse<CreateEmbeddingResponse>> {
  return await openaiClient.createEmbedding({
    model: OpenAIModel.EMBEDDING,
    input,
  });
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

function createChatCompletionMessages(
  contentText: string,
  docsUrl: string,
  input: string
): Array<ChatCompletionRequestMessage> {
  return [
    { role: "system", content: createSystemContext(contentText, docsUrl) },
    {
      role: "user",
      content: input,
    },
  ];
}

function createChatCompletionRequest(
  chunks: Array<Chunk>,
  input: string
): CreateChatCompletionRequest {
  const contentChunk = chunks[0];
  const contentText = `${contentChunk.content.trim()}\n`;
  const docsUrl = contentChunk.docsurl;

  return {
    model: OpenAIModel.DAVINCI_TURBO,
    messages: createChatCompletionMessages(contentText, docsUrl, input),
    max_tokens: 512,
    temperature: 0,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    const input = extractAndSanitizeQuestion(req);
    const moderationResponse = await openaiClient.createModeration({ input });

    if (moderationResponse.data?.results?.flagged) {
      res.status(400).json({ message: "Flagged content!" });
    }

    const queryEmbedding = await getQueryEmbedding(input);

    if (queryEmbedding.status !== 200) {
      res
        .status(500)
        .json({ message: "Failed to create an embedding for question!" });
    }

    const [{ embedding }] = queryEmbedding.data.data;
    const { data: chunks, error: matchError } = await getContentFromDB(
      embedding
    );

    if (matchError) {
      console.error("Match error", matchError);
      res.status(500).json({ message: "Failed to match any document!" });
    }

    const completionResponse = await openaiClient.createChatCompletion(
      createChatCompletionRequest(chunks, input)
    );

    if (completionResponse.status !== 200) {
      res.status(500).json({ message: "Failed to create chat completion!" });
    }

    const answer = completionResponse.data?.choices[0]?.message?.content || "";
    res.status(200).json({ answer });
  } catch (error: any) {
    console.error("An error occurred", error);
    res.status(500).json({ message: error.message });
  }
}
