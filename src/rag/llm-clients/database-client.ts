import { Databases, Document } from "@/types";
import { supabaseClient } from "@/database/supabaseClient";
import { drizzleClient } from "@/database/pg-drizzle-client";
import { documents, documents as documentsTable } from "../../../drizzle-schema";
import { Embedding } from "../embedding/embedding";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

export class DatabaseClient {
  readonly database: string;

  constructor(database: string = Databases.PG_VECTOR) {
    this.database = database;
  }

  private getDBClientStoreFunc(): StoreFunc {
    return storeFuncsByDBName[this.database as keyof DBClientStoreFunc];
  }

  private getSimilaritySearchFunc(): SimilarityFunc {
    return similaritySearchFuncsByDBName[this.database as keyof DBClientSimilarityFunc];
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

  public async getSimilarDocumentsFromDB(queryEmbeddings: number[]): Promise<SimilarDocument[]> {
    const similaritySearchFunc = this.getSimilaritySearchFunc();

    return similaritySearchFunc(queryEmbeddings);
  }
}

const similarDocumentsInPgVector = async (queryEmbedding: number[]): Promise<SimilarDocument[]> => {
  const similarity = sql<number>`1 - (
  ${cosineDistance(documents.embedding, queryEmbedding)}
  )`;

  return drizzleClient
    .select({
      title: documents.title,
      content: documents.content,
      docsurl: documents.docsurl,
      similarity,
    })
    .from(documents)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(1);
};

const similarDocumentsInSupabase = async (querystring: number[]): Promise<SimilarDocument[]> => {
  // TODO: return real data from supabase
  return Promise.resolve([
    {
      title: "supabase",
      content: "supabase content",
      docsurl: "http://url.com",
      similarity: 1,
    },
  ]);
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

type StoreFunc = (document: Document, embedding: number[]) => void;

type SimilarityFunc = (queryEmbedding: number[]) => Promise<SimilarDocument[]>;

type DBClientStoreFunc = {
  supabase: StoreFunc;
  pgVector: StoreFunc;
};

type DBClientSimilarityFunc = {
  supabase: SimilarityFunc;
  pgVector: SimilarityFunc;
};

export type SimilarDocument = {
  title: string;
  content: string;
  docsurl: string;
  similarity: number;
};

const storeFuncsByDBName: DBClientStoreFunc = {
  [Databases.SUPABASE]: storeInSupabase,
  [Databases.PG_VECTOR]: storeInPgVector,
};

const similaritySearchFuncsByDBName: DBClientSimilarityFunc = {
  [Databases.SUPABASE]: similarDocumentsInSupabase,
  [Databases.PG_VECTOR]: similarDocumentsInPgVector,
};
