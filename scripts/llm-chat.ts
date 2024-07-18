import { generateText } from "ai";
import dedent from "ts-dedent";
import { Embedding } from "./embedding";
import { DatabaseClient, SimilarDocument } from "./database-client";
import { EmbeddingProviders, LLM, Models } from "@/types";
import { openaiClient } from "@/utils/openaiClient";
import { anthropic } from "@/utils/anthropicClient";
import { ollama } from "@/utils/ollamaClient";

export class LLMChat {
  readonly embedding: Embedding;
  readonly dbClient: DatabaseClient;
  readonly llm: string;

  constructor(llm: string) {
    const embeddingModel = llm === LLM.ANTHROPIC ? EmbeddingProviders.OLLAMA : llm;

    this.embedding = new Embedding(embeddingModel);
    this.dbClient = new DatabaseClient();
    this.llm = llm;
  }

  public async getAnswer(userInput: string): Promise<string> {
    const embeddings = await this.embedding.generate(this.extractAndSanitizeQuestion(userInput));
    const similarDocs = await this.dbClient.getSimilarDocumentsFromDB(embeddings);
    const chatFunc = this.chatFunctions[this.llm as keyof ChatFuncs];

    return chatFunc(userInput, similarDocs);
  }

  private chatFunctions: ChatFuncs = {
    OLLAMA: this.ollamaChat.bind(this),
    OPEN_AI: this.openAIChat.bind(this),
    ANTHROPIC: this.anthropicChat.bind(this),
  };

  private async ollamaChat(userInput: string, documents: SimilarDocument[]): Promise<string> {
    const response = await generateText({
      model: ollama.chat(Models.LLAMA_3),
      messages: [
        {
          role: "system",
          content: this.createSystemContext(documents[0].content, documents[0].docsurl),
        },
        { role: "user", content: userInput },
      ],
    });

    if (response.finishReason === "error") {
      return "Could not generate response!";
    }

    return response.text as string;
  }

  private async openAIChat(userInput: string, documents: SimilarDocument[]): Promise<string> {
    const response = await generateText({
      model: openaiClient.chat(Models.DAVINCI_TURBO),
      messages: [
        {
          role: "system",
          content: this.createSystemContext(documents[0].content, documents[0].docsurl),
        },
        { role: "user", content: userInput },
      ],
    });

    if (response.finishReason === "error") {
      return "Could not generate response!";
    }

    return response.text as string;
  }

  private async anthropicChat(userInput: string, documents: SimilarDocument[]): Promise<string> {
    const response = await generateText({
      model: anthropic.chat(Models.CLAUDE_3_HAIKU),
      messages: [
        {
          role: "system",
          content: this.createSystemContext(documents[0].content, documents[0].docsurl),
        },
        { role: "user", content: userInput },
      ],
    });

    if (response.finishReason === "error") {
      return "Could not generate response!";
    }

    return response.text;
  }

  private createSystemContext(contentText: string, docsUrl: string): string {
    return dedent`You are very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. 
      Please refer to the official documentation ${docsUrl} or ask directly your Unit lead manager.
    `;
  }

  private createChatCompletionMessages(contentText: string, docsUrl: string, input: string) {
    return [
      { role: "system", content: this.createSystemContext(contentText, docsUrl) },
      {
        role: "user",
        content: input,
      },
    ];
  }

  private extractAndSanitizeQuestion(userInput: string): string {
    return userInput.trim().replace(/\n/g, " ");
  }
}

type ChatFuncs = {
  [key: string]: (userInput: string, documents: SimilarDocument[]) => Promise<string>;
};
