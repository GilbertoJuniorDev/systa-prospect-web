import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

  let fastifyRes: Response;
  try {
    fastifyRes = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  if (!fastifyRes.ok) {
    const data = await fastifyRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: data.error ?? 'Invalid credentials' },
      { status: fastifyRes.status },
    );
  }

  const { accessToken } = (await fastifyRes.json()) as { accessToken: string };

  const payload = JSON.parse(
    Buffer.from(accessToken.split('.')[1], 'base64url').toString(),
  ) as { userId: string; email: string };

  await createSession(accessToken, payload.userId, payload.email);

  return NextResponse.json({ ok: true });
}
