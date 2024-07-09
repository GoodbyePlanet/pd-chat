import { Databases, Document, EmbeddingProviders } from "@/types";
import { supabaseClient } from "@/utils/supabaseClient";
import { drizzleClient } from "@/utils/pg-drizzle-client";
import { documents as documentsTable } from "../drizzle-schema";
import { Embedding } from "./embedding";

export class DatabaseClient {
  readonly database: string;

  constructor(database: string = Databases.PG_VECTOR) {
    this.database = database;
  }

  private getDBClientStoreFunc(): StoreFunc {
    return storeFuncsByDatabaseName[this.database as keyof DBClientFunc];
  }

  public async storeEmbeddingsInDB(documents: Document[], embedding: Embedding): Promise<void> {
    try {
      for (const doc of documents) {
        console.log("Generating embedding for: ", doc.title);

        const input = doc.content.replace(/\n/g, " ");
        const embeddings = await embedding.generate(input);
        const storeEmbeddingsInDB = this.getDBClientStoreFunc();

        storeEmbeddingsInDB(doc, embeddings);
        console.log("Embedding stored for: ", doc.title);
      }
    } catch (error: any) {
      console.error("An error occurred while creating/saving embeddings!");
    }
  }
}

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

type StoreFunc = (document: Document, embedding: number[]) => void;

type DBClientFunc = {
  supabase: StoreFunc;
  pgVector: StoreFunc;
};

const storeFuncsByDatabaseName: DBClientFunc = {
  [Databases.PG_VECTOR]: storeInPgVector,
  [Databases.SUPABASE]: storeInSupabase,
};
