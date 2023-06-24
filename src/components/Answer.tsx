import React, { ReactElement, useEffect, useState } from "react";

import styles from "./Answer.module.css";
import { Simulate } from "react-dom/test-utils";
import keyDown = Simulate.keyDown;

interface AnswerProps {
  text: string;
  question: string;
}

export const Answer = ({ question, text }: AnswerProps): ReactElement => {
  const [words, setWords] = useState<Array<string>>([]);
  const [isTextComplete, setIsTextComplete] = useState<boolean>(false);
  const [isWrongAnswerSubmitted, setIsWrongAnswerSubmitted] =
    useState<boolean>(false);

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

    await fetch("/api/wrong-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer: text }),
    });
  };

  return (
    <>
      {words.map((word, index) => {
        if (word.startsWith("https://")) {
          return <Href key={index} index={index} word={word} />;
        }

        return <Word key={index} index={index} word={word} />;
      })}
      {isTextComplete && (
        <WrongAnswer onSubmitWrongAnswer={handleOnSubmitWrongAnswer} />
      )}
      {isWrongAnswerSubmitted && <GratitudeText />}
    </>
  );
};

interface WrongAnswerProps {
  onSubmitWrongAnswer: () => void;
}

const WrongAnswer = ({
  onSubmitWrongAnswer,
}: WrongAnswerProps): ReactElement => {
  return (
    <div className="mt-4">
      <span className="italic">
        If this answer is incorrect please submit wrong answer so that we can
        improve this chat in the next iterations.{" "}
      </span>
      <button
        type="submit"
        onClick={onSubmitWrongAnswer}
        className="focus:ring-red-300 mb-4 mt-2 block rounded-lg bg-red px-3 py-2 text-center text-xs font-medium text-white hover:bg-red focus:outline-none focus:ring-4"
      >
        Submit wrong answer
      </button>
    </div>
  );
};

const GratitudeText = (): ReactElement => (
  <div className="mt-4">
    <span className="font-semibold italic">
      Thank you for submitting wrong answer. We will try to improve our response
      in next iterations!
    </span>
  </div>
);

interface HrefProps {
  index: number;
  word: string;
}

const Href = ({ index, word }: HrefProps): ReactElement => (
  <a
    href={word}
    className={styles.fadeIn}
    style={{ color: "#02609A", animationDelay: `${index * 0.05}s` }}
    target="_blank"
    rel="noopener noreferrer"
  >
    {word}{" "}
  </a>
);

interface WordProps {
  index: number;
  word: string;
}

const Word = ({ index, word }: WordProps): ReactElement => {
  return (
    <span
      key={index}
      className={styles.fadeIn}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {word}{" "}
    </span>
  );
};
