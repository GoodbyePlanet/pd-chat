import { ReactElement } from "react";
import { useMutation } from "react-query";
import SearchBox from "@/components/Search";
import { Answer } from "@/components/Answer";

import styles from "@/pages/index.module.css";

const createQuestion = async (question) => {
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

  const handleCreateQuestion = async (question) => {
    try {
      const postData = { question };

      await mutation.mutateAsync(postData);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className="text-center mb-5 text-pd text-5xl font-bold">PD Chat</h3>
      <SearchBox onSearch={handleCreateQuestion} />
      {mutation.isLoading && <p> Loading... </p>}
      {mutation.isSuccess && (
        <div className="mt-8">
          <Answer text={mutation.data?.answer} />
        </div>
      )}
    </div>
  );
}
