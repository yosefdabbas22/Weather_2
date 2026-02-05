import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Rubik } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";



export const metadata: Metadata = {
  title: "Smart Weather Forecasts, Anywhere",
  description:
    "This weather application is designed to provide fast and accurate forecasts using real-time data from trusted sources. The platform helps users across different regions track weather conditions, plan their day, and stay informed with a clean, modern, and easy-to-use experience.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
