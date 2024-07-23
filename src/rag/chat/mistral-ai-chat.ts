import { BaseLLMChat } from "@/rag/chat/base-llm-chat";
import { Models } from "@/types";
import { mistral } from "@/rag/llm-clients/mistral-client";

export class MistralAIChat extends BaseLLMChat {
  protected model = mistral.chat(Models.MISTRAL_LARGE, { safePrompt: true });
}
