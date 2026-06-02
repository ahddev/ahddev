import type { StoredEmail } from "@/lib/inbox";
import { formatInboxDate, parseMailbox } from "@/lib/inbox-format";

function AddressLine({ label, value }: { label: string; value: string }) {
  const { name, address } = parseMailbox(value);

  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-0.5 text-sm sm:grid-cols-[5rem_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <div className="min-w-0">
        {name ? (
          <>
            <span className="font-medium text-foreground">{name}</span>
            <span className="ml-2 font-mono text-xs text-muted-foreground">{address}</span>
          </>
        ) : (
          <span className="font-mono text-xs break-all text-foreground">{address}</span>
        )}
      </div>
    </div>
  );
}

export function EmailMessage({ email }: { email: StoredEmail }) {
  const subject = email.subject || "(no subject)";
  const hasHtml = email.html.length > 0;

  return (
    <article className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-border px-4 py-5 sm:px-6">
        <h1 className="font-[family-name:var(--font-syne)] text-xl font-semibold leading-snug sm:text-2xl">
          {subject}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{formatInboxDate(email.date)}</p>
        <div className="mt-4 space-y-2">
          <AddressLine label="From" value={email.from} />
          <AddressLine label="To" value={email.to} />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {hasHtml ? (
          <iframe
            title="Email body"
            sandbox=""
            srcDoc={email.html}
            className="h-[min(70vh,720px)] w-full rounded-md border border-border bg-white"
          />
        ) : email.text ? (
          <div className="max-w-none text-[15px] leading-relaxed whitespace-pre-wrap text-foreground">
            {email.text}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No message body.</p>
        )}
      </div>
    </article>
  );
}
