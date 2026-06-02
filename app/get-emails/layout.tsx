import type { Metadata } from "next";
import { PushSubscribe } from "./push-subscribe";
import { InboxSidebar } from "./inbox-sidebar";
import { listInboxEmails } from "@/lib/inbox-store";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Inbox",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function GetEmailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseReady = isSupabaseConfigured();
  const emails = supabaseReady ? await listInboxEmails() : [];

  return (
    <div className="min-h-screen pt-20 pb-6 font-[family-name:var(--font-geist-sans)] sm:pt-24">
      <div className="mx-auto flex h-[calc(100dvh-5.5rem)] max-w-6xl flex-col px-4 sm:px-6">
        <div className="mb-4 shrink-0 sm:mb-5">
          <PushSubscribe />
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card/30 shadow-sm">
          <InboxSidebar emails={emails} supabaseReady={supabaseReady} />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
