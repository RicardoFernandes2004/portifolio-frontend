import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_EXP_COOKIE } from "@/lib/api/config";

/**
 * Retorna o token (httpOnly) atual para uso no axios do client.
 * É autenticação client-side mediada pelo Next; o cookie httpOnly nunca
 * é exposto ao JS, mas o client pode obter o token nesta rota same-origin
 * para poder anexar Authorization às chamadas diretas ao backend.
 */
export async function GET() {
  const jar = cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const exp = jar.get(AUTH_EXP_COOKIE)?.value;
  if (!token || !exp) {
    return NextResponse.json({ token: null }, { status: 200 });
  }
  const expDate = new Date(exp);
  if (Number.isNaN(expDate.getTime()) || expDate.getTime() <= Date.now()) {
    return NextResponse.json({ token: null }, { status: 200 });
  }
  return NextResponse.json({
    token,
    tokenExpiresAt: exp,
  });
}
