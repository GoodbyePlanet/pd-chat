import { Embedding } from "../embedding/embedding";
import { DatabaseClient } from "../llm-clients/database-client";
import { ChatResponse, Databases, EmbeddingProviders, Models } from "@/types";
import { Llama3Chat } from "@/rag/chat/llama3-chat";
import { OpenAIChat } from "@/rag/chat/open-ai-chat";
import { AnthropicChat } from "@/rag/chat/anthropic-chat";
import { BaseLLMChat } from "@/rag/chat/base-llm-chat";
import { MistralAIChat } from "@/rag/chat/mistral-ai-chat";
import { Gemma2Chat } from "@/rag/chat/gemma2-chat";
import { Phi3Chat } from "@/rag/chat/phi3-chat";
import { getKeyByValue } from "@/utils/helpers";
import { Llama3_1Chat } from "@/rag/chat/llama3.1-chat";

type ChatClass = {
  [key: string]: BaseLLMChat;
};

export class LLMChat {
  private readonly embedding: Embedding;
  private readonly dbClient: DatabaseClient;
  private readonly llmChat: BaseLLMChat;

  constructor(llmModel: string) {
    this.embedding = new Embedding(this.getEmbeddingModel(llmModel));
    this.dbClient = new DatabaseClient(Databases.PG_VECTOR, llmModel);

    this.llmChat = this.chatClass[getKeyByValue(llmModel) as string];
  }

  public async getAnswer(userInput: string): Promise<ChatResponse> {
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

  // TODO: Improve this to be more generic
  private getEmbeddingModel = (llm: string): string => {
    // Since Anthropic doesn't have its own embedding model we use Ollama embedding model
    // Same goes for the rest of models fetched from https://ollama.com
    if (
      llm === Models.CLAUDE_3_HAIKU ||
      llm === Models.GEMMA_2 ||
      llm === Models.PHI_3 ||
      llm === Models.LLAMA_3 ||
      llm === Models.LLAMA_3_1
    ) {
      return EmbeddingProviders.OLLAMA;
    }

    if (llm === Models.MISTRAL_LARGE) {
      return EmbeddingProviders.MISTRAL;
    }

    return EmbeddingProviders.OPEN_AI;
  };

  private extractAndSanitizeQuestion(userInput: string): string {
    return userInput.trim().replace(/\n/g, " ");
  }
}
