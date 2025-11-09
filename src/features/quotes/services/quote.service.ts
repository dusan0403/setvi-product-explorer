import type { GenericAbortSignal } from "axios";
import { httpClient } from "../../../core/services/http.client";
import type { QuotesResponse } from "../types";

class QuoteService {

  async getAllQuotes(signal?: GenericAbortSignal): Promise<QuotesResponse> {
    const config = signal ? { signal } : undefined;
    const { data } = await httpClient.get<QuotesResponse>("/quotes", config);
    return data;
  }

  async getCombinedQuotesText(signal?: GenericAbortSignal): Promise<string> {
    const config = signal ? { signal } : undefined;
    const { data } = await httpClient.get<QuotesResponse>("/quotes", config);

    return data.quotes
      .map((q) => q.quote?.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }
}

export const quoteService = new QuoteService();
