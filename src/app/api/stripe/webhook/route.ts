import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

// Rota PÚBLICA chamada pelos servidores da Stripe. Repassa o corpo cru + a
// assinatura para a API interna (privada), que é quem valida a assinatura.
// De propósito NÃO verifica a assinatura aqui: STRIPE_WEBHOOK_SECRET fica só no backend.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 1_000_000; // payloads do Stripe são pequenos; barra abuso na rota pública

export async function POST(request: NextRequest): Promise<NextResponse> {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }

  const rawBody = await request.arrayBuffer();
  if (rawBody.byteLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  let backendRes: Response;
  try {
    backendRes = await backendFetch('/stripe/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') ?? 'application/json',
        'stripe-signature': signature,
      },
      body: rawBody,
    });
  } catch {
    return NextResponse.json({ error: 'forward_failed' }, { status: 502 });
  }

  // Repassa status/corpo do backend: 200 (ok), 400 (assinatura inválida), 5xx → Stripe re-tenta.
  const text = await backendRes.text();
  return new NextResponse(text, {
    status: backendRes.status,
    headers: { 'content-type': backendRes.headers.get('content-type') ?? 'application/json' },
  });
}
