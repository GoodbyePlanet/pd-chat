import React, { ReactElement, useEffect, useState } from "react";

import styles from "./Answer.module.css";

interface AnswerProps {
  text: string;
  question: string;
}

interface HrefProps {
  index: number;
  word: string;
}

interface WordProps {
  index: number;
  word: string;
}

interface WrongAnswerProps {
  onSubmitWrongAnswer: (wrongAnswer?: string) => void;
}

export const Answer = ({ question, text }: AnswerProps): ReactElement => {
  const [words, setWords] = useState<Array<string>>([]);
  const [isTextAnimationComplete, setIsTextAnimationComplete] = useState<boolean>(false);
  const [isWrongAnswerSubmitted, setIsWrongAnswerSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setWords(text?.split(" "));
  }, [text]);

  useEffect(() => {
    if (words.length > 0) {
      const lastWordIndex = words.length - 1;
      const lastWordDelay = lastWordIndex * 0.05 * 1000; // Delay in milliseconds

      setTimeout(() => {
        setIsTextAnimationComplete(true);
      }, lastWordDelay + 400);
    }
  }, [words]);

  const handleOnSubmitWrongAnswer = async (reason?: string): Promise<void> => {
    setIsTextAnimationComplete(false);
    setIsWrongAnswerSubmitted(true);

    await fetch("/api/wrong-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer: text, ...(reason && { reason }) }),
    });
  };

  return (
    <>
      <div className="mb-5 font-semibold">{question}</div>
      {words.map((word, index) => {
        if (word.startsWith("https://")) {
          return <Href key={index} index={index} word={word} />;
        }

        return <Word key={index} index={index} word={word} />;
      })}
      {isTextAnimationComplete && <WrongAnswer onSubmitWrongAnswer={handleOnSubmitWrongAnswer} />}
      {isWrongAnswerSubmitted && <GratitudeText />}
    </>
  );
};

const WrongAnswer = ({ onSubmitWrongAnswer }: WrongAnswerProps): ReactElement => {
  const [reason, setReason] = useState("");

  return (
    <div className="mt-8">
      <span className="italic">
        If this answer is incorrect please submit wrong answer so that we can improve this chat in
        the next iterations.{" "}
      </span>
      <div>
        <label htmlFor="small-input" className="text-gray-900 mt-2 block text-sm font-medium">
          This input is optional but it would help us if you would write reason why you think it is
          incorrect answer.
        </label>
        <input
          type="text"
          id="small-input"
          className="text-gray-900 border-gray-300 bg-gray-50 focus:ring-blue-100 focus:border-blue-500 mb-5 mt-2 block w-full rounded-lg border p-2 focus:outline-none focus:ring sm:text-xs"
          placeholder="Reason"
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
      <button
        type="submit"
        onClick={() => onSubmitWrongAnswer(reason)}
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
      Thank you for submitting wrong answer. We will try to improve our response in next iterations!
    </span>
  </div>
);

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

const Word = ({ index, word }: WordProps): ReactElement => (
  <span key={index} className={styles.fadeIn} style={{ animationDelay: `${index * 0.05}s` }}>
    {word}{" "}
  </span>
);
