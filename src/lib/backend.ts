import 'server-only';

const API_URL = process.env.API_URL ?? 'http://localhost:3333';

/** fetch server-side para o backend Fastify, sempre com o segredo interno. */
export function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'x-internal-api-key': process.env.INTERNAL_API_KEY ?? '',
      ...init.headers,
    },
  });
}
