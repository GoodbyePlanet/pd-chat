import { BaseLLMChat } from "@/rag/chat/base-llm-chat";
import { ollama } from "@/rag/llm-clients/ollamaClient";
import { Models } from "@/types";

export class Llama3Chat extends BaseLLMChat {
  protected model = ollama.chat(Models.LLAMA_3);
}
