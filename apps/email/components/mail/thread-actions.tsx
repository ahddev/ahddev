"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  Forward,
  Inbox,
  MailOpen,
  Reply,
  ReplyAll,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCompose, type ComposeSource } from "@/components/mail/compose";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { markThreadRead, moveThread, setStar, type MoveOp } from "@/lib/mail/actions";
import { cn } from "@/lib/utils";

/** Opening a conversation marks it read. An effect, so link prefetching never does it. */
export function MarkRead({ threadId }: { threadId: string }) {
  useEffect(() => {
    void markThreadRead(threadId, true);
  }, [threadId]);
  return null;
}

function IconAction({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} disabled={disabled} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type ThreadActionsProps = {
  threadId: string;
  /** Where the conversation is being viewed from. */
  place: "inbox" | "archive" | "trash" | "other";
  backHref: string;
};

export function ThreadActions({ threadId, place, backHref }: ThreadActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<void>, done: string) =>
    startTransition(async () => {
      try {
        await action();
        toast(done);
        router.push(backHref);
      } catch {
        toast.error("That did not work. Try again.");
      }
    });
  const move = (op: MoveOp, done: string) => run(() => moveThread(threadId, op), done);

  if (place === "trash") {
    return (
      <>
        <IconAction label="Restore" disabled={pending} onClick={() => move("restore", "Restored")}>
          <ArchiveRestore />
        </IconAction>
        <IconAction
          label="Delete forever"
          disabled={pending}
          onClick={() => {
            if (window.confirm("Delete this conversation forever? This cannot be undone.")) {
              move("delete", "Deleted");
            }
          }}
        >
          <Trash2 className="text-destructive" />
        </IconAction>
      </>
    );
  }

  return (
    <>
      {place === "inbox" && (
        <IconAction label="Archive" disabled={pending} onClick={() => move("archive", "Archived")}>
          <Archive />
        </IconAction>
      )}
      {place === "archive" && (
        <IconAction
          label="Move to inbox"
          disabled={pending}
          onClick={() => move("inbox", "Moved to inbox")}
        >
          <Inbox />
        </IconAction>
      )}
      <IconAction label="Move to trash" disabled={pending} onClick={() => move("trash", "Moved to trash")}>
        <Trash2 />
      </IconAction>
      <IconAction
        label="Mark as unread"
        disabled={pending}
        onClick={() => run(() => markThreadRead(threadId, false), "Marked as unread")}
      >
        <MailOpen />
      </IconAction>
    </>
  );
}

export function MessageActions({
  email,
  starred,
  canReplyAll,
}: {
  email: ComposeSource;
  starred: boolean;
  canReplyAll: boolean;
}) {
  const openCompose = useCompose();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => openCompose({ mode: "reply", email })}>
        <Reply />
        Reply
      </Button>
      {canReplyAll && (
        <Button variant="outline" size="sm" onClick={() => openCompose({ mode: "replyAll", email })}>
          <ReplyAll />
          Reply all
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={() => openCompose({ mode: "forward", email })}>
        <Forward />
        Forward
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto"
        aria-label={starred ? "Remove star" : "Star"}
        aria-pressed={starred}
        disabled={pending}
        onClick={() => startTransition(() => setStar(email.id, !starred))}
      >
        <Star className={cn(starred && "fill-amber-400 text-amber-400")} />
      </Button>
    </div>
  );
}
