import { CoreMessage, generateText, LanguageModel } from "ai";
import dedent from "ts-dedent";
import { ChatResponse, SimilarDocument } from "@/types";
import { logger } from "@/utils/logger";

const log = logger.child({ module: "BaseLLMChat" }, { level: "error" });

export abstract class BaseLLMChat {
  protected abstract model: LanguageModel;

  public async chat(userInput: string, documents: SimilarDocument[]): Promise<ChatResponse> {
    const response = await generateText({
      model: this.model,
      messages: this.createChatCompletionMessages(
        documents[0].content,
        documents[0].docsurl,
        userInput
      ),
    });

    if (response.finishReason === "error") {
      log.error("An error occurred while generating chat response");
      return { error: "Could not generate chat completion!" };
    }

    return { text: response.text };
  }

  protected createChatCompletionMessages(
    contentText: string,
    docsUrl: string,
    input: string
  ): CoreMessage[] {
    return [
      { role: "system", content: this.createSystemContext(contentText, docsUrl) },
      {
        role: "user",
        content: input,
      },
    ];
  }

  protected createSystemContext(contentText: string, docsUrl: string): string {
    return dedent`You are a very enthusiastic representative of Productdock company who loves to help employees. Given the following:

      Context section:
      ${contentText}

      Answer the questions as truthfully as possible, and if you're unsure of the answer, say 'Sorry, I don't know the answer at this moment. 
      Please refer to the official documentation ${docsUrl} or ask directly your Unit lead manager.
    `;
  }
}
