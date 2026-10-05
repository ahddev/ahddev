import Form from "next/form";
import Link from "next/link";
import { Paperclip, Star } from "lucide-react";
import { LocalTime } from "@/components/mail/local-time";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { parseMailbox, previewSnippet } from "@/lib/mail/format";
import type { Folder, ThreadRow } from "@/lib/mail/queries";
import { cn } from "@/lib/utils";

const TITLES: Record<Folder, string> = {
  inbox: "Inbox",
  starred: "Starred",
  sent: "Sent",
  archive: "Archive",
  trash: "Trash",
};

/** Who a row is about: the sender, or the recipients for mail we sent. */
function correspondent(row: ThreadRow): string {
  if (row.direction === "in") {
    const { name, address } = parseMailbox(row.sender);
    return name ?? address;
  }
  const names = row.recipient.split(",").map((one) => {
    const { name, address } = parseMailbox(one);
    return name ?? address;
  });
  return `To: ${names.join(", ")}`;
}

type ThreadListProps = {
  folder: Folder;
  rows: ThreadRow[];
  activeThreadId?: string;
  query?: string;
  /** Link that reloads the list with more rows, when there are more. */
  moreHref?: string;
  className?: string;
};

export function ThreadList({
  folder,
  rows,
  activeThreadId,
  query,
  moreHref,
  className,
}: ThreadListProps) {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : "";

  return (
    <section className={cn("min-h-0 flex-col border-r", className)}>
      <header className="flex shrink-0 flex-col gap-3 border-b p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-base font-medium">{query ? "Search" : TITLES[folder]}</h1>
          {query && (
            <Link
              href={`/${folder}`}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Link>
          )}
        </div>
        <Form action={`/${folder}`}>
          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search mail"
            aria-label="Search mail"
          />
        </Form>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {rows.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            {query ? "No mail matches your search." : "Nothing here."}
          </p>
        )}

        {rows.map((row) => (
          <Link
            key={row.last_id}
            href={`/${folder}/${row.thread_id}${suffix}`}
            className={cn(
              "flex flex-col items-start gap-1 border-b p-4 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              row.thread_id === activeThreadId && "bg-sidebar-accent"
            )}
          >
            <div className="flex w-full items-center gap-2">
              {row.unread && (
                <span className="size-2 shrink-0 rounded-full bg-blue-500" aria-label="Unread" />
              )}
              <span className={cn("truncate", row.unread && "font-semibold")}>
                {correspondent(row)}
              </span>
              {row.message_count > 1 && (
                <span className="text-xs text-muted-foreground">{row.message_count}</span>
              )}
              <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                {row.has_attachments && <Paperclip className="size-3" aria-label="Has attachments" />}
                {row.starred && (
                  <Star className="size-3 fill-amber-400 text-amber-400" aria-label="Starred" />
                )}
                <LocalTime iso={row.last_at} short />
              </span>
            </div>
            <span className={cn("w-full truncate", row.unread && "font-medium")}>
              {row.subject || "(no subject)"}
            </span>
            <span className="line-clamp-2 w-full text-xs text-muted-foreground">
              {previewSnippet(row.snippet, 140)}
            </span>
          </Link>
        ))}

        {moreHref && (
          <Link
            href={moreHref}
            className="block p-4 text-center text-sm text-muted-foreground hover:text-foreground"
          >
            Load more
          </Link>
        )}
      </div>
    </section>
  );
}
