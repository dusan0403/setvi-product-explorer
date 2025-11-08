import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/useProducts";
import styles from "./ProductFilters.module.css";
import { useDebounce } from "../../../../shared/hooks/useDebounce";

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const debouncedSearch = useDebounce(searchInput, 300);
  const { data: categories } = useCategories();

   useEffect(() => {
     const params = new URLSearchParams(searchParams);
     if (debouncedSearch) {
       params.set("search", debouncedSearch);
     } else {
       params.delete("search");
     }
     params.delete("page");
     setSearchParams(params);
   }, [debouncedSearch, searchParams, setSearchParams]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={styles.searchInput}
      />

      <select
        onChange={(e) => handleCategoryChange(e.target.value)}
        value={searchParams.get("category") || ""}
        className={styles.categorySelect}
      >
        <option value="">All Categories</option>
        {categories?.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
