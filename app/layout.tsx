import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "LoyaltyHub | Digital Loyalty For Modern Businesses",
  description:
    "Launch a branded profile, showcase products, and reward returning customers with a QR-based loyalty system."
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
