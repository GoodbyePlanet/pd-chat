import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@/utils/supabaseClient";
import { LLMChat } from "../../rag/llm-chat";

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

// TODO: this whole thing has to be tested, which this commit only typescript compilation errors are fixed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  try {
    const llm = req.body?.llm;

    if (!llm) {
      res.status(400).json({ message: "LLM has to be provider!" });
    }

    const chat = new LLMChat(llm);
    const answer = await chat.getAnswer(req.body?.question);

    if (answer === null || answer === undefined) {
      res.status(500).json({ message: "Failed to create chat completion!" });
    }

    res.status(200).json({ answer });
  } catch (error: any) {
    console.error("An error occurred", error);
    res.status(500).json({ message: error.message });
  }
}
