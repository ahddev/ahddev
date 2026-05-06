import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send email",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SendEmailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
