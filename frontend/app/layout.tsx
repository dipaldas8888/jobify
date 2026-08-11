import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jobify – Find Your Dream Job",
    template: "%s | Jobify",
  },
  description:
    "Discover thousands of opportunities from the world's best companies. Find your perfect job with Jobify — the modern job platform for top talent.",
  keywords: ["jobs", "job board", "careers", "hiring", "tech jobs", "remote jobs"],
  openGraph: {
    title: "Jobify – Find Your Dream Job",
    description: "Discover thousands of opportunities from the world's best companies.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
