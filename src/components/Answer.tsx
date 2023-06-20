import React, { ReactElement, useEffect, useState } from "react";

import styles from "./Answer.module.css";

interface Props {
  text: string;
  question: string;
}

export const Answer = ({ question, text }: Props): ReactElement => {
  const [words, setWords] = useState<Array<string>>([]);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [isWrongAnswerSubmitted, setIsWrongAnswerSubmitted] = useState(false);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

  useEffect(() => {
    if (words.length > 0) {
      const lastWordIndex = words.length - 1;
      const lastWordDelay = lastWordIndex * 0.05 * 1000; // Delay in milliseconds

      setTimeout(() => {
        setIsTextComplete(true);
      }, lastWordDelay + 400);
    }
  }, [words]);

  const handleOnSubmitWrongAnswer = async (): Promise<void> => {
    setIsTextComplete(false);
    setIsWrongAnswerSubmitted(true);

    const response = await fetch("/api/wrong-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer: text }),
    });

    console.log("RESPONSE", response);
  };

  return (
    <div>
      {words.map((word, index) => {
        if (word.startsWith("https://")) {
          return (
            <a
              href={word}
              className={styles.fadeIn}
              style={{ color: "#02609A", animationDelay: `${index * 0.05}s` }}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
            >
              {word}{" "}
            </a>
          );
        }

        return (
          <span
            key={index}
            className={styles.fadeIn}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {word}{" "}
          </span>
        );
      })}
      {isTextComplete && (
        <div className="mt-4">
          <span className="italic">
            If this answer is incorrect please submit wrong answer so that we
            can improve this chat in the next iterations.{" "}
          </span>
          <button
            type="submit"
            onClick={handleOnSubmitWrongAnswer}
            className="focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2 block rounded-lg bg-pd px-3 py-2 text-center text-xs font-medium text-white hover:bg-pd focus:outline-none focus:ring-4"
          >
            Submit wrong answer
          </button>
        </div>
      )}
      {isWrongAnswerSubmitted && (
        <div className="mt-4">
          <span className="font-semibold italic">
            Thank you for submitting wrong answer. We will try to improve our
            response in the next iterations!
          </span>
        </div>
      )}
    </div>
  );
};
