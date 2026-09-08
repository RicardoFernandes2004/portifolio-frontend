import axios, { AxiosError, type AxiosInstance } from "axios";
import { API_URL } from "./config";

/**
 * Cliente axios usado APENAS no browser (Client Components).
 * O JWT vive em cookie httpOnly, então o front pega o token via /api/auth/me
 * uma vez e mantém em memória para o axios anexar o Authorization.
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

let signingOut = false;

http.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      clearCachedToken();
      const path = window.location.pathname;
      if (path.startsWith("/admin") && !signingOut) {
        signingOut = true;
        // O cookie precisa morrer antes do redirect. O backend revoga o token
        // sem avisar o browser (outro login rotaciona a sessão, o reset de
        // senha derruba a atual), e aí o cookie continua válido pelo relógio:
        // /login se acha logado, devolve para /admin, que toma 401 de novo —
        // loop infinito. Sem sessão, /login mostra o formulário.
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
