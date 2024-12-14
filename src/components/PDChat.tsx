import { ReactElement, useRef } from "react";
import { useMutation } from "react-query";
import ChatForm from "@/components/ChatForm";
import { Answer } from "@/components/Answer";

import styles from "./Loader.module.css";
import { useRecoilValue } from "recoil";
import { llmProviderState } from "@/store/llm-provider";

const TIMEOUT_ERROR_CODE = "504";

type MutationResponse = {
  answer: string;
};

type MutationFunction = (mutationData: {
  question: string;
  llm: string;
}) => Promise<MutationResponse>;

const createQuestion: MutationFunction = async ({ question, llm }): Promise<MutationResponse> => {
  const response = await fetch("/api/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, llm }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create question: ${response.status}`);
  }

  return response.json();
};

export default function PDChat(): ReactElement {
  const mutation = useMutation<MutationResponse, Error, { question: string; llm: string }>(
    createQuestion
  );
  const currentLlmProvider = useRecoilValue(llmProviderState);

  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      await mutation.mutateAsync({ question, llm: currentLlmProvider });
      // await saveQuestion(question);

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
      <div className="stretch mx-2 flex flex-col gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="flex h-90vh flex-col items-center justify-center">
          <p className="text-center italic">
            Please note that this is the <span className="font-medium">MVP version</span>, and there
            is a possibility of receiving incorrect answers. We kindly request you to submit any
            such instances so that we can improve them in future iterations. Presently, you can
            inquire about the following topics:{" "}
            <span className="font-medium">
              Profit Share, Knowledge Sharing, Company Culture, Vacation and Days Off, Benefits, and
              Time Tracking.
            </span>
          </p>
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
        <ChatForm onSearch={handleCreateQuestion} inputRef={inputRef} />
      </div>
    </>
  );
}

function ErrorMessage({ message }: { message: string }): ReactElement {
  return <div className="mt-5 font-semibold text-red">{message}</div>;
}
