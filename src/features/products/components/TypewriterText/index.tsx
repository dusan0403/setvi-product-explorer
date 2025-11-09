import { TYPEWRITER_DEFAULT_SPEED } from "../../constants/typewriter";
import styles from "./TypewriterText.module.css";
import { useTypewriterText } from "./useTypewriter";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  productId?: number | null;
  ignoreCacheThisSession?: boolean;
}

export function TypewriterText({
  text,
  speed = TYPEWRITER_DEFAULT_SPEED,
  productId,
  ignoreCacheThisSession = false,
}: TypewriterTextProps) {
  const { displayedText, done } = useTypewriterText({
    text,
    speed,
    productId,
    ignoreCacheThisSession,
  });

  return (
    <div className={styles.typewriter} aria-live="polite">
      {displayedText}
      {!done && <span className={styles.cursor} />}
    </div>
  );
}
