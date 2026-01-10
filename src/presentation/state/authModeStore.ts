import { create } from "zustand";

export type AuthMode = "none" | "guest" | "authenticated";

type AuthModeState = {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  reset: () => void;
};

export const useAuthModeStore = create<AuthModeState>((set) => ({
  mode: "none",
  setMode: (mode) => set({ mode }),
  reset: () => set({ mode: "none" })
}));
