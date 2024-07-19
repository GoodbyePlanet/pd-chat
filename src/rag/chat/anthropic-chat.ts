import { BaseLLMChat } from "@/rag/chat/base-llm-chat";
import { Models } from "@/types";
import { anthropic } from "@/rag/llm-clients/anthropicClient";

export class AnthropicChat extends BaseLLMChat {
  protected model = anthropic.chat(Models.CLAUDE_3_HAIKU);
}
