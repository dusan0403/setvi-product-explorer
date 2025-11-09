import styles from "./ProductTable.module.css";
import { List } from "react-window";
import { ProductRowForList } from "../ProductRow";
import { ProductTableSkeleton } from "../ProductTableSkeleton";
import { useProductTable } from "./useProductTable";
import { LIST_HEIGHT, OVERSCAN_COUNT, ROW_HEIGHT } from "../../constants/table";

interface ProductTableProps {
  onProductSelect: (id: number) => void;
}

export function ProductTable({ onProductSelect }: ProductTableProps) {
  const {
    listRef,
    isLoading,
    isError,
    hasNextPage,
    allProducts,
    onRowsRendered,
    rowProps,
  } = useProductTable(onProductSelect);

  if (isLoading) return <ProductTableSkeleton />;
  if (isError)
    return <div className={styles.message}>Error loading products</div>;
  if (allProducts.length === 0)
    return <div className={styles.message}>No products found</div>;

  return (
    <div className={styles.tableContainer} role="table" aria-label="Products">
      <div className={styles.header} role="rowgroup">
        <div className={styles.headerCell} role="columnheader">
          Image
        </div>
        <div className={styles.headerCell} role="columnheader">
          Title
        </div>
        <div className={styles.headerCell} role="columnheader">
          Category
        </div>
        <div className={styles.headerCell} role="columnheader">
          Price
        </div>
        <div className={styles.headerCell} role="columnheader">
          Rating
        </div>
      </div>

      <div role="rowgroup">
        <List
          listRef={listRef}
          rowComponent={ProductRowForList}
          rowCount={hasNextPage ? allProducts.length + 1 : allProducts.length}
          rowHeight={ROW_HEIGHT}
          style={{ height: LIST_HEIGHT }}
          onRowsRendered={onRowsRendered}
          rowProps={rowProps}
          overscanCount={OVERSCAN_COUNT}
        />
      </div>
    </div>
  );
}
