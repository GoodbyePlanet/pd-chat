import { ReactElement, useState } from "react";
import { useRecoilState } from "recoil";
import { Logout } from "@/components/Logout";
import { selectedLLMProvider } from "@/store/llm-provider";
import { Models } from "@/types";

type LLMProviders = {
  name: string;
  description: string;
  link: string;
};

const llmProviders: LLMProviders[] = [
  {
    name: Models.LLAMA_3,
    description: "ollama3:8b",
    link: "https://ollama.com/library/llama3",
  },
  {
    name: Models.LLAMA_3_1,
    description: "ollama3.1:8b",
    link: "https://ollama.com/library/llama3.1",
  },
  {
    name: Models.GEMMA_2,
    description: "gemma2:9b",
    link: "https://ollama.com/library/gemma2",
  },
  {
    name: Models.PHI_3,
    description: "phi3:3.8b",
    link: "https://ollama.com/library/gemma2",
  },
  {
    name: Models.DAVINCI_TURBO,
    description: "gpt 3.5 turbo",
    link: "https://platform.openai.com/docs/models/gpt-3-5-turbo",
  },
  {
    name: Models.CLAUDE_3_HAIKU,
    description: "claude",
    link: "https://www.anthropic.com/news/claude-3-haiku",
  },
  {
    name: Models.MISTRAL_LARGE,
    description: "mistral-large",
    link: "https://mistral.ai/news/mistral-large",
  },
];

export default function Header(): ReactElement {
  const [selectedProvider, setSelectedProvider] = useRecoilState(selectedLLMProvider);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);

  const toggleModelProviderSelect = (): void => setIsModelSelectOpen(!isModelSelectOpen);

  const handleLLMProviderChange = (llmName: string) => {
    setSelectedProvider(llmName);
    setIsModelSelectOpen(false);
  };

  const getLLMProviderName = (): string => {
    return llmProviders.filter((llm) => llm.name === selectedProvider)[0]?.description;
  };

  return (
    <header className="absolute flex w-full content-between bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex w-full items-center justify-between p-2 lg:px-8"
      >
        <div className="flex">
          <span className="">PD Chat</span>
        </div>
        <div className="relative">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="bg-blue-700 inline-flex items-center rounded-lg px-5 py-2.5 text-center font-medium"
            type="button"
            onClick={toggleModelProviderSelect}
          >
            {getLLMProviderName()}{" "}
            <svg
              className="ms-3 h-2.5 w-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path stroke="currentColor" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <div
            id="dropdown"
            className={`${
              isModelSelectOpen ? "block" : "hidden"
            } divide-gray-100 dark:bg-gray-700 absolute top-12 z-10 w-44 divide-y rounded-lg bg-white shadow`}
          >
            <ul>
              {llmProviders.map((llm: LLMProviders, index: number) => (
                <li
                  className="bg-sky-500 hover:bg-sky-700 cursor-pointer px-4 py-2"
                  key={index}
                  value={llm.name}
                  onClick={() => handleLLMProviderChange(llm.name)}
                >
                  <div className="flex justify-between">
                    <p>{llm.description}</p>{" "}
                    <a href={llm.link} target="_blank">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="10" stroke="black" />
                        <line x1="12" y1="16" x2="12" y2="12" stroke="black" />
                        <circle cx="12" cy="9" r="1" fill="black" />
                      </svg>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Logout />
      </nav>
    </header>
  );
}
