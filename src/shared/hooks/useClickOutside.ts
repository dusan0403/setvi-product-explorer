import { useEffect } from "react";

export function useClickOutside(
  refs: ReadonlyArray<React.RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      const inside = refs.some((r) => r.current && r.current.contains(t));
      if (!inside) onOutside();
    }

    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [refs, onOutside, enabled]);
}
