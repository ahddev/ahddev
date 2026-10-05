"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Paperclip, SquarePen, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Editor } from "@/components/mail/editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendEmail, type SendInput } from "@/lib/mail/actions";
import { formatBytes } from "@/lib/mail/format";
import { BUCKET, type Attachment } from "@/lib/mail/queries";
import { extractAddresses } from "@/lib/mail/threading";
import { createClient } from "@/lib/supabase/client";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

/** The parts of a message that replying to or forwarding it needs. */
export type ComposeSource = {
  id: string;
  direction: "in" | "out";
  sender: string;
  reply_to: string;
  recipient: string;
  cc: string;
  subject: string;
  attachments: Attachment[];
};

export type ComposeRequest =
  | { mode: "new" }
  | { mode: "reply" | "replyAll" | "forward"; email: ComposeSource };

type Draft = {
  from: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  html: string;
  files: SendInput["attachments"];
};

const ComposeContext = createContext<(request?: ComposeRequest) => void>(() => {});

/** Opens the compose window: `openCompose()` for a new message. */
export const useCompose = () => useContext(ComposeContext);

type Identity = { address: string; domain: string; mine: string[]; contacts: string[] };

export function ComposeProvider({
  children,
  ...identity
}: Identity & { children: React.ReactNode }) {
  const [request, setRequest] = useState<ComposeRequest | null>(null);

  return (
    <ComposeContext value={(next = { mode: "new" }) => setRequest(next)}>
      {children}
      <datalist id="mail-from">
        {identity.mine.map((address) => (
          <option key={address} value={address} />
        ))}
      </datalist>
      <datalist id="mail-contacts">
        {identity.contacts.map((address) => (
          <option key={address} value={address} />
        ))}
      </datalist>
      {request && (
        <ComposeDialog
          request={request}
          identity={identity}
          onClose={() => setRequest(null)}
        />
      )}
    </ComposeContext>
  );
}

/** Floating compose button for phones, where the sidebar is tucked away. */
export function ComposeFab() {
  const openCompose = useCompose();
  return (
    <Button
      size="icon"
      aria-label="Compose"
      onClick={() => openCompose()}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20 size-14 rounded-full shadow-lg md:hidden"
    >
      <SquarePen className="size-6" />
    </Button>
  );
}

const withPrefix = (prefix: string, subject: string) =>
  new RegExp(`^${prefix}:`, "i").test(subject.trim()) ? subject : `${prefix}: ${subject}`;

function initialDraft(request: ComposeRequest, identity: Identity): Draft {
  const blank: Draft = {
    from: identity.address,
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    html: "",
    files: [],
  };
  if (request.mode === "new") return blank;

  const { email } = request;
  const isMine = (address: string) => address.endsWith(`@${identity.domain}`);
  const recipients = extractAddresses(`${email.recipient} ${email.cc}`);
  // answer from the address the mail was sent to
  const from =
    (email.direction === "in"
      ? recipients.find(isMine)
      : extractAddresses(email.sender).find(isMine)) ?? identity.address;

  if (request.mode === "forward") {
    return {
      ...blank,
      from,
      subject: withPrefix("Fwd", email.subject),
      files: email.attachments.flatMap((file) =>
        file.storage_path
          ? [
              {
                path: file.storage_path,
                filename: file.filename,
                contentType: file.content_type,
                size: file.size,
                copy: true,
              },
            ]
          : []
      ),
    };
  }

  const to =
    email.direction === "in"
      ? extractAddresses(email.reply_to || email.sender)
      : extractAddresses(email.recipient);
  const cc =
    request.mode === "replyAll"
      ? recipients.filter((address) => !isMine(address) && !to.includes(address))
      : [];
  return {
    ...blank,
    from,
    to: to.join(", "),
    cc: cc.join(", "),
    subject: withPrefix("Re", email.subject),
  };
}

const TITLES = { new: "New message", reply: "Reply", replyAll: "Reply all", forward: "Forward" };

function ComposeDialog({
  request,
  identity,
  onClose,
}: {
  request: ComposeRequest;
  identity: Identity;
  onClose: () => void;
}) {
  // Unsent text survives closing the window or the tab, per message being answered.
  const draftKey = `mail-draft:${request.mode}:${request.mode === "new" ? "" : request.email.id}`;
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) return JSON.parse(saved) as Draft;
    } catch {
      // unreadable draft: start fresh
    }
    return initialDraft(request, identity);
  });
  const [showCc, setShowCc] = useState(Boolean(draft.cc || draft.bcc));
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [draft, draftKey]);

  const set = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));
  const totalBytes = draft.files.reduce((sum, file) => sum + file.size, 0);

  async function upload(list: FileList | null) {
    const picked = Array.from(list ?? []);
    if (picked.length === 0) return;
    if (totalBytes + picked.reduce((sum, file) => sum + file.size, 0) > MAX_ATTACHMENT_BYTES) {
      toast.error("Attachments are limited to 25 MB per message.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    for (const file of picked) {
      // straight to Storage: request bodies through the server are capped at 4.5 MB
      const path = `out/${crypto.randomUUID()}/${crypto.randomUUID()}`;
      const contentType = file.type || "application/octet-stream";
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType });
      if (error) {
        toast.error(`Could not upload ${file.name}: ${error.message}`);
        continue;
      }
      setDraft((current) => ({
        ...current,
        files: [
          ...current.files,
          { path, filename: file.name, contentType, size: file.size, copy: false },
        ],
      }));
    }
    setUploading(false);
  }

  function removeFiles(files: Draft["files"]) {
    // forwarded files still belong to the original message; only delete our uploads
    const uploaded = files.filter((file) => !file.copy).map((file) => file.path);
    if (uploaded.length > 0) void createClient().storage.from(BUCKET).remove(uploaded);
    setDraft((current) => ({
      ...current,
      files: current.files.filter((file) => !files.includes(file)),
    }));
  }

  function discard() {
    removeFiles(draft.files);
    // after the autosave effect of this render, so the draft stays gone
    setTimeout(() => localStorage.removeItem(draftKey));
    onClose();
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    try {
      const result = await sendEmail({
        from: draft.from.trim(),
        to: extractAddresses(draft.to),
        cc: extractAddresses(draft.cc),
        bcc: extractAddresses(draft.bcc),
        subject: draft.subject,
        html: draft.html,
        quote:
          request.mode === "new"
            ? undefined
            : {
                id: request.email.id,
                mode: request.mode === "forward" ? "forward" : "reply",
              },
        attachments: draft.files,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Sent");
      setTimeout(() => localStorage.removeItem(draftKey));
      onClose();
    } catch {
      toast.error("Could not send. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  const field =
    "min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground md:text-sm";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        // a stray click outside must not throw the message away
        onInteractOutside={(event) => event.preventDefault()}
        className="flex h-dvh max-w-none flex-col gap-0 rounded-none border-0 p-0 sm:h-[min(85dvh,46rem)] sm:max-w-2xl sm:rounded-lg sm:border"
      >
        <div className="flex shrink-0 items-center justify-between border-b py-2 pr-2 pl-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <DialogTitle className="text-base">{TITLES[request.mode]}</DialogTitle>
          <DialogDescription className="sr-only">Write and send an email.</DialogDescription>
          <Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={send} className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 divide-y border-b px-4">
            <label className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-muted-foreground">From</span>
              <input
                type="email"
                required
                list="mail-from"
                value={draft.from}
                onChange={(event) => set({ from: event.target.value })}
                className={field}
              />
            </label>
            <div className="flex items-center gap-3">
              <label htmlFor="compose-to" className="w-14 shrink-0 text-sm text-muted-foreground">
                To
              </label>
              <input
                id="compose-to"
                type="email"
                multiple
                required
                list="mail-contacts"
                autoFocus={request.mode === "new" || request.mode === "forward"}
                value={draft.to}
                onChange={(event) => set({ to: event.target.value })}
                className={field}
              />
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="shrink-0 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Cc/Bcc
                </button>
              )}
            </div>
            {showCc &&
              (["cc", "bcc"] as const).map((name) => (
                <label key={name} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-sm text-muted-foreground capitalize">
                    {name}
                  </span>
                  <input
                    type="email"
                    multiple
                    list="mail-contacts"
                    value={draft[name]}
                    onChange={(event) => set({ [name]: event.target.value })}
                    className={field}
                  />
                </label>
              ))}
            <label className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm text-muted-foreground">Subject</span>
              <input
                type="text"
                maxLength={500}
                value={draft.subject}
                onChange={(event) => set({ subject: event.target.value })}
                className={field}
              />
            </label>
          </div>

          <Editor
            className="flex-1"
            content={draft.html}
            onChange={(html) => set({ html })}
            autoFocus={request.mode === "reply" || request.mode === "replyAll"}
          />

          {request.mode !== "new" && (
            <p className="shrink-0 border-t px-4 py-2 text-xs text-muted-foreground">
              The original message will be included below your text.
            </p>
          )}

          {draft.files.length > 0 && (
            <ul className="flex max-h-28 shrink-0 flex-wrap gap-2 overflow-y-auto border-t px-4 py-2">
              {draft.files.map((file) => (
                <li
                  key={file.path}
                  className="flex max-w-full items-center gap-2 rounded-md border bg-muted/40 py-1 pr-1 pl-2 text-xs"
                >
                  <Paperclip className="size-3 shrink-0" />
                  <span className="truncate">{file.filename}</span>
                  <span className="shrink-0 text-muted-foreground">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.filename}`}
                    onClick={() => removeFiles([file])}
                    className="flex size-6 shrink-0 items-center justify-center rounded hover:bg-accent"
                  >
                    <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex shrink-0 items-center gap-1 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button type="submit" disabled={sending || uploading}>
              {sending ? "Sending…" : "Send"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Attach files"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
            >
              <Paperclip />
            </Button>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              onChange={(event) => {
                void upload(event.target.files);
                event.target.value = "";
              }}
            />
            {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Discard"
              className="ml-auto"
              onClick={discard}
            >
              <Trash2 />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
