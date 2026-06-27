import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/types/auth';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);

const COOKIE_NAME = 'session';
const MAX_AGE = 60 * 60 * 24; // 24h

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(accessToken: string, userId: string, email: string): Promise<void> {
  const expiresAt = new Date(Date.now() + MAX_AGE * 1000).toISOString();
  const sessionToken = await encrypt({ userId, email, expiresAt, accessToken });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await decrypt(token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) {
    await deleteSession();
    return null;
  }
  return session;
}
