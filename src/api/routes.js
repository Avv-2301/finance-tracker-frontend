const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/$/, '');

export const API_ROUTES = Object.freeze({
  signup: `${API_BASE_URL}/api/auth/signup`,
  login: `${API_BASE_URL}/api/auth/login`,
  currentUser: `${API_BASE_URL}/api/auth/me`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  expenses: `${API_BASE_URL}/api/expenses`,
});
