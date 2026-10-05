import Link from "next/link";
import { ArrowLeft, Download, Paperclip } from "lucide-react";
import { LocalTime } from "@/components/mail/local-time";
import { MessageBody } from "@/components/mail/message-body";
import { MarkRead, MessageActions, ThreadActions } from "@/components/mail/thread-actions";
import { Badge } from "@/components/ui/badge";
import { formatBytes, parseMailbox, previewSnippet } from "@/lib/mail/format";
import type { EmailWithFiles, Folder } from "@/lib/mail/queries";
import { extractAddresses } from "@/lib/mail/threading";

// Delivery problems worth showing on mail we sent.
const STATUS_LABELS: Record<string, string> = {
  bounced: "Bounced: this was not delivered",
  failed: "Failed to send",
  complained: "Marked as spam by the recipient",
  delivery_delayed: "Delivery delayed",
};

type ThreadViewProps = {
  folder: Folder;
  messages: EmailWithFiles[];
  backHref: string;
};

export function ThreadView({ folder, messages, backHref }: ThreadViewProps) {
  const last = messages[messages.length - 1];
  const place =
    folder === "trash"
      ? "trash"
      : messages.some((message) => message.folder === "inbox")
        ? "inbox"
        : messages.some((message) => message.folder === "archive")
          ? "archive"
          : "other";

  return (
    <article className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-1 border-b px-2 py-2 md:px-4">
        <Link
          href={backHref}
          aria-label="Back to list"
          className="flex size-9 shrink-0 items-center justify-center rounded-md hover:bg-accent md:hidden"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="min-w-0 flex-1 truncate px-1 text-base font-medium">
          {messages[0].subject || "(no subject)"}
        </h1>
        <ThreadActions threadId={last.thread_id} place={place} backHref={backHref} />
      </header>

      {messages.some((message) => !message.is_read) && <MarkRead threadId={last.thread_id} />}

      <div className="min-h-0 flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {messages.map((message) => {
          const { name, address } = parseMailbox(message.sender);
          const others = extractAddresses(`${message.recipient} ${message.cc}`);

          return (
            // native disclosure: earlier messages you have read start collapsed
            <details
              key={message.id}
              open={message === last || !message.is_read}
              className="group border-b last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3 hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase"
                >
                  {(name ?? address).slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-medium">{name ?? address}</span>
                    {name && (
                      <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                        {address}
                      </span>
                    )}
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      <LocalTime iso={message.received_at} />
                    </span>
                  </span>
                  <span className="block truncate text-xs text-muted-foreground group-open:hidden">
                    {previewSnippet(message.body, 120)}
                  </span>
                  <span className="hidden truncate text-xs text-muted-foreground group-open:block">
                    to {message.recipient}
                    {message.cc && `, cc ${message.cc}`}
                    {message.bcc && `, bcc ${message.bcc}`}
                  </span>
                  {/* in the summary, so a bounce shows even while the message is collapsed */}
                  {message.status && STATUS_LABELS[message.status] && (
                    <Badge variant="destructive" className="mt-1.5">
                      {STATUS_LABELS[message.status]}
                    </Badge>
                  )}
                </span>
              </summary>

              <div className="px-4 pb-4">
                <MessageBody html={message.body_html} text={message.body} />

                {message.attachments.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {message.attachments.map((file) => (
                      <li key={file.id} className="max-w-full">
                        {file.url ? (
                          <a
                            href={file.url}
                            className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs hover:bg-accent"
                          >
                            <Paperclip className="size-3 shrink-0" />
                            <span className="truncate">{file.filename}</span>
                            <span className="shrink-0 text-muted-foreground">
                              {formatBytes(file.size)}
                            </span>
                            <Download className="size-3 shrink-0" aria-label="Download" />
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
                            <Paperclip className="size-3 shrink-0" />
                            <span className="truncate">{file.filename}</span>
                            (could not be stored)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                <MessageActions
                  starred={message.is_starred}
                  canReplyAll={others.length > 1}
                  email={{
                    id: message.id,
                    direction: message.direction,
                    sender: message.sender,
                    reply_to: message.reply_to,
                    recipient: message.recipient,
                    cc: message.cc,
                    subject: message.subject,
                    attachments: message.attachments.map((file) => ({
                      id: file.id,
                      email_id: file.email_id,
                      filename: file.filename,
                      content_type: file.content_type,
                      size: file.size,
                      storage_path: file.storage_path,
                    })),
                  }}
                />
              </div>
            </details>
          );
        })}
      </div>
    </article>
  );
}
