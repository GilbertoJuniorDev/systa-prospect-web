import { jwtVerify } from 'jose';
import type { SessionPayload } from '@/types/auth';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
