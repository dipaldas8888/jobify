import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  isVerified: boolean;
  companyName?: string;
  photo?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const getInitialAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false, isLoading: true };
  }

  const token = localStorage.getItem("jobify_token") || localStorage.getItem("token");
  const userRaw = localStorage.getItem("jobify_user");
  let user: User | null = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (e) {
      console.error("Failed to parse cached user:", e);
    }
  }

  return {
    token: token || null,
    user: user || null,
    isAuthenticated: Boolean(token && user),
    isLoading: Boolean(token && !user),
  };
};

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("jobify_token", action.payload.token);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("jobify_user", JSON.stringify(action.payload.user));
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("jobify_user", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("jobify_token");
          localStorage.removeItem("token");
          localStorage.removeItem("jobify_user");
          sessionStorage.removeItem("jobify_token");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("jobify_user");
          sessionStorage.setItem("jobify_splash_shown", "true");
          document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        } catch (e) {
          console.error("Storage clear error on logout:", e);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, updateUser, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
