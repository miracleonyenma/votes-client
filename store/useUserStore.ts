import { User } from "@/types";
import { create } from "zustand";

// define the UserStore type
type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// create the UserStore
export const useUserStore = create<UserStore>((set) => ({
  // initialize the user to null
  user: null,
  // define the setUser function to update the user
  setUser: (user) => set({ user }),
}));
