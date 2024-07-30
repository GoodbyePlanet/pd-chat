import { Embedding } from "../embedding/embedding";
import { DatabaseClient } from "../llm-clients/database-client";
import { ChatResponse, Databases } from "@/types";
import { Llama3Chat } from "@/rag/chat/llama3-chat";
import { OpenAIChat } from "@/rag/chat/open-ai-chat";
import { AnthropicChat } from "@/rag/chat/anthropic-chat";
import { BaseLLMChat } from "@/rag/chat/base-llm-chat";
import { MistralAIChat } from "@/rag/chat/mistral-ai-chat";
import { Gemma2Chat } from "@/rag/chat/gemma2-chat";
import { Phi3Chat } from "@/rag/chat/phi3-chat";
import { Llama3_1Chat } from "@/rag/chat/llama3.1-chat";
import { getKeyByValue } from "@/utils/helpers";
import { logger } from "@/utils/logger";

const log = logger.child({ module: "LLMChat" }, { level: "info" });

type ChatClass = {
  [key: string]: BaseLLMChat;
};

export class LLMChat {
  private readonly embedding: Embedding;
  private readonly dbClient: DatabaseClient;
  private readonly llmChat: BaseLLMChat;

  constructor(llmModel: string) {
    this.embedding = new Embedding(llmModel);
    this.dbClient = new DatabaseClient(Databases.PG_VECTOR, llmModel);

    this.llmChat = this.chatClass[getKeyByValue(llmModel) as string];
  }

  public async getAnswer(userInput: string): Promise<ChatResponse> {
    log.info(`getAnswer called with user input: "${userInput}"`);
    const embeddings = await this.embedding.generate(this.extractAndSanitizeQuestion(userInput));
    const similarDocs = await this.dbClient.getSimilarDocumentsFromDB(embeddings);

    return this.llmChat.chat(userInput, similarDocs);
  }

  private chatClass: ChatClass = {
    LLAMA_3: new Llama3Chat(),
    LLAMA_3_1: new Llama3_1Chat(),
    GEMMA_2: new Gemma2Chat(),
    PHI_3: new Phi3Chat(),
    DAVINCI_TURBO: new OpenAIChat(),
    CLAUDE_3_HAIKU: new AnthropicChat(),
    MISTRAL_LARGE: new MistralAIChat(),
  };

  private extractAndSanitizeQuestion(userInput: string): string {
    return userInput.trim().replace(/\n/g, " ");
  }
}
