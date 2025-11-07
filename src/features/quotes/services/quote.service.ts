import { httpClient } from "../../../core/services/http.client";
import type { QuotesResponse } from "../types";

class QuoteService {
  private cachedQuotes: string | null = null;

  async getAllQuotes(): Promise<QuotesResponse> {
    const { data } = await httpClient.get<QuotesResponse>("/quotes");
    return data;
  }

  async getCombinedQuotesText(): Promise<string> {
    if (this.cachedQuotes) {
      return this.cachedQuotes;
    }

    const { quotes } = await this.getAllQuotes();
    this.cachedQuotes = quotes
      .map((q) => q.quote)
      .join(" ");

    return this.cachedQuotes;
  }

  clearCache(): void {
    this.cachedQuotes = null;
  }
}

export const quoteService = new QuoteService();
