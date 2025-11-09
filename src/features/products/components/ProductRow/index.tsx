import { memo, type ReactElement, type CSSProperties } from "react";
import { type RowComponentProps } from "react-window";
import type { Product } from "../../types";
import styles from "./ProductRow.module.css";
import { useProductRow, type AriaAttrs } from "./useProductRow";
import { THUMB_SIZE } from "../../constants/table";

export interface RowProps {
  products: Product[];
  onProductSelect: (id: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

function ProductRowBase({
  index,
  style,
  products,
  onProductSelect,
  hasNextPage,
  isFetchingNextPage,
  ariaAttributes,
}: RowComponentProps<RowProps> & { ariaAttributes: AriaAttrs }) {
  const isLoaderRow =
    index === products.length && hasNextPage && isFetchingNextPage;
  const product = products[index];

  const { ariaRowIndex, onActivate, onKeyDown } = useProductRow(
    product,
    index,
    ariaAttributes,
    onProductSelect
  );

  if (isLoaderRow) {
    return (
      <div
        style={style}
        role="row"
        aria-rowindex={ariaRowIndex}
        className={styles.loadingRow}
      >
        <div className={styles.spinner}>
          <div />
          <div />
          <div />
        </div>
        <span role="cell">Loading more products...</span>
      </div>
    );
  }

  if (!product) {
    return <div style={style} role="row" aria-rowindex={ariaRowIndex} />;
  }

  return (
    <div
      style={style}
      className={styles.row}
      role="row"
      aria-rowindex={ariaRowIndex}
      tabIndex={0}
      aria-label={`Open ${product.title} details`}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      data-product-id={product.id}
    >
      <div className={styles.cell} role="cell">
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.thumbnail}
          loading="lazy"
          decoding="async"
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          draggable={false}
        />
      </div>

      <div className={`${styles.cell} ${styles.title}`} role="cell">
        {product.title}
      </div>

      <div className={styles.cell} role="cell">
        <span className={styles.badge}>{product.category}</span>
      </div>

      <div className={styles.cell} role="cell">
        ${product.price.toFixed(2)}
      </div>

      <div className={styles.cell} role="cell">
        ⭐ {product.rating.toFixed(1)}
      </div>
    </div>
  );
}

export const ProductRowComponent = memo(ProductRowBase);

export type ProductRowRenderer = (
  props: {
    ariaAttributes: {
      "aria-posinset": number;
      "aria-setsize": number;
      role: "listitem";
    };
    index: number;
    style: CSSProperties;
  } & RowProps
) => ReactElement;

export const ProductRowForList =
  ProductRowComponent as unknown as ProductRowRenderer;
