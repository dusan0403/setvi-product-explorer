import { useEffect, useRef, useState } from "react";
import {
  TYPEWRITER_DEFAULT_SPEED,
  TYPEWRITER_PAUSE,
} from "../../constants/typewriter";
import { safeLocal } from "../../../../shared/utils/safeLocalStorage";

type Params = {
  text: string;
  productId?: number | null | undefined;
  speed?: number;
  ignoreCacheThisSession?: boolean;
};

export function useTypewriterText({
  text,
  productId,
  speed = TYPEWRITER_DEFAULT_SPEED,
  ignoreCacheThisSession = false,
}: Params) {
  const pid = productId ?? null;

  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);

  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setDisplayedText("");
    setDone(false);
    indexRef.current = 0;

    if (pid == null) return;

    if (!ignoreCacheThisSession) {
      const key = `summary:${pid}`;
      const saved = safeLocal.get(key);
      if (saved) {
        setDisplayedText(saved);
        setDone(true);
        indexRef.current = saved.length;
        return;
      }
    }
  }, [text, pid, ignoreCacheThisSession]);

  useEffect(() => {
    if (done) return;

    if (indexRef.current >= text.length) {
      setDone(true);
      return;
    }

    const ch = text.charAt(indexRef.current);
    const delay = speed + (TYPEWRITER_PAUSE[ch] ?? 0);
    const currentIndex = indexRef.current;

    timerRef.current = setTimeout(() => {
      if (currentIndex !== indexRef.current) return;
      indexRef.current += 1;
      setDisplayedText((prev) => prev + ch);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speed, displayedText, done]);

  return { displayedText, done };
}
