"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/lib/redux/ReduxProvider";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  // Show splash only on first load, not on dashboard routes
  const [splashDone, setSplashDone] = useState(isDashboard);

  return (
    <ReduxProvider>
      {/* Splash screen renders first; content waits until it's done */}
      {!splashDone && (
        <SplashScreen onComplete={() => setSplashDone(true)} />
      )}

      {/* Main app content — hidden via opacity until splash finishes */}
      <div
        style={{
          opacity: splashDone ? 1 : 0,
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
