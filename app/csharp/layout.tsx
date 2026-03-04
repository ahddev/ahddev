import type { ReactNode } from "react";
import { Sidebar } from "@/components/csharp/sidebar";
import { csharpTopics } from "@/lib/csharp/content";

export default function CsharpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar topics={csharpTopics} />
        <main className="min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
