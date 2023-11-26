import create from "zustand";

interface AuthState {
  user: any;
  token: string | null;

  setUser: (id: string) => void;
  setToken: (token: string) => void;

  getToken: () => string | null;
  getUser: () => any ;

  logout: () => void;
}

const setTokenInCookie = (token: string) => {
  localStorage.setItem("@auth::token", token);
};

const setUserInCookie = (user: string) => {
  localStorage.setItem("@auth::user", JSON.stringify(user));
};

const removeTokenFromCookie = () => {
  localStorage.removeItem("@auth::token");
};

const removeIdFromCookie = () => {
  localStorage.removeItem("@auth::user");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem("@auth::user") || null,
  token: localStorage.getItem("@auth::token") || null,

  setToken: (token) => {
    set({ token });
    setTokenInCookie(token);
  },

  setUser: (user) => {
    set({ user });
    setUserInCookie(user);
  },

  logout: () => {
    removeTokenFromCookie();
    removeIdFromCookie();

    set({ token: null });
    set({ user: null });
  },

  getToken: () => localStorage.getItem("@auth::token") || null,
  getUser: () => JSON.parse(localStorage.getItem("@auth::user") ?? "null") || null,
}));
