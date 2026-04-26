import axios, { AxiosError, type AxiosInstance } from "axios";
import { API_URL } from "./config";

/**
 * Cliente axios usado APENAS no browser (Client Components).
 * O JWT vive em cookie httpOnly, então o front pega o token via /api/auth/me.
 * Para reduzir round-trip, no client usamos um token "público" (não httpOnly)
 * espelhado em pf_token_pub para o axios anexar Authorization automaticamente.
 */

let cachedToken: string | null = null;
let inflightToken: Promise<string | null> | null = null;

async function fetchTokenFromMe(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  if (inflightToken) return inflightToken;
  inflightToken = fetch("/api/auth/me", { credentials: "include" })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as { token?: string | null };
      cachedToken = data.token ?? null;
      return cachedToken;
    })
    .catch(() => null)
    .finally(() => {
      inflightToken = null;
    });
  return inflightToken;
}

export function clearCachedToken() {
  cachedToken = null;
}

export function setCachedToken(token: string | null) {
  cachedToken = token;
}

export const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const token = await fetchTokenFromMe();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      clearCachedToken();
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        window.location.href = `/login?from=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(err);
  },
);

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(", ") : data.message;
    }
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Erro desconhecido";
}
