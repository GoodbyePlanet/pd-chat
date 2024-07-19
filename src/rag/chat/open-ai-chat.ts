import { BaseLLMChat } from "@/rag/chat/base-llm-chat";
import { openaiClient } from "@/rag/llm-clients/openaiClient";
import { Models } from "@/types";

export class OpenAIChat extends BaseLLMChat {
  protected model = openaiClient.chat(Models.DAVINCI_TURBO);
}
