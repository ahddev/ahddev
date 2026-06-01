import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GetEmailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
