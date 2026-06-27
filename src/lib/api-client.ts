import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// null = not fetched yet | false = confirmed unauthenticated | string = valid token
let cachedToken: string | null | false = null;
let tokenFetchPromise: Promise<void> | null = null;

export function clearTokenCache(): void {
  cachedToken = null;
  tokenFetchPromise = null;
}

async function fetchToken(): Promise<void> {
  // Deduplicate concurrent token fetches — only one request in-flight at a time
  if (tokenFetchPromise) return tokenFetchPromise;
  tokenFetchPromise = (async () => {
    try {
      const res = await fetch('/api/auth/token');
      if (res.ok) {
        const data = (await res.json()) as { accessToken: string };
        cachedToken = data.accessToken;
      } else {
        // 401 = no session. Cache false so we don't retry on every request.
        cachedToken = false;
      }
    } catch {
      cachedToken = false;
    } finally {
      tokenFetchPromise = null;
    }
  })();
  return tokenFetchPromise;
}

apiClient.interceptors.request.use(async (config) => {
  if (cachedToken === null) await fetchToken();
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  }
  return config;
});

// When the backend returns 401 (expired/invalid token), clear the cache and
// redirect to login so the user can re-authenticate.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearTokenCache();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
