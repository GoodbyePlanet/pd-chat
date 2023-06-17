import { ReactElement } from "react";
import { useMutation } from "react-query";
import SearchBox from "@/components/Search";
import { Answer } from "@/components/Answer";

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
    throw new Error("Failed to create post");
  }

  return response.json();
};

export default function PDChat(): ReactElement {
  const mutation = useMutation(createQuestion);

  const handleCreateQuestion = async (question: string): Promise<void> => {
    try {
      await mutation.mutateAsync({ question });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="w-4/5 md:w-3/5 lg:w-3/5">
      <h3 className="mb-5 text-center text-5xl font-bold text-pd">PD Chat</h3>
      <SearchBox onSearch={handleCreateQuestion} />
      {mutation.isLoading && <p> Loading... </p>}
      {mutation.isSuccess && (
        <div className="mt-8">
          <Answer text={mutation.data?.answer as string} />
        </div>
      )}
    </div>
  );
}
