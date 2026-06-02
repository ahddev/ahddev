import { notFound } from "next/navigation";
import { BackToInbox } from "../back-to-inbox";
import { EmailMessage } from "../email-message";
import { getInboxEmailById } from "@/lib/inbox-store";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GetEmailPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const email = await getInboxEmailById(id);
  if (!email) {
    notFound();
  }

  return (
    <>
      <BackToInbox />
      <EmailMessage email={email} />
    </>
  );
}
