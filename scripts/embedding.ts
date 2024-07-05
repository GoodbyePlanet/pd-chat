import { openaiClient } from "@/utils/openaiClient";
import ollama from "ollama";
import { AIModels, Document } from "@/types";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { drizzleClient } from "@/utils/pg-drizzle-client";
import { supabaseClient } from "@/utils/supabaseClient";
import { documents as documentsTable } from "../drizzle-schema";

type Providers = {
  [key: string]: string;
};

export enum EmbeddingProviders {
  OPEN_AI = "OPEN_AI",
  OLLAMA = "OLLAMA",
}

enum Databases {
  PG_VECTOR = "pgVector",
  SUPABASE = "supabase",
}

export const EMBEDDING_PROVIDERS: Providers = {
  OPEN_AI: "text-embedding-ada-002",
  OLLAMA: "nomic-embed-text",
};

const embedWithAda002 = async (input: string): Promise<number[]> => {
  const embeddingResponse = await openaiClient.createEmbedding({
    model: EMBEDDING_PROVIDERS.OPEN_AI,
    input,
  });

  const [{ embedding }] = embeddingResponse.data.data;
  return embedding;
};

const embedWithNomic = async (input: string): Promise<number[]> => {
  const response = await ollama.embeddings({
    model: AIModels.OLLAMA_EMBEDDING,
    prompt: input,
  });

  return response.embedding;
};

type EmbedFunc = {
  [key: string]: (input: string) => Promise<number[]>;
};

const EMBED_FUNC: EmbedFunc = {
  OPEN_AI: embedWithAda002,
  OLLAMA: embedWithNomic,
};

type DBClient = {
  pgVector: PostgresJsDatabase;
  supabase: SupabaseClient<any, "public", any>;
};

const DB_CLIENTS: DBClient = {
  pgVector: drizzleClient,
  supabase: supabaseClient,
};

const storeInSupabase = async (document: Document, embedding: number[]): Promise<void> => {
  await supabaseClient.from("documents").insert({
    title: document.title,
    content: document.content,
    docsurl: document.docsUrl,
    embedding,
  });
};

const storeInPgVector = async (document: Document, embedding: number[]): Promise<void> => {
  await drizzleClient
    .insert(documentsTable)
    .values({
      title: document.title,
      content: document.content,
      docsurl: document.docsUrl,
      embedding,
    })
    .execute();
};

type DBClientFunc = {
  supabase: (document: Document, embedding: number[]) => void;
  pgVector: (document: Document, embedding: number[]) => void;
};

const storeEmbedding: DBClientFunc = {
  [Databases.PG_VECTOR]: storeInPgVector,
  [Databases.SUPABASE]: storeInSupabase,
};

export class Embedding {
  embeddingProvider: string;
  database: string;

  constructor(
    embeddingProvider: string = EmbeddingProviders.OLLAMA,
    database: string = Databases.PG_VECTOR
  ) {
    this.embeddingProvider = embeddingProvider;
    this.database = database;
  }

  private async generateEmbeddings(input: string): Promise<number[]> {
    const embedFunc = EMBED_FUNC[this.embeddingProvider as keyof EmbedFunc];

    return embedFunc(input);
  }

  public async storeEmbeddingsToDB(documents: Document[]): Promise<void> {
    try {
      for (const doc of documents) {
        console.log("Generating embedding for: ", doc.title);
        const input = doc.content.replace(/\n/g, " ");

        const embedding = await this.generateEmbeddings(input);
        storeEmbedding[this.database as keyof DBClientFunc](doc, embedding);
        console.log("Embedding stored for: ", doc.title);
      }
    } catch (error: any) {
      console.error("An error occurred while creating/saving embeddings");
    }
  }
}
