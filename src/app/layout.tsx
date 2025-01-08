import type { Metadata } from "next";
import { Rubik } from "next/font/google";

import "@/styles/globals.css";

import React from "react";

import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/fragments/header";
import { ThemeProvider } from "@/components/fragments/theme-providers";

const rubik = Rubik({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linkly | Shorten Your URLs",
  description:
    "Linkly makes link management simple and effective. Shorten lengthy URLs, personalize them, and monitor click analytics seamlessly. Perfect for businesses, marketers, and everyday users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${rubik.className} flex flex-col min-h-screen bg-background antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className={"flex-1 overflow-auto"}>{children}</main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
