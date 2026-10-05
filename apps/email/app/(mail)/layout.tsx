import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { ComposeProvider } from "@/components/mail/compose";
import { RealtimeRefresh } from "@/components/mail/realtime-refresh";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getOwner } from "@/lib/auth";
import { signOut } from "@/lib/mail/actions";
import { mailIdentity } from "@/lib/mail/config";
import { knownAddresses, unreadCount } from "@/lib/mail/queries";

export default async function MailLayout({ children }: { children: React.ReactNode }) {
  const owner = await getOwner();

  // proxy.ts already sends signed-out visitors to /login, so this is a signed-in
  // account that is not the mailbox owner.
  if (!owner) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-muted-foreground">This account has no access to the mailbox.</p>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  const identity = mailIdentity();
  const [unread, addresses, cookieStore] = await Promise.all([
    unreadCount(owner.supabase),
    knownAddresses(owner.supabase, identity.domain),
    cookies(),
  ]);

  return (
    <SidebarProvider
      defaultOpen={cookieStore.get("sidebar_state")?.value !== "false"}
      className="h-dvh"
    >
      <ComposeProvider
        address={identity.address}
        domain={identity.domain}
        mine={addresses.mine}
        contacts={addresses.contacts}
      >
        <AppSidebar email={owner.user.email ?? ""} unread={unread} />
        <SidebarInset className="min-w-0 overflow-hidden">{children}</SidebarInset>
      </ComposeProvider>
      <RealtimeRefresh />
    </SidebarProvider>
  );
}
