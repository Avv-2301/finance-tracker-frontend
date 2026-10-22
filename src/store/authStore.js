import { create } from "zustand";
import { authApi } from "../api/auth.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  sessionExpiresAt: null,
  isInitializing: true,
  clearSession: () => set({ user: null, sessionExpiresAt: null }),

  initialize: async () => {
    try {
      const { user, expiresAt } = await authApi.currentUser();
      set({ user, sessionExpiresAt: expiresAt });
    } catch {
      set({ user: null, sessionExpiresAt: null });
    } finally {
      set({ isInitializing: false });
    }
  },

  checkSession: async () => {
    const { sessionExpiresAt } = get();
    if (sessionExpiresAt && Date.now() >= sessionExpiresAt) {
      set({ user: null, sessionExpiresAt: null });
    }

    try {
      const { user, expiresAt } = await authApi.currentUser();
      set({ user, sessionExpiresAt: expiresAt });
      return true;
    } catch {
      set({ user: null, sessionExpiresAt: null });
      return false;
    }
  },

  signup: async (credentials) => {
    return authApi.signup(credentials);
  },

  login: async (credentials) => {
    const { user, expiresAt } = await authApi.login(credentials);
    set({ user, sessionExpiresAt: expiresAt });
    return user;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, sessionExpiresAt: null });
    }
  },
}));
