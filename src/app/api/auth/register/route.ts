import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { backendFetch } from '@/lib/backend';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await backendFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json({ error: 'register_failed' }, { status: 500 });
  }

  if (!backendRes.ok) {
    if (backendRes.status === 409) {
      return NextResponse.json({ error: 'email_already_exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'register_failed' }, { status: 500 });
  }

  const { accessToken } = (await backendRes.json()) as { accessToken: string };

  const payload = JSON.parse(
    Buffer.from(accessToken.split('.')[1], 'base64url').toString(),
  ) as { userId: string; email: string };

  await createSession(accessToken, payload.userId, payload.email);

  return NextResponse.json({ success: true });
}
