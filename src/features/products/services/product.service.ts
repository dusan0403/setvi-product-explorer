import { httpClient } from "../../../core/services/http.client";
import type { Product, ProductsResponse } from "../types";

interface GetProductsParams {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
}

class ProductService {
  async getProducts(params: GetProductsParams): Promise<ProductsResponse> {
    const { data } = await httpClient.get<ProductsResponse>("/products", {
      params,
    });
    return data;
  }

  async searchProducts(
    query: string,
    limit = 30,
    skip = 0
  ): Promise<ProductsResponse> {
    const { data } = await httpClient.get<ProductsResponse>(
      "/products/search",
      {
        params: { q: query, limit, skip },
      }
    );
    return data;
  }

  async getProductsByCategory(
    category: string,
    limit = 30,
    skip = 0
  ): Promise<ProductsResponse> {
    const { data } = await httpClient.get<ProductsResponse>(
      `/products/category/${category}`,
      {
        params: { limit, skip },
      }
    );
    return data;
  }

  async getProductById(id: number): Promise<Product> {
    const { data } = await httpClient.get<Product>(`/products/${id}`);
    return data;
  }

  async getCategories(): Promise<string[]> {
    const { data } = await httpClient.get<string[]>("/products/categories");
    return data;
  }
}

export const productService = new ProductService();
