import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/csharp/code-block";
import { FixTheCode } from "@/components/csharp/fix-the-code";
import { QuizCard } from "@/components/csharp/quiz-card";
import {
  csharpSectionDomId,
  csharpTopics,
  getCsharpTopic,
} from "@/lib/csharp/content";

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  return csharpTopics
    .filter((topic) => topic.available)
    .map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getCsharpTopic(topicSlug);
  return {
    title: topic ? `C# - ${topic.title}` : "C# Lesson",
    description: topic?.subtitle,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: topicSlug } = await params;
  const topic = getCsharpTopic(topicSlug);

  if (!topic) {
    notFound();
  }

  const currentIndex = csharpTopics.findIndex((t) => t.slug === topicSlug);
  const nextTopic =
    csharpTopics.slice(currentIndex + 1).find((t) => t.available) ?? null;

  return (
    <div className="min-w-0 space-y-6">
      <header className="rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Source: {topic.source}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{topic.subtitle}</p>

        <nav
          aria-label="Sections in this lesson"
          className="mt-5 rounded-xl border border-border/60 bg-background/35 p-3 sm:p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            On this page
          </p>
          <ol className="mt-2 columns-1 gap-x-6 gap-y-1 text-sm sm:columns-2">
            {topic.sections.map((section, index) => (
              <li key={`toc-${section.heading}-${index}`} className="mb-1 break-inside-avoid">
                <a
                  href={`#${csharpSectionDomId(topicSlug, index)}`}
                  className="text-primary hover:underline"
                >
                  <span className="tabular-nums text-muted-foreground">{index + 1}. </span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {topic.sections.map((section, index) => (
        <section
          key={section.heading}
          id={csharpSectionDomId(topicSlug, index)}
          className="min-w-0 scroll-mt-28 space-y-4 rounded-xl border border-border/70 bg-card/35 p-4 sm:p-5"
        >
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <p className="leading-relaxed text-muted-foreground">
            {section.text}
          </p>

          {section.code ? (
            <CodeBlock
              snippet={section.code.snippet}
              language={section.code.language ?? "csharp"}
              output={section.code.output}
            />
          ) : null}

          {section.fixExercise ? (
            <FixTheCode
              title={section.fixExercise.title}
              broken={section.fixExercise.broken}
              solution={section.fixExercise.solution}
              hint={section.fixExercise.hint}
              validationMode={section.fixExercise.validationMode}
            />
          ) : null}

          {section.quiz ? (
            <QuizCard
              question={section.quiz.question}
              options={section.quiz.options}
              answer={section.quiz.answer}
              explanation={section.quiz.explanation}
            />
          ) : null}
        </section>
      ))}

      <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/csharp" className="text-sm text-primary hover:underline">
          Back to C# overview
        </Link>

        {nextTopic ? (
          <Link
            href={`/csharp/${nextTopic.slug}`}
            className="flex min-w-0 items-center gap-1 rounded-lg border border-border/70 bg-card/40 px-4 py-2 text-sm transition-colors hover:bg-card/70"
          >
            <span className="shrink-0 text-muted-foreground">Next:</span>
            <span
              className="min-w-0 truncate font-medium"
              title={nextTopic.title}
            >
              {nextTopic.title}
            </span>
            <span className="ml-1 shrink-0 text-primary">→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
