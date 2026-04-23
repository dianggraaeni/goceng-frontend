const defaultApiUrl = 'http://localhost:3001/v1';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/+$/, '');

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
