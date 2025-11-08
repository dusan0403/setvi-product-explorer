import { type RowComponentProps } from "react-window";
import type { Product } from "../../types";
import styles from "./ProductRow.module.css";

interface RowProps {
  products: Product[];
  onProductSelect: (id: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function ProductRowComponent({
  index,
  style,
  products,
  onProductSelect,
  hasNextPage,
  isFetchingNextPage,
}: RowComponentProps<RowProps>) {
  if (index === products.length && hasNextPage && isFetchingNextPage) {
    return (
      <div style={style} className={styles.loadingRow}>
        <div className={styles.spinner}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <span>Loading more products...</span>
      </div>
    );
  }

  const product = products[index];

  if (!product) {
    return <div style={style} />;
  }

  return (
    <div
      style={style}
      className={styles.row}
      onClick={() => onProductSelect(product.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onProductSelect(product.id);
        }
      }}
    >
      <div className={styles.cell}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.thumbnail}
          loading="lazy"
        />
      </div>
      <div className={`${styles.cell} ${styles.title}`}>{product.title}</div>
      <div className={styles.cell}>{product.category}</div>
      <div className={styles.cell}>${product.price.toFixed(2)}</div>
      <div className={styles.cell}>⭐ {product.rating.toFixed(1)}</div>
    </div>
  );
}
