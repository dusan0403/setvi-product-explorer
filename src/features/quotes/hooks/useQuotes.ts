import { useQuery } from "@tanstack/react-query";
import { quoteService } from "../services/quote.service";

export function useQuotesText(productId: number | null) {
  return useQuery({
    queryKey: ["quotes", "combined-text", productId],
    queryFn: () => quoteService.getCombinedQuotesText(),
    enabled: !!productId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

export function useAllQuotes() {
  return useQuery({
    queryKey: ["quotes", "all"],
    queryFn: () => quoteService.getAllQuotes(),
    staleTime: Infinity,
  });
}
