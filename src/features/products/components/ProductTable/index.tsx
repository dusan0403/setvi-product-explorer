import { useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { List } from "react-window";
import { useInfiniteProducts } from "../../hooks/useProducts";
import { ProductRowComponent } from "../ProductRow";
import { ProductTableSkeleton } from "../ProductTableSkeleton";
import styles from "./ProductTable.module.css";

interface ProductTableProps {
  onProductSelect: (id: number) => void;
}

const ROW_HEIGHT = 60;

export function ProductTable({ onProductSelect }: ProductTableProps) {
  const [searchParams] = useSearchParams();
  const listRef = useRef(null);

  const searchTerm = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts({ searchTerm, category });

  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data?.pages]
  );

  const loadMoreItems = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const itemCount = hasNextPage ? allProducts.length + 1 : allProducts.length;

  const onRowsRendered = useCallback(
    ({ stopIndex }: { stopIndex: number }) => {
      if (stopIndex >= allProducts.length - 5) {
        loadMoreItems();
      }
    },
    [allProducts.length, loadMoreItems]
  );

  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  if (isError) {
    return <div className={styles.message}>Error loading products</div>;
  }

  if (allProducts.length === 0) {
    return <div className={styles.message}>No products found</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div className={styles.headerCell}>Image</div>
        <div className={styles.headerCell}>Title</div>
        <div className={styles.headerCell}>Category</div>
        <div className={styles.headerCell}>Price</div>
        <div className={styles.headerCell}>Rating</div>
      </div>

      <List
        listRef={listRef}
        rowComponent={ProductRowComponent}
        rowCount={itemCount}
        rowHeight={ROW_HEIGHT}
        style={{ height: 600 }}
        onRowsRendered={(_visible, all) => onRowsRendered(all)}
        rowProps={{
          products: allProducts,
          onProductSelect,
          hasNextPage: !!hasNextPage,
          isFetchingNextPage
        }}
      />
    </div>
  );
}
