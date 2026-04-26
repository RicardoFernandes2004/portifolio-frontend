import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_EXP_COOKIE, SERVER_API_URL } from "@/lib/api/config";

interface BackendLoginResponse {
  user: { id: number; username: string; email: string };
  token: string;
  tokenExpiresAt: string;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const res = await fetch(`${SERVER_API_URL}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data?.message ?? "Falha no login" },
      { status: res.status },
    );
  }

  const data = (await res.json()) as BackendLoginResponse;
  const expiresAt = new Date(data.tokenExpiresAt);
  const maxAge = Math.max(
    0,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  );

  const response = NextResponse.json({
    user: data.user,
    tokenExpiresAt: data.tokenExpiresAt,
  });

  response.cookies.set(AUTH_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  response.cookies.set(AUTH_EXP_COOKIE, data.tokenExpiresAt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return response;
}
