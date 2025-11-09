import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT ?? "", 10) || 15000;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
})

if (import.meta.env.DEV) {
  httpClient.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase() || "GET";
    const url = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log(`[HTTP] ${method} ${url}`, config.params ?? {});
    return config;
  });
}