import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Opt } from "../types";
import { KEYS } from "../../../constants/keys";

export function useListboxNav(
  options: Opt[],
  value: string,
  onChange: (v: string) => void
) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);

  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const baseId = useId();
  const listId = `${baseId}-list`;
  const activeId = highlight >= 0 ? `${baseId}-opt-${highlight}` : undefined;

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value]
  );

  const focusList = useCallback(() => {
    listRef.current?.focus();
  }, []);

  const focusButton = useCallback(() => {
    btnRef.current?.focus();
  }, []);

  const openList = useCallback(() => setOpen(true), []);
  const closeList = useCallback(() => setOpen(false), []);
  const toggleList = useCallback(() => setOpen((o) => !o), []);

  const commit = useCallback(
    (i: number) => {
      const opt = options[i];
      if (!opt) return;
      onChange(opt.value);
      closeList();
      focusButton();
    },
    [options, onChange, closeList, focusButton]
  );

  useEffect(() => {
    if (!open) return;
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === value)
    );
    setHighlight(idx);
    focusList();
  }, [open, options, value, focusList]);

  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = document.getElementById(`${baseId}-opt-${highlight}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, highlight, baseId]);

  const onListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const k = e.key;

      if (k === KEYS.ESCAPE) {
        e.preventDefault();
        closeList();
        focusButton();
        return;
      }
      if (k === KEYS.ENTER || k === KEYS.SPACE) {
        e.preventDefault();
        commit(Math.max(0, highlight));
        return;
      }
      if (k === KEYS.ARROW_DOWN) {
        e.preventDefault();
        setHighlight((h) => Math.min(options.length - 1, Math.max(0, h) + 1));
        return;
      }
      if (k === KEYS.ARROW_UP) {
        e.preventDefault();
        setHighlight((h) => Math.max(0, (h < 0 ? 0 : h) - 1));
        return;
      }
      if (k === KEYS.HOME) {
        e.preventDefault();
        setHighlight(0);
        return;
      }
      if (k === KEYS.END) {
        e.preventDefault();
        setHighlight(options.length - 1);
        return;
      }
      if (k === KEYS.TAB) return;
    },
    [closeList, focusButton, commit, highlight, options.length]
  );

  return {
    open,
    highlight,
    setHighlight,
    btnRef,
    listRef,
    ids: { baseId, listId, activeId },
    selectedLabel,
    openList,
    closeList,
    toggleList,
    commit,
    onListKeyDown,
  };
}
