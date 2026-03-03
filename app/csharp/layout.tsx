import type { ReactNode } from "react";
import { Sidebar } from "@/components/csharp/sidebar";
import { csharpTopics } from "@/lib/csharp/content";

export default function CsharpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-24 sm:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar topics={csharpTopics} />
        <main>{children}</main>
      </div>
    </div>
  );
}
