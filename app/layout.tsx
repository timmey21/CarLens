import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthNav from "./components/AuthNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarLens",
  description:
    "Type in a sports car and get a full parts breakdown with pricing, sourcing, and common fault history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthNav />
        {children}
      </body>
    </html>
  );
}
