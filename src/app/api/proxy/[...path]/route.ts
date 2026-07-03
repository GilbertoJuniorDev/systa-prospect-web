import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { backendFetch } from '@/lib/backend';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params;
  const session = await getSession();

  const headers: Record<string, string> = {};
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  let backendRes: Response;
  try {
    backendRes = await backendFetch(
      `/${path.join('/')}${request.nextUrl.search}`,
      {
        method: request.method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
      },
    );
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const body = await backendRes.arrayBuffer();
  const resHeaders = new Headers();
  const backendContentType = backendRes.headers.get('content-type');
  if (backendContentType) resHeaders.set('content-type', backendContentType);
  const contentDisposition = backendRes.headers.get('content-disposition');
  if (contentDisposition) resHeaders.set('content-disposition', contentDisposition);

  return new NextResponse(body, { status: backendRes.status, headers: resHeaders });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
