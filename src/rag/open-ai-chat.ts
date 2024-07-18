import { BaseLLMChat } from "@/rag/base-llm-chat";
import { openaiClient } from "@/utils/openaiClient";
import { Models } from "@/types";

export class OpenAIChat extends BaseLLMChat {
  protected model = openaiClient.chat(Models.DAVINCI_TURBO);
}
