import { useCallback, useMemo } from "react";
import type { Product } from "../../types";
import { KEYS } from "../../../../shared/constants/keys";

export type AriaAttrs = {
  "aria-posinset": number;
  "aria-setsize": number;
  role: "listitem";
};

export function useProductRow(
  product: Product | undefined,
  index: number,
  ariaAttributes: AriaAttrs | undefined,
  onProductSelect: (id: number) => void
) {
  const ariaRowIndex = useMemo(() => {
    const pos =
      typeof ariaAttributes?.["aria-posinset"] === "number"
        ? ariaAttributes["aria-posinset"]
        : index;
    return pos + 1;
  }, [ariaAttributes, index]);

  const onActivate = useCallback(() => {
    if (product) onProductSelect(product.id);
  }, [product, onProductSelect]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === KEYS.SPACE) {
        e.preventDefault();
        onActivate();
      } else if (e.key === KEYS.ENTER) {
        onActivate();
      }
    },
    [onActivate]
  );

  return {
    ariaRowIndex,
    onActivate,
    onKeyDown,
  };
}
