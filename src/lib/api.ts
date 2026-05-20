const defaultApiUrl = 'http://localhost:3001/v1';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/+$/, '');

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

/**
 * Wrapper around native fetch that automatically attaches:
 *  - Authorization: Bearer <token>
 *  - X-Messaging-Account-Id: <selectedAccountId>
 *
 * Usage: apiFetch('/dashboard/summary')  or  apiFetch('/transactions', { method: 'POST', body: ... })
 */
export const apiFetch = (path: string, init: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  const selectedAccountId = localStorage.getItem('selectedAccountId');

  const headers = new Headers(init.headers);

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (selectedAccountId && !headers.has('X-Messaging-Account-Id')) {
    headers.set('X-Messaging-Account-Id', selectedAccountId);
  }

  return fetch(buildApiUrl(path), { ...init, headers });
};
