import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useListRef } from "react-window";
import { useInfiniteProducts } from "../../hooks/useProducts";
import { PAGE_LIMIT, PREFETCH_BUFFER, URL_PAGE_DEBOUNCE_MS } from "../../constants/table";

export function useProductTable(onProductSelect: (id: number) => void) {
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useListRef(null);

  const urlUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const lastUpdatedPageRef = useRef(1);

  const searchTerm = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const urlPage = Number(searchParams.get("page")) || 1;

  const filters = useMemo(() => {
    const f: { searchTerm?: string; category?: string; limit: number } = {
      limit: PAGE_LIMIT,
    };
    if (searchTerm) f.searchTerm = searchTerm;
    if (category) f.category = category;
    return f;
  }, [searchTerm, category]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts(filters);

  const allProducts = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data?.pages]
  );

  const currentLoadedPages = Math.ceil(allProducts.length / PAGE_LIMIT);

  useEffect(() => {
    lastUpdatedPageRef.current = 1;
    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
      urlUpdateTimeoutRef.current = null;
    }
  }, [searchTerm, category]);

  useEffect(() => {
    if (
      !isLoading &&
      !isFetchingNextPage &&
      urlPage > currentLoadedPages &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  }, [
    urlPage,
    currentLoadedPages,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current)
        clearTimeout(urlUpdateTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollToRow({ index: 0, align: "start" });
  }, [searchTerm, category, listRef]);

  const loadMoreItems = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const onRowsRendered = useCallback(
    (
      _visible: { startIndex: number; stopIndex: number },
      all: { startIndex: number; stopIndex: number }
    ) => {
      if (
        all.stopIndex >= allProducts.length - PREFETCH_BUFFER &&
        hasNextPage
      ) {
        loadMoreItems();
      }

      const viewingPage = Math.ceil((all.stopIndex + 1) / PAGE_LIMIT);

      if (
        viewingPage !== lastUpdatedPageRef.current &&
        viewingPage <= currentLoadedPages
      ) {
        if (urlUpdateTimeoutRef.current)
          clearTimeout(urlUpdateTimeoutRef.current);

        urlUpdateTimeoutRef.current = setTimeout(() => {
          lastUpdatedPageRef.current = viewingPage;
          setSearchParams(
            (prev) => {
              const params = new URLSearchParams(prev);
              params.set("page", viewingPage.toString());
              return params;
            },
            { replace: true }
          );
        }, URL_PAGE_DEBOUNCE_MS);
      }
    },
    [
      allProducts.length,
      hasNextPage,
      loadMoreItems,
      currentLoadedPages,
      setSearchParams,
    ]
  );

  const rowProps = useMemo(
    () => ({
      products: allProducts,
      onProductSelect,
      hasNextPage: !!hasNextPage,
      isFetchingNextPage,
    }),
    [allProducts, onProductSelect, hasNextPage, isFetchingNextPage]
  );

  return {
    listRef,
    isLoading,
    isError,
    hasNextPage: !!hasNextPage,
    allProducts,
    onRowsRendered,
    rowProps,
    PAGE_LIMIT,
  };
}
