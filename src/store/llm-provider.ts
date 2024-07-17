import { atom, selector } from "recoil";
import { EmbeddingProviders } from "@/types";

type LLMProvider = string;

const selectedLLMProvider = atom<LLMProvider>({
  key: "llmProvider",
  default: EmbeddingProviders.OLLAMA,
});

const llmProviderState = selector({
  key: "llmProviderState",
  get: ({ get }) => {
    return get(selectedLLMProvider);
  },
});

export { selectedLLMProvider, llmProviderState };
