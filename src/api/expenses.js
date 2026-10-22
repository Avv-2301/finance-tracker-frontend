import { apiRequest } from "./client.js";
import { API_ROUTES } from "./routes.js";

export const expenseApi = {
  add: (expense) =>
    apiRequest(API_ROUTES.expenses, { method: "POST", body: expense }),
  getAll: (filters = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, value);
      }
    }
    const queryString = query.toString();
    return apiRequest(
      `${API_ROUTES.expenses}${queryString ? `?${queryString}` : ""}`
    );
  },
  getDashboardAnalytics: (filters) => {
    const query = new URLSearchParams(filters).toString();
    return apiRequest(`${API_ROUTES.expenses}/analytics/dashboard?${query}`);
  },
  getById: (transactionId) =>
    apiRequest(`${API_ROUTES.expenses}/${encodeURIComponent(transactionId)}`),
  delete: (transactionId) =>
    apiRequest(`${API_ROUTES.expenses}/${encodeURIComponent(transactionId)}`, {
      method: "DELETE",
    }),
};
