import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/useProducts";
import { useDebounce } from "../../../../shared/hooks/useDebounce";

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories, isLoading, isError } = useCategories();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput((prev) => (prev !== urlSearch ? urlSearch : prev));
  }, [urlSearch]);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (debouncedSearch) params.set("search", debouncedSearch);
        else params.delete("search");
        params.set("page", "1");
        return params;
      },
      { replace: true }
    );
  }, [debouncedSearch, urlSearch, setSearchParams]);

  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category === urlCategory) return;

      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (category) params.set("category", category);
        else params.delete("category");
        params.set("page", "1");
        return params;
      });
    },
    [setSearchParams, urlCategory]
  );

 const categoryOptions = useMemo(() => {
   if (isError) {
     return [{ value: "", label: "Error loading categories" }];
   }
   if (isLoading) {
     return [{ value: "", label: "Loading..." }];
   }
   return [
     { value: "", label: "All Categories" },
     ...(categories ?? []).map((c) => ({ value: c.slug, label: c.name })),
   ];
 }, [categories, isLoading, isError]);

  return {
    searchInput,
    setSearchInput,
    urlCategory,
    handleCategoryChange,
    categoryOptions,
  };
}
