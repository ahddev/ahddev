import { codeToHtml } from "shiki";
import { CopySnippetButton } from "@/components/csharp/copy-snippet-button";

type CodeBlockProps = {
  snippet: string;
  language?: "csharp" | "text";
  output?: string;
};

export async function CodeBlock({
  snippet,
  language = "csharp",
  output,
}: CodeBlockProps) {
  const html = await codeToHtml(snippet, {
    lang: language,
    theme: "github-dark",
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card/60">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{language}</span>
        <CopySnippetButton value={snippet} />
      </div>

      <div className="overflow-x-auto">
        <div
          className="[&_.shiki]:m-0 [&_.shiki]:!bg-transparent [&_.shiki]:px-3 [&_.shiki]:py-4 [&_.shiki]:text-sm [&_.shiki]:leading-6 sm:[&_.shiki]:px-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {output ? (
        <div className="border-t border-border/60 bg-background/40 px-3 py-3 sm:px-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Output</p>
          <pre className="overflow-x-auto text-sm text-foreground">{output}</pre>
        </div>
      ) : null}
    </div>
  );
}
