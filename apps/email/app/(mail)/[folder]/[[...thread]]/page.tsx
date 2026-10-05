import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { z } from "zod";
import { ComposeFab } from "@/components/mail/compose";
import { ThreadList } from "@/components/mail/thread-list";
import { ThreadView } from "@/components/mail/thread-view";
import { getOwner } from "@/lib/auth";
import { getThread, isFolder, listThreads, searchEmails } from "@/lib/mail/queries";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;

type MailPageProps = {
  // One page for both "list" and "list + conversation", so the list keeps its
  // scroll position while you move between conversations.
  params: Promise<{ folder: string; thread?: string[] }>;
  searchParams: Promise<{ q?: string; n?: string }>;
};

export async function generateMetadata({ params }: MailPageProps): Promise<Metadata> {
  const { folder } = await params;
  return { title: folder.charAt(0).toUpperCase() + folder.slice(1) };
}

export default async function MailPage({ params, searchParams }: MailPageProps) {
  const [{ folder, thread }, { q, n }] = await Promise.all([params, searchParams]);
  const owner = await getOwner();
  if (!owner) return null; // the layout shows the reason

  const threadId = thread?.[0];
  if (!isFolder(folder) || (threadId && !z.uuid().safeParse(threadId).success)) {
    notFound();
  }

  const query = q?.trim() || undefined;
  const limit = Math.min(Math.max(Number(n) || PAGE_SIZE, PAGE_SIZE), 500);
  const [rows, allMessages] = await Promise.all([
    // one extra row tells us whether there is more to load
    query
      ? searchEmails(owner.supabase, query, limit + 1)
      : listThreads(owner.supabase, folder, limit + 1),
    threadId ? getThread(owner.supabase, threadId) : null,
  ]);

  // Trash shows what was thrown away; everywhere else hides it.
  const messages = allMessages?.filter((message) =>
    folder === "trash" ? message.folder === "trash" : message.folder !== "trash"
  );
  if (threadId && !messages?.length) notFound();

  const search = new URLSearchParams(query ? { q: query } : {});
  const backHref = `/${folder}${search.size ? `?${search}` : ""}`;
  search.set("n", String(limit + PAGE_SIZE));
  const moreHref =
    rows.length > limit
      ? `/${[folder, threadId].filter(Boolean).join("/")}?${search}`
      : undefined;

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <ThreadList
        folder={folder}
        rows={rows.slice(0, limit)}
        activeThreadId={threadId}
        query={query}
        moreHref={moreHref}
        // phones show one pane at a time
        className={cn("w-full md:flex md:w-96 md:shrink-0", messages ? "hidden" : "flex")}
      />

      {messages ? (
        <ThreadView folder={folder} messages={messages} backHref={backHref} />
      ) : (
        <>
          <div className="hidden flex-1 flex-col items-center justify-center gap-3 text-center md:flex">
            <Mail className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">Select a conversation to read it here.</p>
          </div>
          <ComposeFab />
        </>
      )}
    </div>
  );
}
