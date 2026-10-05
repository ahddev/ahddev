import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Sidebar } from "@/components/csharp/sidebar";
import { csharpTopics } from "@/lib/csharp/content";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://cs.ahed.dev"),
  title: {
    default: "C# Learning Hub",
    template: "%s | C# Learning Hub",
  },
  description:
    "Docs-style C# and OOP lessons with concise explanations, code examples, and quick exercises.",
  authors: [{ name: "Ahed Al-Khalaf", url: "https://ahed.dev" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="font-semibold text-foreground transition-opacity hover:opacity-80"
            >
              C# Learning Hub
            </Link>
            <a
              href="https://ahed.dev"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ahed.dev
            </a>
          </nav>
        </header>
        <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_1fr]">
            <Sidebar topics={csharpTopics} />
            <main className="min-w-0 overflow-x-hidden">{children}</main>
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
