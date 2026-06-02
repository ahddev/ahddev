import { PushSubscribe } from "./push-subscribe";
import { listInboxEmails } from "@/lib/inbox-store";
import type { StoredEmail } from "@/lib/inbox";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function GetEmailsPage() {
  const supabaseReady = isSupabaseConfigured();
  const emails: StoredEmail[] = supabaseReady ? await listInboxEmails() : [];

  return (
    <div className="min-h-screen pt-24 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto max-w-4xl px-6 sm:px-8">
        <h1 className="mb-2 font-[family-name:var(--font-syne)] text-2xl font-semibold">
          Inbox
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Catch-all for <span className="font-mono">*@ahed.dev</span> — private, not linked from
          the site.
        </p>

        <PushSubscribe />

        {!supabaseReady && (
          <p className="mb-6 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Supabase is not configured. Add{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> (see{" "}
            <code className="font-mono text-xs">docs/INBOUND_EMAIL_SETUP.md</code>).
          </p>
        )}

        {supabaseReady && emails.length === 0 && (
          <p className="text-sm text-muted-foreground">No emails yet.</p>
        )}

        {emails.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 font-medium">To</th>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id} className="border-b border-border align-top last:border-0">
                    <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs">
                      {email.to}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3">{email.from}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{email.subject || "(no subject)"}</div>
                      {email.text ? (
                        <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-xs text-muted-foreground">
                          {email.text}
                        </p>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(email.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
