import type React from "react";
import type { Metadata } from "next";
import { Exo_2 as Exo2 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/Toastprovider";
import "react-loading-skeleton/dist/skeleton.css";

const exo2 = Exo2({
  subsets: ["latin"],
  variable: "--font-exo2",
});

export const metadata: Metadata = {
  title: "Fin(Ai)d Hub",
  description: "AI-powered financial advisory platform",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={exo2.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
