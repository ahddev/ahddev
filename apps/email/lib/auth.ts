import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in mailbox owner, or null. RLS already hides all data from anyone
 * who is not in `owners`; this is for showing the right screen and for guarding
 * actions that reach outside the database (sending mail).
 */
export const getOwner = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("owners").select("user_id").maybeSingle();
  return data ? { supabase, user } : null;
});

export async function requireOwner() {
  const owner = await getOwner();
  if (!owner) throw new Error("Not authorized.");
  return owner;
}
