import React, { useEffect, useState } from "react";

import styles from "./Answer.module.css";

export const Answer = ({ text }) => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

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
              {word}
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
    </div>
  );
};
