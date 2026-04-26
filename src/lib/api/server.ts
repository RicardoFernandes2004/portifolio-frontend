import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, SERVER_API_URL } from "./config";

interface FetchOptions extends RequestInit {
  auth?: boolean;
  json?: unknown;
}

/**
 * fetch helper para Server Components / Route Handlers.
 * - prefixa SERVER_API_URL
 * - lê o JWT do cookie httpOnly e injeta Authorization quando auth=true
 * - serializa body via `json`
 * - sem cache por padrão (no-store) para refletir mudanças do admin
 */
export async function apiFetch(path: string, opts: FetchOptions = {}): Promise<Response> {
  const { auth, json, headers, ...rest } = opts;
  const finalHeaders = new Headers(headers);
  if (json !== undefined) {
    finalHeaders.set("content-type", "application/json");
  }
  if (auth) {
    const token = cookies().get(AUTH_COOKIE)?.value;
    if (token) finalHeaders.set("authorization", `Bearer ${token}`);
  }
  return fetch(`${SERVER_API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: rest.cache ?? "no-store",
  });
}

export async function apiGet<T>(path: string, init?: RequestInit & { auth?: boolean }): Promise<T> {
  const res = await apiFetch(path, { ...init, method: "GET" });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiGetSafe<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T | null> {
  try {
    const res = await apiFetch(path, { ...init, method: "GET" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
