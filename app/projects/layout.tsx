import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Real-world projects built with React and Next.js, including websites used by people and businesses.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
