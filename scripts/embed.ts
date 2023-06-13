import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";

import profitShare from "@/documents/profit-share.json";
import companyCulture from "@/documents/ company-culture.json";

type Document = {
  title: string,
  content: string,
  docsUrl: string
}

const generateEmbeddings = async (documents: Document[]) => {
  console.log("creating embeddings started...");

  for (const document of documents) {
    console.log("embedding for doc", document.title);
    const input = document.content.replace(/\n/g, ' ');

    const embeddingResponse = await openaiClient.createEmbedding({
      model: 'text-embedding-ada-002',
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    // In production we should handle possible errors
    await supabaseClient.from('documents').insert({
      title: document.title,
      content: document.content,
      docsurl: document.docsUrl,
      embedding,
    });
  }
};

(async () => {
  const documents: Document[] = [profitShare, companyCulture];
  await generateEmbeddings(documents);
})();