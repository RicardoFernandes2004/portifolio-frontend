import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_EXP_COOKIE } from "@/lib/api/config";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(AUTH_COOKIE);
  res.cookies.delete(AUTH_EXP_COOKIE);
  return res;
}
