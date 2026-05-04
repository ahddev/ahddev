import Link from "next/link";
import { csharpSectionDomId, csharpTopics } from "@/lib/csharp/content";

export default function CsharpPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/70 bg-card/40 p-6">
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold sm:text-4xl">C# Learning Hub</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Study your IUST OOP slides in a docs-style format. Each chapter includes
          concise explanations, copyable code examples, and small fix-the-code exercises.
        </p>

        <nav
          aria-label="Chapters on this page"
          className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Index
          </p>
          <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {csharpTopics.map((topic, i) => (
              <li key={topic.slug} className="min-w-0">
                <a
                  href={`#${topic.slug}`}
                  className="flex items-baseline gap-2 text-primary hover:underline"
                >
                  <span className="shrink-0 tabular-nums text-muted-foreground">{i + 1}.</span>
                  <span className="min-w-0 truncate" title={topic.title}>
                    {topic.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {csharpTopics.map((topic) => (
          <article
            key={topic.slug}
            id={topic.slug}
            className="scroll-mt-28 rounded-xl border border-border/70 bg-card/40 p-4"
          >
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
              <details className="group mt-4 rounded-lg border border-border/60 bg-background/35">
                <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-muted-foreground marker:text-muted-foreground">
                  Sections inside this chapter ({topic.sections.length})
                </summary>
                <div className="max-h-48 overflow-y-auto border-t border-border/50 px-2 py-2">
                  <ol className="space-y-1 text-xs text-muted-foreground">
                    {topic.sections.map((section, idx) => (
                      <li key={`${topic.slug}-${idx}`} className="min-w-0 pl-2">
                        <Link
                          href={`/csharp/${topic.slug}#${csharpSectionDomId(topic.slug, idx)}`}
                          className="text-primary hover:underline"
                        >
                          <span className="tabular-nums text-muted-foreground">{idx + 1}. </span>
                          <span className="break-words">{section.heading}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            ) : null}

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
