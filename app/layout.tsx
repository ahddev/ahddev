import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahddev.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ahed Al-Khalaf | Software Engineer",
    template: "%s | Ahed Al-Khalaf",
  },
  description:
    "Software engineer based in Damascus, Syria. Building modern web applications and mobile apps. Open to opportunities and collaboration.",
  keywords: [
    "Ahed Al-Khalaf",
    "ahddev",
    "software engineer",
    "web developer",
    "frontend developer",
    "Damascus",
    "Syria",
    "portfolio",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Ahed Al-Khalaf", url: "https://github.com/ahddev" }],
  creator: "Ahed Al-Khalaf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Ahed Al-Khalaf",
    title: "Ahed Al-Khalaf | Software Engineer",
    description:
      "Software engineer based in Damascus, Syria. Building modern web applications and mobile apps.",
  },
  twitter: {
    card: "summary",
    title: "Ahed Al-Khalaf | Software Engineer",
    description:
      "Software engineer based in Damascus, Syria. Building modern web and mobile apps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        <Header />
        <div className="flex min-h-screen flex-col">
          {children}
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
