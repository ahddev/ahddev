"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CsharpTopic } from "@/lib/csharp/content";
import { cn } from "@/lib/utils";

type SidebarProps = {
  topics: CsharpTopic[];
};

const VISITED_KEY = "csharp-visited-topics";

export function Sidebar({ topics }: SidebarProps) {
  const pathname = usePathname();
  const [visitedCount, setVisitedCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const availableTopicCount = useMemo(() => topics.filter((t) => t.available).length, [topics]);
  const progress = availableTopicCount > 0 ? Math.round((visitedCount / availableTopicCount) * 100) : 0;

  useEffect(() => {
    const raw = localStorage.getItem(VISITED_KEY);
    const visited = raw ? (JSON.parse(raw) as string[]) : [];
    const topicSlug = pathname.split("/")[2];

    if (topicSlug && topics.some((t) => t.slug === topicSlug && t.available)) {
      const nextVisited = Array.from(new Set([...visited, topicSlug]));
      localStorage.setItem(VISITED_KEY, JSON.stringify(nextVisited));
      setVisitedCount(nextVisited.length);
      return;
    }

    setVisitedCount(visited.length);
  }, [pathname, topics]);

  return (
    <div className="space-y-2 lg:contents">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="sticky top-24 z-10 flex w-full items-center justify-between rounded-lg border border-border/70 bg-card/40 px-4 py-2 text-sm transition-colors hover:bg-card/60 lg:hidden"
        aria-expanded={isOpen}
      >
        <span className="font-medium">Lessons</span>
        <span className="text-muted-foreground">{isOpen ? "−" : "+"}</span>
      </button>
      <aside
        className={cn(
          "top-24 h-fit rounded-xl border border-border/70 bg-card/40 p-4 lg:sticky",
          !isOpen && "hidden",
          "lg:block",
        )}
      >
        <p className="text-sm font-semibold">C# Learning</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Progress: {visitedCount}/{availableTopicCount} ({progress}%)
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted/60">
          <div className="h-full bg-[var(--chart-1)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <ul className="mt-4 space-y-1">
          {topics.map((topic) => {
          const href = `/csharp/${topic.slug}`;
          const active = pathname === href;
          if (!topic.available) {
            return (
              <li key={topic.slug}>
                <span className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground/70">
                  {topic.title}
                </span>
              </li>
            );
          }

          return (
            <li key={topic.slug}>
              <Link
                href={href}
                className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                {topic.title}
              </Link>
            </li>
          );
          })}
        </ul>
      </aside>
    </div>
  );
}
