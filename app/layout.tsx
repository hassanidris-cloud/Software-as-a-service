import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "LoyaltySphere | Premium 3D Loyalty SaaS",
  description:
    "Premium B2B SaaS for digital product directories, 3D loyalty cards, and merchant QR stamp validation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-[#05070d] font-[family-name:var(--font-inter)] text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
