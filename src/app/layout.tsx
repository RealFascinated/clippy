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
  title: {
    default: env.NEXT_PUBLIC_WEBSITE_NAME,
    template: `%s | ${env.NEXT_PUBLIC_WEBSITE_NAME}`,
  },
  description: env.NEXT_PUBLIC_WEBSITE_DESCRIPTION,
  icons: [{ rel: "icon", url: env.NEXT_PUBLIC_WEBSITE_LOGO }],
  openGraph: {
    siteName: env.NEXT_PUBLIC_WEBSITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
        style={{
          background:
            "linear-gradient(to bottom, hsl(240, 6%, 10%), var(--background))",
        }}
      >
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast: "!w-fit !rounded-3xl select-none",
              success: "!text-green-500",
              error: "!text-red-500",
              content: "!text-white/95",
            },
          }}
        />
        {/* <Background /> */}
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
