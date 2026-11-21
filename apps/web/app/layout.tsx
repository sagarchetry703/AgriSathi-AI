import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AgriSathi AI — Your Smart Farming Companion",
    template: "%s | AgriSathi AI",
  },
  description:
    "AI-powered agricultural assistant for Indian farmers. Get crop advice, disease diagnosis, weather alerts, and market prices in your language.",
  keywords: [
    "agriculture",
    "farming",
    "AI",
    "crop advisor",
    "plant disease",
    "mandi prices",
    "weather",
    "India",
    "kisan",
  ],
  authors: [{ name: "AgriSathi AI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriSathi AI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22c55e" },
    { media: "(prefers-color-scheme: dark)", color: "#166534" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} min-h-screen antialiased`}
      >
        {children}
        <ServiceWorkerRegister />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
