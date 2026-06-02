import {
  MAX_STORED_EMAILS,
  PUSH_SUBSCRIPTION_ROW_ID,
  rowToStoredEmail,
  type StoredEmail,
} from "@/lib/inbox";
import { createAdminClient } from "@/lib/supabase/admin";

export async function listInboxEmails(limit = MAX_STORED_EMAILS): Promise<StoredEmail[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("inbox_emails")
    .select("id, recipient, sender, subject, body, body_html, received_at")
    .order("received_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load emails from Supabase:", error);
    return [];
  }

  return (data ?? []).map(rowToStoredEmail);
}

export async function getInboxEmailById(id: string): Promise<StoredEmail | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("inbox_emails")
    .select("id, recipient, sender, subject, body, body_html, received_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load email from Supabase:", error);
    return null;
  }

  return data ? rowToStoredEmail(data) : null;
}

export async function saveInboxEmail(email: StoredEmail): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error: insertError } = await supabase.from("inbox_emails").upsert(
    {
      id: email.id,
      recipient: email.to,
      sender: email.from,
      subject: email.subject,
      body: email.text,
      body_html: email.html,
      received_at: email.date,
    },
    { onConflict: "id" }
  );

  if (insertError) throw insertError;

  const { data: ordered, error: selectError } = await supabase
    .from("inbox_emails")
    .select("id")
    .order("received_at", { ascending: false });

  if (selectError) throw selectError;

  const staleIds = (ordered ?? []).slice(MAX_STORED_EMAILS).map((row) => row.id);
  if (staleIds.length === 0) return;

  const { error: deleteError } = await supabase.from("inbox_emails").delete().in("id", staleIds);

  if (deleteError) throw deleteError;
}

export async function getPushSubscription(): Promise<unknown | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("subscription")
    .eq("id", PUSH_SUBSCRIPTION_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error("Failed to load push subscription:", error);
    return null;
  }

  return data?.subscription ?? null;
}

export async function savePushSubscription(subscription: unknown): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      id: PUSH_SUBSCRIPTION_ROW_ID,
      subscription,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw error;
}
