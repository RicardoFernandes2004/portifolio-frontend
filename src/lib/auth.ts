import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_EXP_COOKIE } from "./api/config";

export interface ServerSession {
  token: string;
  expiresAt: Date;
}

export function getServerSession(): ServerSession | null {
  const jar = cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const exp = jar.get(AUTH_EXP_COOKIE)?.value;
  if (!token || !exp) return null;
  const expDate = new Date(exp);
  if (Number.isNaN(expDate.getTime())) return null;
  if (expDate.getTime() <= Date.now()) return null;
  return { token, expiresAt: expDate };
}

export function isLoggedInServer(): boolean {
  return getServerSession() !== null;
}
