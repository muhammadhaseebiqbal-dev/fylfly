import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
  title: "FylFly.io - Instant File Upload & Share",
  description: "Upload any file instantly and get direct downloadable links to share with friends across social apps. Fast, secure, and easy file sharing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <nav className="border-b-2 border-gray-700/30 py-1">
          <Image src="/logo.png" alt="Logo" width={55} height={25} />
        </nav>
        <main className="h-[100svh] flex relative">
          {children}
        </main>
      </body>
    </html>
  );
}
