import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/csharp/code-block";
import { FixTheCode } from "@/components/csharp/fix-the-code";
import { QuizCard } from "@/components/csharp/quiz-card";
import { csharpTopics, getCsharpTopic } from "@/lib/csharp/content";

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

export async function generateStaticParams() {
  return csharpTopics.filter((topic) => topic.available).map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
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
  const nextTopic = csharpTopics.slice(currentIndex + 1).find((t) => t.available) ?? null;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border/70 bg-card/40 p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Source: {topic.source}</p>
        <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold sm:text-4xl">{topic.title}</h1>
        <p className="mt-3 text-muted-foreground">{topic.subtitle}</p>
      </header>

      {topic.sections.map((section) => (
        <section key={section.heading} className="space-y-4 rounded-xl border border-border/70 bg-card/35 p-5">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <p className="leading-relaxed text-muted-foreground">{section.text}</p>

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

      <div className="flex items-center justify-between pb-8">
        <Link href="/csharp" className="text-sm text-primary hover:underline">
          Back to C# overview
        </Link>

        {nextTopic ? (
          <Link
            href={`/csharp/${nextTopic.slug}`}
            className="flex items-center gap-1 rounded-lg border border-border/70 bg-card/40 px-4 py-2 text-sm transition-colors hover:bg-card/70"
          >
            <span className="text-muted-foreground">Next:</span>
            <span className="font-medium">{nextTopic.title}</span>
            <span className="ml-1 text-primary">→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
