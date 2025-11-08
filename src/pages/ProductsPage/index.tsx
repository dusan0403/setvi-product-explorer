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
      <header className={styles.header}>
        <h1 className={styles.title}>Product Explorer</h1>
      </header>

      <main className={styles.main}>
        <ProductFilters />
        <ProductTable onProductSelect={setSelectedProductId} />
      </main>

      <ProductDetailDrawer
        productId={selectedProductId}
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
}
