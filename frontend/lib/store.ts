"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";
import { FARMS } from "./mock-data";

type Theme = "light" | "dark";

interface AppState {
  isAuthenticated: boolean;
  role: Role | null;
  userName: string;
  token: string | null;
  selectedFarmId: string;
  theme: Theme;
  login: (role: Role, userName: string, token: string) => void;
  logout: () => void;
  setSelectedFarmId: (id: string) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userName: "",
      token: null,
      selectedFarmId: FARMS[0].id,
      theme: "light",
      login: (role, userName, token) =>
        set({ isAuthenticated: true, role, userName, token }),
      logout: () => set({ isAuthenticated: false, role: null, userName: "", token: null }),
      setSelectedFarmId: (id) => set({ selectedFarmId: id }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    { name: "jalrakshak-auth" }
  )
);
