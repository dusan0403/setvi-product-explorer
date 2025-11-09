import { httpClient } from "../../../core/services/http.client";
import type { Category, Product, ProductsResponse } from "../types";
import type { GenericAbortSignal } from "axios";

type GetProductsParams = Readonly<{
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
}>;

class ProductService {
  async getProducts(
    params: GetProductsParams,
    signal?: GenericAbortSignal
  ): Promise<ProductsResponse> {
    const config = { params, ...(signal ? { signal } : {}) };
    const { data } = await httpClient.get<ProductsResponse>(
      "/products",
      config
    );
    return data;
  }

  async searchProducts(
    query: string,
    limit = 30,
    skip = 0,
    signal?: GenericAbortSignal
  ): Promise<ProductsResponse> {
    const config = {
      params: { q: query, limit, skip },
      ...(signal ? { signal } : {}),
    };
    const { data } = await httpClient.get<ProductsResponse>(
      "/products/search",
      config
    );
    return data;
  }

  async getProductsByCategory(
    category: string,
    limit = 30,
    skip = 0,
    signal?: GenericAbortSignal
  ): Promise<ProductsResponse> {
    const config = { params: { limit, skip }, ...(signal ? { signal } : {}) };
    const { data } = await httpClient.get<ProductsResponse>(
      `/products/category/${category}`,
      config
    );
    return data;
  }

  async getProductById(
    id: number,
    signal?: GenericAbortSignal
  ): Promise<Product> {
    const config = signal ? { signal } : undefined;
    const { data } = await httpClient.get<Product>(`/products/${id}`, config);
    return data;
  }

  async getCategories(signal?: GenericAbortSignal): Promise<Category[]> {
    const config = signal ? { signal } : undefined;
    const { data } = await httpClient.get<Category[]>(
      "/products/categories",
      config
    );
    return data;
  }
}

export const productService = new ProductService();
