import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OilIntel — Enterprise Oil Analytics Platform",
  description: "AI-powered oil analytics, market intelligence, CRM, and marketing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full dark`}>
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
