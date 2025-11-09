import styles from "./ProductFilters.module.css";
import { SimpleSelect } from "../../../../shared/components/SimpleSelect";
import { useProductFilters } from "./useProductFilters";

export function ProductFilters() {
  const {
    searchInput,
    setSearchInput,
    urlCategory,
    handleCategoryChange,
    categoryOptions,
  } = useProductFilters();

  return (
    <div className={styles.filters}>
      <input
        id="product-search"
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={styles.searchInput}
        aria-label="Search products"
        autoComplete="off"
      />

      <SimpleSelect
        value={urlCategory}
        options={categoryOptions}
        onChange={handleCategoryChange}
        width={220}
      />
    </div>
  );
}
