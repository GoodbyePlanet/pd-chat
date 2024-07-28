import type { NextApiRequest, NextApiResponse } from "next";
import { LLMChat } from "@/rag/chat/llm-chat";

type Data = {
  answer: string;
};

type ErrorResponse = {
  message: string;
};

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

    if (answer.error) {
      res.status(500).json({ message: "Failed to create chat completion!" });
    }

    res.status(200).json({ answer: (answer?.text as string) || "" });
  } catch (error: any) {
    console.error("An error occurred", error);
    res.status(500).json({ message: error.message });
  }
}
