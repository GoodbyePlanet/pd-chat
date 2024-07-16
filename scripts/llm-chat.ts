import { Embedding } from "./embedding";
import { DatabaseClient } from "./database-client";
import dedent from "ts-dedent";
import ollama from "ollama";
import { EmbeddingProviders, Models } from "@/types";

export class LLMChat {
  readonly embedding: Embedding;
  readonly dbClient: DatabaseClient;

  constructor(llmProvider: string) {
    this.embedding = new Embedding(llmProvider);
    this.dbClient = new DatabaseClient();
  }

  private createSystemContext(contentText: string, docsUrl: string): string {
    return dedent`You are very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. 
      Please refer to the official documentation ${docsUrl} or ask directly your Unit lead manager.
    `;
  }

  private async getChatResponse(llm: string, userInput: string, context: string): Promise<any> {
    // TODO: make this generic as well
    if (llm === EmbeddingProviders.OLLAMA) {
      return ollama.chat({
        model: Models.LLAMA_3,
        messages: [
          {
            role: "system",
            content: context,
          },
          {
            role: "user",
            content: userInput,
          },
        ],
      });
    }

    return null;
  }

  public async getAnswer(userInput: string): Promise<string> {
    const embeddings = await this.embedding.generate(userInput);
    const similarDocs = await this.dbClient.getSimilarDocumentsFromDB(embeddings);
    const context = this.createSystemContext(similarDocs[0].content, similarDocs[0].docsurl);

    return this.getChatResponse(this.embedding.embeddingProvider, userInput, context);
  }
}
