import { useState } from "react";
import styles from "./ProductsPage.module.css";
import { ProductFilters } from "../../features/products/components/ProductFilters";
import { ProductTable } from "../../features/products/components/ProductTable";
import { ProductDetailDrawer } from "../../features/products/components/ProductDetailDrawer";

export function ProductsPage() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  return (
    <div className={styles.container}>
      <header className={styles.header} role="banner">
        <div className={styles.content}>
          <h1 className={styles.title}>Product Explorer</h1>
        </div>
      </header>

      <main className={styles.main} role="main">
        <div
          className={styles.content}
          role="region"
          aria-labelledby="filters-heading"
        >
          <h2 id="filters-heading" className={styles.visuallyHidden}>
            Filters
          </h2>
          <ProductFilters />
        </div>

        <div
          className={styles.content}
          role="region"
          aria-labelledby="table-heading"
        >
          <h2 id="table-heading" className={styles.visuallyHidden}>
            Products table
          </h2>
          <ProductTable onProductSelect={setSelectedProductId} />
        </div>
      </main>

      <ProductDetailDrawer
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
}
