import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { productQueryKeys } from "../constants/query-keys";

interface UseProductsParams {
  searchTerm?: string;
  category?: string;
  limit?: number;
}

export function useInfiniteProducts({
  searchTerm,
  category,
  limit = 30,
}: UseProductsParams = {}) {
  return useInfiniteQuery({
    queryKey: productQueryKeys.list({ searchTerm, category, limit }),
    queryFn: async ({ pageParam = 0 }) => {
      if (searchTerm) {
        return productService.searchProducts(searchTerm, limit, pageParam);
      }
      if (category) {
        return productService.getProductsByCategory(category, limit, pageParam);
      }
      return productService.getProducts({ limit, skip: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (acc, page) => acc + page.products.length,
        0
      );
      if (loadedCount >= lastPage.total) return undefined;
      return loadedCount;
    },
    initialPageParam: 0,
  });
}

export function useProductDetail(productId: number | null) {
  return useQuery({
    queryKey: productQueryKeys.detail(productId!),
    queryFn: () => productService.getProductById(productId!),
    enabled: !!productId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productQueryKeys.categories,
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 60,
  });
}
