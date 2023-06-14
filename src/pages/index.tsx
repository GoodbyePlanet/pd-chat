import { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { Inter } from "next/font/google";
import { Answer } from "@/components/Answer";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

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

function PDChat() {
  const mutation = useMutation(createQuestion);
  const [question, setQuestion] = useState("");

  const handleCreateQuestion = async () => {
    try {
      const postData = { question };

      console.log("post data", postData);
      await mutation.mutateAsync(postData);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Productdock GPT Chat</h1>
        <div className="question">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Your question"
          />
          <button
            className="submit-btn"
            onClick={handleCreateQuestion}
            disabled={mutation.isLoading}
          >
            Sumbit question
          </button>
        </div>
      </div>
      {mutation.isLoading && <p> Loading... </p>}
      {mutation.isSuccess && (
        <div className="answer">
          <Answer text={mutation.data?.answer} />
        </div>
      )}
    </>
  );
}

function QClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <PDChat />
    </QueryClientProvider>
  );
}

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <QClient />
    </main>
  );
}
