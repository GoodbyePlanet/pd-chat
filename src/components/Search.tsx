import React, { useState, ReactElement, FormEvent } from "react";

interface Props {
  onSearch: (question: string) => {};
}

export default function SearchBox({ onSearch }: Props): ReactElement {
  const [question, setQuestion] = useState("");

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (onSearch) {
      onSearch(question);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <label
        htmlFor="default-search"
        className="text-gray-900 sr-only mb-2 text-sm font-medium dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            aria-hidden="true"
            className="text-gray-500 dark:text-gray-400 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="text-gray-900 border-gray-300 bg-gray-50 focus:ring-blue-100 block w-full rounded-lg border p-4 pl-10 pr-10 text-sm focus:outline-none focus:ring"
          placeholder="Send a question"
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
        >
          <svg
            className="text-gray-500 dark:text-gray-400 h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            ></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
