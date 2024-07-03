import { openaiClient } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";
import { AIModels } from "@/types";

const executeQuery = async (): Promise<void> => {
  const embeddingResponse = await openaiClient.createEmbedding({
    model: AIModels.OPEN_AI_EMBEDDING,
    input: "In which cities Productdock has offices?",
  });

  const [{ embedding }] = embeddingResponse.data.data;
  console.log("QUERY EMBEDDING", embedding);

  const { data: chunks, error } = await supabaseClient.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.01,
    match_count: 2,
  });

  if (error) {
    console.error(error);
  }

  console.log("DATA", chunks);
};

(async () => {
  await executeQuery();
})();
