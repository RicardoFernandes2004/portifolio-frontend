import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "pf_token";
const AUTH_EXP_COOKIE = "pf_token_exp";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const exp = req.cookies.get(AUTH_EXP_COOKIE)?.value;

  let valid = false;
  if (token && exp) {
    const expDate = new Date(exp);
    valid = !Number.isNaN(expDate.getTime()) && expDate.getTime() > Date.now();
  }

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?from=${encodeURIComponent(pathname + search)}`;
    const res = NextResponse.redirect(url);
    if (token || exp) {
      res.cookies.delete(AUTH_COOKIE);
      res.cookies.delete(AUTH_EXP_COOKIE);
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
