
import { create } from "zustand";

interface CreditsStore {
  credits: number | null;
  setCredits: (n: number) => void;
  decrementCredits: (n: number) => void;
}

export const useCreditsStore = create<CreditsStore>((set) => ({
  credits: null,
  setCredits:       (n) => set({ credits: n }),
  decrementCredits: (n) => set((s) => ({ credits: (s.credits ?? 0) - n })),
}));
