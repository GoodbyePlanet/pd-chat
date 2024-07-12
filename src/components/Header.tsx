import { ReactElement } from "react";
import { Logout } from "@/components/Logout";

type LLMProviders = {
  name: string;
  description: string;
};

const llmProviders: LLMProviders[] = [
  {
    name: "Ollama",
    description: "ollama3",
  },
  {
    name: "OpenAI",
    description: "gpt 3.5 turbo",
  },
  {
    name: "Anthropic",
    description: "claude",
  },
];

export default function Header(): ReactElement {
  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex items-center justify-between p-6 lg:px-8">
        <div className="flex">
          <span className="">PD Chat</span>
        </div>
        <form className="mx-auto flex max-w-sm items-center justify-center">
          <select
            id="countries"
            className="border-gray-400 rounded border bg-white p-2.5 font-semibold text-pd shadow"
          >
            {llmProviders.map((llm: LLMProviders, index: number) => (
              <option key={index} value={llm.name}>
                {llm.description}
              </option>
            ))}
          </select>
        </form>
        <Logout />
      </nav>
    </header>
  );
}
