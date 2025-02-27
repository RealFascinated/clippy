import Background from "@/components/background";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import AppProvider from "@/providers/app-provider";
import type { Metadata } from "next";
import { type NextFont } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";
import "./globals.css";

const font: NextFont = localFont({
  src: "../font/Satoshi.ttf",
});

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_WEBSITE_NAME,
  description: env.NEXT_PUBLIC_WEBSITE_DESCRIPTION,
  icons: [{ rel: "icon", url: env.NEXT_PUBLIC_WEBSITE_LOGO }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Toaster />
        <Background />
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
