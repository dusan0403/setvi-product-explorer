import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { productQueryKeys } from "../constants/query-keys";
import type { GenericAbortSignal } from "axios";

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
  const filters = {
    ...(searchTerm ? { searchTerm } : {}),
    ...(category ? { category } : {}),
    limit,
  } satisfies { searchTerm?: string; category?: string; limit: number };

  return useInfiniteQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: async ({ pageParam = 0, signal }) => {
      const s = signal as GenericAbortSignal | undefined;
      if (searchTerm) {
        return productService.searchProducts(searchTerm, limit, pageParam, s);
      }
      if (category) {
        return productService.getProductsByCategory(
          category,
          limit,
          pageParam,
          s
        );
      }
      return productService.getProducts({ limit, skip: pageParam }, s);
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
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useProductDetail(productId: number | null) {
  return useQuery({
    queryKey: productQueryKeys.detail(productId!),
    queryFn: ({ signal }) =>
      productService.getProductById(productId!, signal as GenericAbortSignal),
    enabled: !!productId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: ({ signal }) =>
      productService.getCategories(signal as GenericAbortSignal),
    staleTime: 1000 * 60 * 60,
  });
}
