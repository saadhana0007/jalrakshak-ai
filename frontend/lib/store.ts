"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";
import { FARMS } from "./mock-data";

interface AppState {
  isAuthenticated: boolean;
  role: Role | null;
  userName: string;
  token: string | null;
  selectedFarmId: string;
  login: (role: Role, userName: string, token: string) => void;
  logout: () => void;
  setSelectedFarmId: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userName: "",
      token: null,
      selectedFarmId: FARMS[0].id,
      login: (role, userName, token) =>
        set({ isAuthenticated: true, role, userName, token }),
      logout: () => set({ isAuthenticated: false, role: null, userName: "", token: null }),
      setSelectedFarmId: (id) => set({ selectedFarmId: id }),
    }),
    { name: "jalrakshak-auth" }
  )
);
