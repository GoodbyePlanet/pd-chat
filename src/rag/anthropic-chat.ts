import { BaseLLMChat } from "@/rag/base-llm-chat";
import { Models } from "@/types";
import { anthropic } from "@/utils/anthropicClient";

export class AnthropicChat extends BaseLLMChat {
  protected model = anthropic.chat(Models.CLAUDE_3_HAIKU);
}
