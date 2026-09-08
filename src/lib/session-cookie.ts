import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_EXP_COOKIE } from "@/lib/api/config";

export interface BackendSession {
  user: { id: number; username: string; email: string };
  token: string;
  tokenExpiresAt: string;
}

/**
 * Resposta de login com os cookies httpOnly da sessão.
 * Compartilhada pelos dois passos do login (senha e segundo fator) para que a
 * política de cookie exista num lugar só.
 */
export function respondWithSession(data: BackendSession): NextResponse {
  const expiresAt = new Date(data.tokenExpiresAt);
  const maxAge = Math.max(
    0,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  );

  const response = NextResponse.json({
    user: data.user,
    tokenExpiresAt: data.tokenExpiresAt,
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
  response.cookies.set(AUTH_COOKIE, data.token, options);
  response.cookies.set(AUTH_EXP_COOKIE, data.tokenExpiresAt, options);

  return response;
}
