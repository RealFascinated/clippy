import Background from "@/components/background";
import AppSidebar from "@/components/dashboard/sidebar/sidebar";
import Navbar from "@/components/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/app-provider";

const font = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_WEBSITE_NAME,
  description: "Open Source ShareX Uploader.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
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
