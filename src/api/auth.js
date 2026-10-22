import { apiRequest } from "./client.js";
import { API_ROUTES } from "./routes.js";

export const authApi = {
  signup: (credentials) =>
    apiRequest(API_ROUTES.signup, { method: "POST", body: credentials }),
  login: (credentials) =>
    apiRequest(API_ROUTES.login, { method: "POST", body: credentials }),
  currentUser: () => apiRequest(API_ROUTES.currentUser),
  logout: () => apiRequest(API_ROUTES.logout, { method: "POST" }),
};
