import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/proxy',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// The session cookie (httpOnly) travels automatically on same-origin requests;
// /api/proxy reads it server-side and forwards the JWT to the backend.
// When the backend returns 401 (expired/invalid session), redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
