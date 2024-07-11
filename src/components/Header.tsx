import { ReactElement, useState } from "react";
import { Logout } from "@/components/Logout";
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from "@headlessui/react";

const llmProviders = [
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex">
          <span className="">PD Chat</span>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-700 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="rounded border bg-white px-4 py-2 text-sm font-semibold font-semibold leading-6 text-pd shadow">
              LLM Providers
            </PopoverButton>

            <PopoverPanel
              transition
              className="ring-gray-900/5 absolute top-full z-10 mt-3 overflow-hidden bg-white shadow-lg ring-1 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {llmProviders.map((item) => (
                  <div
                    key={item.name}
                    className="relative flex items-center gap-x-6 p-4 text-sm leading-6"
                  >
                    <div className="flex-auto cursor-pointer group-hover:bg-white">
                      <p className="text-gray-600 mt-1 group-hover:bg-white">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
        <Logout />
      </nav>
    </header>
  );
}
