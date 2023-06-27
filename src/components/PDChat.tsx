import { ReactElement, useRef } from "react";
import { useMutation } from "react-query";
import SearchBox from "@/components/Search";
import { Answer } from "@/components/Answer";

import styles from "./Loader.module.css";

const TIMEOUT_ERROR_CODE = "504";

type MutationResponse = {
  answer: string;
};

type MutationFunction = (question: { question: string }) => Promise<MutationResponse>;

const createQuestion: MutationFunction = async (question): Promise<MutationResponse> => {
  const response = await fetch("/api/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`);
  }

  return response.json();
};

export default function PDChat(): ReactElement {
  const mutation = useMutation<MutationResponse, Error, { question: string }>(createQuestion);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateQuestion = async (question: string): Promise<void> => {
    try {
      await mutation.mutateAsync({ question });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const isTimeoutError = mutation.isError && mutation.error?.message?.includes(TIMEOUT_ERROR_CODE);

  return (
    <div className="w-4/5 md:w-3/5 lg:w-3/5">
      <h3 className="mb-5 mt-5 text-center text-5xl font-bold text-pd">PD Chat</h3>
      <p className="mb-5 text-center italic">
        Please note that this is the <span className="font-medium">MVP version</span>, and there is
        a possibility of receiving incorrect answers. We kindly request you to submit any such
        instances so that we can improve them in future iterations. Presently, you can inquire about
        the following topics:{" "}
        <span className="font-medium">
          Profit Share, Knowledge Sharing, Company Culture, Vacation and Days Off, Benefits, and
          Time Tracking.
        </span>
      </p>
      <SearchBox onSearch={handleCreateQuestion} inputRef={inputRef} />
      {mutation.isLoading && <span className={styles.loader}></span>}
      {mutation.isSuccess && (
        <div className="mt-5">
          <Answer
            question={mutation.variables?.question as string}
            text={mutation.data?.answer as string}
          />
        </div>
      )}
      {isTimeoutError && (
        <ErrorMessage message="Sorry for inconvenience, OpenAI is busy right now, please ask a question later!" />
      )}
      {mutation.isError && !isTimeoutError && (
        <ErrorMessage message="Sorry for inconvenience, we are experiencing issues on the server, please ask a question later!" />
      )}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }): ReactElement {
  return <div className="mt-5 font-semibold text-red">{message}</div>;
}
