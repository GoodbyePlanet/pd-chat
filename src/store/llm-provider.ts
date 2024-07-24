import { atom, selector } from "recoil";
import { Models } from "@/types";

type LLMProvider = string;

const selectedLLMProvider = atom<LLMProvider>({
  key: "llmProvider",
  default: Models.LLAMA_3,
});

const llmProviderState = selector({
  key: "llmProviderState",
  get: ({ get }) => {
    return get(selectedLLMProvider);
  },
});

export { selectedLLMProvider, llmProviderState };
