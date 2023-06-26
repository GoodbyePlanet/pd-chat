import { ReactElement } from "react";
import { useMutation } from "react-query";
import SearchBox from "@/components/Search";
import { Answer } from "@/components/Answer";
import styles from "./Loader.module.css";

const createQuestion = async (question: {
  question: string;
}): Promise<{ answer: string }> => {
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

const TIMEOUT_ERROR = "504";

export default function PDChat(): ReactElement {
  const mutation = useMutation(createQuestion);

  const handleCreateQuestion = async (question: string): Promise<void> => {
    try {
      await mutation.mutateAsync({ question });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const isTimeoutError =
    // @ts-ignore
    mutation.isError && mutation.error?.message?.includes(TIMEOUT_ERROR);

  return (
    <div className="w-4/5 md:w-3/5 lg:w-3/5">
      <h3 className="mb-5 mt-5 text-center text-5xl font-bold text-pd">
        PD Chat
      </h3>
      <p className="mb-5 text-center italic">
        Please note that this is the{" "}
        <span className="font-medium">MVP version</span>, and there is a
        possibility of receiving incorrect answers. We kindly request you to
        submit any such instances so that we can improve them in future
        iterations. Presently, you can inquire about the following topics:{" "}
        <span className="font-medium">
          Profit Share, Knowledge Sharing, Company Culture, Vacation and Days
          Off, Benefits, and Time Tracking.
        </span>
      </p>
      <SearchBox onSearch={handleCreateQuestion} />
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
      {mutation.isError && (
        <ErrorMessage message="Sorry for inconvenience, we are experiencing issues on the server, please ask a question later!" />
      )}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }): ReactElement {
  return <div className="mt-5 font-semibold text-red">{message}</div>;
}
