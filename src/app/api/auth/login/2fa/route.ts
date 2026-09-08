import { NextResponse } from "next/server";
import { SERVER_API_URL } from "@/lib/api/config";
import { respondWithSession, type BackendSession } from "@/lib/session-cookie";

/** Segundo passo do login: só aqui a sessão é criada. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const res = await fetch(`${SERVER_API_URL}/auth/login/2fa`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data?.message ?? "Código inválido" },
      { status: res.status },
    );
  }

  return respondWithSession((await res.json()) as BackendSession);
}
