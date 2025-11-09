import { useMemo } from "react";
import styles from "./SimpleSelect.module.css";
import { useListboxNav } from "./hooks/useListboxNav";
import type { SimpleSelectProps } from "./types";
import { useClickOutside } from "../../hooks/useClickOutside";

export function SimpleSelect({
  value,
  options,
  placeholder = "Select",
  onChange,
  className,
  width,
}: SimpleSelectProps) {
  const {
    open,
    highlight,
    setHighlight,
    btnRef,
    listRef,
    ids,
    selectedLabel,
    toggleList,
    closeList,
    commit,
    onListKeyDown,
  } = useListboxNav(options, value, onChange);

  useClickOutside([btnRef, listRef], closeList, open);

  const cls = useMemo(() => `${styles.wrap} ${className ?? ""}`, [className]);

  return (
    <div className={cls} style={width ? { width } : undefined}>
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={ids.listId}
        onClick={toggleList}
      >
        <span
          className={`${styles.value} ${
            selectedLabel ? "" : styles.placeholder
          }`}
        >
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`${styles.caret} ${open ? styles.caretOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={listRef}
          id={ids.listId}
          className={styles.list}
          role="listbox"
          tabIndex={0}
          aria-activedescendant={ids.activeId}
          onKeyDown={onListKeyDown}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === highlight;
            return (
              <div
                id={`${ids.baseId}-opt-${i}`}
                key={o.value}
                role="option"
                aria-selected={isSelected}
                className={`${styles.item} ${
                  isActive ? styles.itemActive : ""
                } ${isSelected ? styles.itemSelected : ""}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(i)}
              >
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
