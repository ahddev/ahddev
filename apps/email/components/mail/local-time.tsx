"use client";

import { useSyncExternalStore } from "react";
import { formatInboxDate, formatInboxListDate } from "@/lib/mail/format";

const subscribe = () => () => {};

/** A date in the reader's own timezone. The server (UTC) renders it empty. */
export function LocalTime({ iso, short = false }: { iso: string; short?: boolean }) {
  const text = useSyncExternalStore(
    subscribe,
    () => (short ? formatInboxListDate(iso) : formatInboxDate(iso)),
    () => ""
  );
  return <time dateTime={iso}>{text}</time>;
}
