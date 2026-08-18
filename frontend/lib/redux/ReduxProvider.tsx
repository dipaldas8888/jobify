"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store";
import { setCredentials, logout, setLoading } from "./slices/authSlice";
import { authApi } from "@/lib/api";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const syncProfile = (token: string) => {
    authApi.getProfile().then((res) => {
      const userObj = res.user || res.data;
      if (res.success && userObj) {
        dispatch(
          setCredentials({
            token,
            user: {
              id: userObj._id || userObj.id,
              name: userObj.name,
              email: userObj.email,
              role: userObj.role,
              isVerified: userObj.isVerified,
              companyName: userObj.companyName,
              photo: userObj.photo,
            },
          })
        );
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        // Only wipe credentials if backend explicitly returns 401/403 (invalid/expired token)
        dispatch(logout());
      } else {
        dispatch(setLoading(false));
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("jobify_token") || localStorage.getItem("token");

    if (token) {
      syncProfile(token);
    } else {
      dispatch(logout());
    }

    // Real-time cross-tab auth state synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "jobify_token" || e.key === "token" || e.key === "jobify_user") {
        const freshToken = localStorage.getItem("jobify_token") || localStorage.getItem("token");
        const freshUserRaw = localStorage.getItem("jobify_user");

        if (freshToken && freshUserRaw) {
          try {
            const freshUser = JSON.parse(freshUserRaw);
            dispatch(setCredentials({ token: freshToken, user: freshUser }));
          } catch (err) {
            syncProfile(freshToken);
          }
        } else if (freshToken) {
          syncProfile(freshToken);
        } else {
          dispatch(logout());
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
