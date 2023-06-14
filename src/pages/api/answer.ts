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

function extractQuestionFromRequest(req: NextApiRequest): string {
  const { question } = req.body;
  return question.replace(/\n/g, " ");
}

function getSystemContext(contentText: string, docsUrl: string): string {
  return dedent`You are very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. 
      Please refer to the official documentation ${docsUrl}'
    `;
}

function createChatCompletionMessages(
  contentText: string,
  docsUrl: string,
  input: string
): Array<ChatCompletionRequestMessage> {
  return [
    { role: "system", content: getSystemContext(contentText, docsUrl) },
    {
      role: "user",
      content: input,
    },
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const input = extractQuestionFromRequest(req);

    // TODO: Moderate the content to comply with OpenAI T&C
    // https://github.com/supabase-community/nextjs-openai-doc-search/blob/main/pages/api/vector-search.ts

    const queryEmbedding = await getQueryEmbedding(input);
    const [{ embedding }] = queryEmbedding.data.data;

    const { data: chunks, error } = await getContentFromDB(embedding);
    // TODO: handle error case

    const contentChunk = chunks[0];
    const contentText = `${contentChunk.content.trim()}\n---\n`;
    const docsUrl = contentChunk.docsurl;

    const chatCompletionRequest: CreateChatCompletionRequest = {
      model: OpenAIModel.DAVINCI_TURBO,
      messages: createChatCompletionMessages(contentText, docsUrl, input),
      max_tokens: 512,
      temperature: 0,
    };

    const completionResponse = await openaiClient.createChatCompletion(
      chatCompletionRequest
    );
    const answer = completionResponse.data?.choices[0]?.message?.content || "";
    console.log("COMPLETION ANSWER", answer);

    if (completionResponse.status !== 200) {
      res.status(completionResponse.status);
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
