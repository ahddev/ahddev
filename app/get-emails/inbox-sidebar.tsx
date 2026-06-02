"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { StoredEmail } from "@/lib/inbox";
import { formatInboxListDate, parseMailbox, previewSnippet } from "@/lib/inbox-format";

type InboxSidebarProps = {
  emails: StoredEmail[];
  supabaseReady: boolean;
};

export function InboxSidebar({ emails, supabaseReady }: InboxSidebarProps) {
  const pathname = usePathname();
  const selectedId = pathname.startsWith("/get-emails/")
    ? pathname.replace("/get-emails/", "").split("/")[0]
    : null;
  const onDetail = Boolean(selectedId);

  return (
    <aside
      className={cn(
        "flex min-h-0 w-full shrink-0 flex-col border-border lg:w-80 lg:border-r",
        onDetail ? "hidden lg:flex" : "flex"
      )}
    >
      <div className="shrink-0 border-b border-border px-4 py-4">
        <h1 className="font-[family-name:var(--font-syne)] text-lg font-semibold">Inbox</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Catch-all · <span className="font-mono">*@ahed.dev</span>
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!supabaseReady && (
          <p className="m-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Supabase is not configured. See <code className="font-mono">docs/INBOUND_EMAIL_SETUP.md</code>.
          </p>
        )}

        {supabaseReady && emails.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted-foreground">No emails yet.</p>
        )}

        <ul className="divide-y divide-border">
          {emails.map((email) => {
            const active = email.id === selectedId;
            const { name, address } = parseMailbox(email.from);
            const senderLabel = name ?? address;
            const snippet = previewSnippet(email.text || email.html.replace(/<[^>]+>/g, " "));

            return (
              <li key={email.id}>
                <Link
                  href={`/get-emails/${email.id}`}
                  className={cn(
                    "block px-4 py-3 transition-colors hover:bg-muted/50",
                    active && "bg-muted/70"
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        active ? "font-semibold text-foreground" : "font-medium text-foreground"
                      )}
                    >
                      {senderLabel}
                    </span>
                    <time
                      className="shrink-0 text-xs text-muted-foreground"
                      dateTime={email.date}
                    >
                      {formatInboxListDate(email.date)}
                    </time>
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 truncate text-sm",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {email.subject || "(no subject)"}
                  </p>
                  {snippet ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{snippet}</p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
