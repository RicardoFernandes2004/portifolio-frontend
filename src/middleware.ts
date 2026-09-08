import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const AUTH_COOKIE = "pf_token";
const AUTH_EXP_COOKIE = "pf_token_exp";

const intlMiddleware = createIntlMiddleware(routing);

/** Sessão válida = token presente e ainda não expirado. */
function hasValidSession(req: NextRequest): boolean {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const exp = req.cookies.get(AUTH_EXP_COOKIE)?.value;
  if (!token || !exp) return false;
  const expDate = new Date(exp);
  return !Number.isNaN(expDate.getTime()) && expDate.getTime() > Date.now();
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // O painel fica fora do [locale]: só o guard de sessão, sem prefixo de idioma.
  if (pathname.startsWith("/admin")) {
    if (hasValidSession(req)) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?from=${encodeURIComponent(pathname + search)}`;
    const res = NextResponse.redirect(url);
    res.cookies.delete(AUTH_COOKIE);
    res.cookies.delete(AUTH_EXP_COOKIE);
    return res;
  }

  // Rotas públicas: o next-intl reescreve `/blog` -> `/pt/blog` e mantém `/en/blog`.
  return intlMiddleware(req);
}

export const config = {
  // Tudo menos rotas de API, assets do Next e arquivos estáticos (com extensão).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
