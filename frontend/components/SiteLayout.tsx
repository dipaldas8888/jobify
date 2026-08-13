"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/lib/redux/ReduxProvider";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
});

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <ReduxProvider>
      <SplashScreen />
      {isDashboard ? (
        children
      ) : (
        <>
          <Navbar />
          <main style={{ flex: 1, paddingTop: "68px" }}>{children}</main>
          <Footer />
        </>
      )}
    </ReduxProvider>
  );
}
