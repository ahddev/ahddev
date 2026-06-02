"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToInbox() {
  return (
    <Link
      href="/get-emails"
      className="inline-flex items-center gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground lg:hidden"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Inbox
    </Link>
  );
}
