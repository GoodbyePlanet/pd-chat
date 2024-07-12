import { ReactElement, useRef } from "react";
import { useMutation } from "react-query";
import SearchBox from "@/components/Search";
import { Answer } from "@/components/Answer";

import styles from "./Loader.module.css";
import { useRecoilValue } from "recoil";
import { llmProviderState } from "@/store/llm-provider";

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
    throw new Error(`Failed to create question: ${response.status}`);
  }

  return response.json();
};

export default function PDChat(): ReactElement {
  const mutation = useMutation<MutationResponse, Error, { question: string }>(createQuestion);
  const currentLlmProvider = useRecoilValue(llmProviderState);

  const inputRef = useRef<HTMLInputElement>(null);

  const saveQuestion = async (question: string): Promise<void> => {
    await fetch("/api/save-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
  };

  const handleCreateQuestion = async (question: string): Promise<void> => {
    try {
      await mutation.mutateAsync({ question });
      await saveQuestion(question);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const isTimeoutError = mutation.isError && mutation.error?.message?.includes(TIMEOUT_ERROR_CODE);

  return (
    <>
      <div className="w-4/5 md:w-3/5 lg:w-3/5">
        <p className="mb-5 text-center italic">
          Please note that this is the <span className="font-medium">MVP version</span>, and there
          is a possibility of receiving incorrect answers. We kindly request you to submit any such
          instances so that we can improve them in future iterations. Presently, you can inquire
          about the following topics:{" "}
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
    </>
  );
}

function ErrorMessage({ message }: { message: string }): ReactElement {
  return <div className="mt-5 font-semibold text-red">{message}</div>;
}
