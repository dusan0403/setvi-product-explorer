import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT)

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
})

if (import.meta.env.DEV) {
  httpClient.interceptors.request.use((config) => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`)
    return config
  })
}