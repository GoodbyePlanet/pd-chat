import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { Databases, Document, Models, SimilarDocument } from "@/types";
import { supabaseClient } from "@/database/supabaseClient";
import { drizzleClient } from "@/database/pg-drizzle-client";
import {
  documents,
  documentsMistral,
  documentsMistral as mistralDocuments,
} from "../../../drizzle-schema";
import { Embedding } from "../embedding/embedding";

export class DatabaseClient {
  readonly database: string;
  readonly llmModel: string;

  constructor(database: string = Databases.PG_VECTOR, llmModel: string) {
    this.database = database;
    this.llmModel = llmModel;
  }

  private getDBClientStoreFunc(): StoreFunc {
    return storeFuncsByDBName[this.database as keyof DBClientStoreFunc];
  }

  private getSimilaritySearchFunc(): SimilarityFunc {
    return similaritySearchFuncsByDBName[this.database as keyof DBClientSimilarityFunc];
  }

  /**
   * Mistral generates embedding vectors of dimension 1024, and ollama, anthropic... are using vectors of dimension 768,
   * because of this we need different DB table for Mistral
   * @param model
   * @private
   */
  private getPgTable(model: string): DocumentsTable {
    return model === Models.MISTRAL_LARGE ? mistralDocuments : documents;
  }

  public async storeEmbeddingsInDB(documents: Document[], embedding: Embedding): Promise<void> {
    try {
      const storeEmbeddingsInDB = this.getDBClientStoreFunc();
      const table = this.getPgTable(this.llmModel);

      for (const doc of documents) {
        console.log("Generating embedding for: ", doc.title);

        const input = doc.content.replace(/\n/g, " ");
        const embeddings = await embedding.generate(input);

        storeEmbeddingsInDB(doc, embeddings, table);
        console.log("Embedding stored for: ", doc.title);
      }
    } catch (error: any) {
      console.error(`An error occurred while creating/saving embeddings! ${error}`);
    }
  }

  public async getSimilarDocumentsFromDB(queryEmbeddings: number[]): Promise<SimilarDocument[]> {
    const similaritySearchFunc = this.getSimilaritySearchFunc();

    return similaritySearchFunc(queryEmbeddings, this.getPgTable(this.llmModel));
  }
}

const similarDocumentsInPgVector = async (
  queryEmbedding: number[],
  pgTable: DocumentsTable
): Promise<SimilarDocument[]> => {
  const similarity = sql<number>`1 - (
  ${cosineDistance(pgTable.embedding, queryEmbedding)}
  )`;

  return drizzleClient
    .select({
      title: pgTable.title,
      content: pgTable.content,
      docsurl: pgTable.docsurl,
      similarity,
    })
    .from(pgTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(1);
};

const similarDocumentsInSupabase = async (
  queryEmbedding: number[],
  dbName: PgTable
): Promise<SimilarDocument[]> => {
  // type Chunk = {
  //   title: string;
  //   content: string;
  //   docsurl: string;
  // };
  // async function getContentFromDB(
  //   embedding: Array<number>
  // ): Promise<{ data: Array<Chunk>; error: any }> {
  //   const { data, error } = await supabaseClient.rpc("match_documents", {
  //     query_embedding: embedding,
  //     match_threshold: 0.01,
  //     match_count: 2,
  //   });
  //
  //   return { data, error };
  // }
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

const storeInPgVector = async (
  document: Document,
  embedding: number[],
  pgTable: DocumentsTable
): Promise<void> => {
  await drizzleClient
    .insert(pgTable)
    .values({
      title: document.title,
      content: document.content,
      docsurl: document.docsUrl,
      embedding,
    })
    .execute();
};

type StoreFunc = (document: Document, embedding: number[], pgTable: DocumentsTable) => void;

type SimilarityFunc = (
  queryEmbedding: number[],
  dbName: DocumentsTable
) => Promise<SimilarDocument[]>;

type DBClientStoreFunc = {
  supabase: StoreFunc;
  pgVector: StoreFunc;
};

type DBClientSimilarityFunc = {
  supabase: SimilarityFunc;
  pgVector: SimilarityFunc;
};

type DocumentsTable = typeof documents | typeof documentsMistral;

const storeFuncsByDBName: DBClientStoreFunc = {
  [Databases.SUPABASE]: storeInSupabase,
  [Databases.PG_VECTOR]: storeInPgVector,
};

const similaritySearchFuncsByDBName: DBClientSimilarityFunc = {
  [Databases.SUPABASE]: similarDocumentsInSupabase,
  [Databases.PG_VECTOR]: similarDocumentsInPgVector,
};
