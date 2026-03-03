import Link from "next/link";
import { csharpTopics } from "@/lib/csharp/content";

export default function CsharpPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/40 p-6">
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold sm:text-4xl">C# Learning Hub</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Study your university OOP slides in a docs-style format inspired by react.dev. Each chapter includes
          concise explanations, copyable code examples, and small fix-the-code exercises.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {csharpTopics.map((topic) => (
          <article key={topic.slug} className="rounded-xl border border-border/70 bg-card/40 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  topic.available
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : "bg-muted/60 text-muted-foreground border border-border/60"
                }`}
              >
                {topic.available ? "Ready" : "Coming Soon"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{topic.subtitle}</p>
            <p className="mt-2 text-xs text-muted-foreground">Source: {topic.source}</p>
            {topic.available ? (
              <Link href={`/csharp/${topic.slug}`} className="mt-3 inline-block text-sm text-primary hover:underline">
                Open lesson
              </Link>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
