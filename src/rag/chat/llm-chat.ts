import { Embedding } from "../embedding/embedding";
import { DatabaseClient } from "../llm-clients/database-client";
import { ChatResponse, EmbeddingProviders, LLM } from "@/types";
import { OllamaChat } from "@/rag/chat/ollama-chat";
import { OpenAIChat } from "@/rag/chat/open-ai-chat";
import { AnthropicChat } from "@/rag/chat/anthropic-chat";
import { BaseLLMChat } from "@/rag/chat/base-llm-chat";

type ChatClass = {
  [key: string]: BaseLLMChat;
};

export class LLMChat {
  private readonly embedding: Embedding;
  private readonly dbClient: DatabaseClient;
  private llmChat: BaseLLMChat;

  constructor(llmModel: string) {
    // Since Anthropic doesn't have its own embedding model we use Ollama embedding model
    const embeddingModel = llmModel === LLM.ANTHROPIC ? EmbeddingProviders.OLLAMA : llmModel;

    this.embedding = new Embedding(embeddingModel);
    this.dbClient = new DatabaseClient();
    this.llmChat = this.chatClass[llmModel];
  }

  public async getAnswer(userInput: string): Promise<ChatResponse> {
    const embeddings = await this.embedding.generate(this.extractAndSanitizeQuestion(userInput));
    const similarDocs = await this.dbClient.getSimilarDocumentsFromDB(embeddings);

    return this.llmChat.chat(userInput, similarDocs);
  }

  private chatClass: ChatClass = {
    OLLAMA: new OllamaChat(),
    OPEN_AI: new OpenAIChat(),
    ANTHROPIC: new AnthropicChat(),
  };

  private extractAndSanitizeQuestion(userInput: string): string {
    return userInput.trim().replace(/\n/g, " ");
  }
}
