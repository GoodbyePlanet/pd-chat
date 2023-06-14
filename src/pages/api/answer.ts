// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {openaiClient} from "@/utils/openaiClient";
import {supabaseClient} from "@/utils/supabaseClient";
import {OpenAIModel} from "@/types";
import dedent from "ts-dedent";
import {ChatCompletionRequestMessage, CreateChatCompletionRequest} from "openai/api";

type Data = {
  answer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("INSIDE HANDLER");
  try {
    console.log("BODY", req.body);
    const {question} = req.body;
    const input = question.replace(/\n/g, " ");
    console.log("QUERY", input);

    // TODO: Moderate the content to comply with OpenAI T&C
    // https://github.com/supabase-community/nextjs-openai-doc-search/blob/main/pages/api/vector-search.ts

    const queryEmbedding = await openaiClient.createEmbedding({
      model: OpenAIModel.EMBEDDING,
      input
    });

    const [{embedding}] = queryEmbedding.data.data;

    const {data: chunks, error} = await supabaseClient.rpc("match_documents", {
      query_embedding: embedding,
      match_threshold: 0.01,
      match_count: 2
    });

    console.log("CHUNKS", chunks);
    const contentChunk = chunks[0];
    const contentText = `${contentChunk.content.trim()}\n---\n`;

    const systemContext = dedent`You are very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. Please refer to the official documentation ${contentChunk.docsurl}'
    `
    console.log("PROMPT", systemContext);

    const messages: Array<ChatCompletionRequestMessage> = [{"role": "system", "content": systemContext}, {"role": "user", "content": input}];
    const chatCompletionRequest: CreateChatCompletionRequest = {
      model: OpenAIModel.DAVINCI_TURBO,
      messages,
      max_tokens: 512,
      temperature: 0,
    };

    const completionResponse = await openaiClient.createChatCompletion(chatCompletionRequest);
    const answer = completionResponse.data?.choices[0]?.message?.content || "";
    console.log("COMPLETION ANSWER", answer);

    if (completionResponse.status !== 200) {
      res.status(completionResponse.status);
    }

    res.status(200).json({answer});
  } catch (error) {
    console.error(error);
    res.status(500);
  }
}
