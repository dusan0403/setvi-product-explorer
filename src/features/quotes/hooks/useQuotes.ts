import { useQuery } from "@tanstack/react-query";
import { quoteService } from "../services/quote.service";
import { quotesQueryKeys } from "../constants/query-keys";
import type { GenericAbortSignal } from "axios";

export function useQuotesText(enabled: boolean) {
  return useQuery({
    queryKey: quotesQueryKeys.combined(),
    queryFn: ({ signal }) =>
      quoteService.getCombinedQuotesText(signal as GenericAbortSignal),
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

export function useAllQuotes() {
  return useQuery({
    queryKey: quotesQueryKeys.list(),
    queryFn: ({ signal }) =>
      quoteService.getAllQuotes(signal as GenericAbortSignal),
    staleTime: Infinity,
  });
}
