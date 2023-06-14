import React, { useEffect, useState } from "react";

import styles from "./Answer.module.css";

export const Answer = ({ text }) => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

  return (
    <div>
      {words.map((word, index) => (
        <span
          key={index}
          className={styles.fadeIn}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {word}{" "}
        </span>
      ))}
    </div>
  );
};
