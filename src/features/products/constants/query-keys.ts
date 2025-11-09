export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filters: {
    searchTerm?: string;
    category?: string;
    limit?: number;
    initialSkip?: number;
  }) => [...productQueryKeys.lists(), filters] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
  categories: () => [...productQueryKeys.all, "categories"] as const,
} as const;
