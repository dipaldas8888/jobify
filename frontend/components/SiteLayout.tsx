"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReduxProvider from "@/lib/redux/ReduxProvider";
import SplashScreen from "@/components/SplashScreen";

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
