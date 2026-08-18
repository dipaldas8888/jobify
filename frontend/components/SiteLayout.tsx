"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/lib/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  // Default to true (hidden) on SSR and dashboard routes
  const [splashDone, setSplashDone] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("jobify_splash_shown");
      if (alreadyShown === "true" || isDashboard) {
        setSplashDone(true);
      } else {
        setSplashDone(false);
      }
    }
  }, [isDashboard]);

  const handleSplashComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jobify_splash_shown", "true");
    }
    setSplashDone(true);
  };

  return (
    <ReduxProvider>
      {/* Toast notifications container */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Show splash screen ONLY ONCE per browser session on 1st visit */}
      {mounted && !splashDone && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* Main app content */}
      <div
        style={{
          opacity: mounted && !splashDone ? 0 : 1,
          transition: "opacity 0.4s ease-in",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isDashboard ? (
          children
        ) : (
          <>
            <Navbar />
            <main style={{ flex: 1, paddingTop: "68px" }}>{children}</main>
            <Footer />
          </>
        )}
      </div>
    </ReduxProvider>
  );
}
