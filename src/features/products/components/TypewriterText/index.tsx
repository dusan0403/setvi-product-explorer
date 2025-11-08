import { useEffect, useState } from "react";
import styles from "./TypewriterText.module.css";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export function TypewriterText({ text, speed = 30 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={styles.typewriter}>
      {displayedText}
      {currentIndex < text.length && <span className={styles.cursor}>|</span>}
    </div>
  );
}
