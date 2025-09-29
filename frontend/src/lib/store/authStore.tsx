import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Actions, Store } from "../utils/types";

export const useAuthStore = create<Store & Actions>()(
  persist(
    (set, get) => ({
      token: "",
      setToken: (token) => set({ token }),
      logout: () => set({ token: "" }),
      isLoggedIn: () => get().token !== "",
    }),
    {
      name: "global",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
