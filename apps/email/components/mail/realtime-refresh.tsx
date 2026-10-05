"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parseMailbox } from "@/lib/mail/format";
import { createClient } from "@/lib/supabase/client";

/** Re-renders the mailbox when mail arrives or changes on another device. */
export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("emails")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emails" },
        (change) => {
          router.refresh();
          if (change.eventType === "INSERT" && change.new.direction === "in") {
            const { name, address } = parseMailbox(String(change.new.sender ?? ""));
            toast(`New mail from ${name ?? address}`, {
              description: String(change.new.subject ?? ""),
            });
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
