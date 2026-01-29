import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../src/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MD5 Tools",
  description: "MD5 hashing and reverse lookup tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </main>
      </body>
    </html>
  );
}
