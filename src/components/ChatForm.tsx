import React, { FormEvent, LegacyRef, ReactElement, useState } from "react";
import UploadIcon from "@/components/icons/UploadIcon";
import SubmitIcon from "@/components/icons/SubmitIcon";
import ReactTextareaAutosize from "react-textarea-autosize";

interface Props {
  onSearch: (question: string) => {};
  inputRef: LegacyRef<HTMLTextAreaElement>;
}

export default function ChatForm({ onSearch, inputRef }: Props): ReactElement {
  const [question, setQuestion] = useState("");

  const handleQuestionSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (onSearch) {
      onSearch(question);
    }
  };

  return (
    <form onSubmit={handleQuestionSubmit}>
      <div className="relative">
        <button
          type="button"
          tabIndex={1}
          className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
          aria-label="Attach files"
        >
          <UploadIcon />
        </button>
        <ReactTextareaAutosize
          required
          autoFocus
          tabIndex={0}
          style={{ height: 44, overflowY: "auto" }}
          rows={1}
          placeholder="Ask a question"
          className="text-gray-900 border-gray-300 bg-gray-50 focus:ring-blue-100 block w-full resize-none rounded-lg border p-4 pl-10 pr-10 text-sm focus:outline-none focus:ring"
          ref={inputRef}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
        >
          <SubmitIcon />
        </button>
      </div>
    </form>
  );
}
