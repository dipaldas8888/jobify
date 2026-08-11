"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store";
import { setCredentials, logout, setLoading } from "./slices/authSlice";
import { authApi } from "@/lib/api";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("jobify_token");
    if (token) {
      authApi.getProfile().then((res) => {
        if (res.success && res.user) {
          dispatch(
            setCredentials({
              token,
              user: {
                id: res.user._id || res.user.id,
                name: res.user.name,
                email: res.user.email,
                role: res.user.role,
                isVerified: res.user.isVerified,
                companyName: res.user.companyName,
                photo: res.user.photo,
              },
            })
          );
        } else {
          dispatch(logout());
        }
      });
    } else {
      dispatch(setLoading(false));
    }
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
