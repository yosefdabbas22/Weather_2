import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: " Smart Weather Forecasts, Anywhere",
  description:
    "Fast, accurate weather forecasts with a clean, modern UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
