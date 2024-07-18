import { BaseLLMChat } from "@/rag/base-llm-chat";
import { ollama } from "@/utils/ollamaClient";
import { Models } from "@/types";

export class OllamaChat extends BaseLLMChat {
  protected model = ollama.chat(Models.LLAMA_3);
}
