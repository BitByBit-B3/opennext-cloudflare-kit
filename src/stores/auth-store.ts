import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; name?: string } | null;
  setUser: (user: { id: string; email: string; name?: string } | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
