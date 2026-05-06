"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SendEmailsPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; id?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(data.id ? `Sent (id: ${data.id})` : "Sent.");
      setTo("");
      setSubject("");
      setText("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto max-w-lg px-6 sm:px-8">
        <h1 className="mb-2 font-[family-name:var(--font-syne)] text-2xl font-semibold">
          Send email
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Private tool — not linked from the site.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="to" className="text-sm font-medium">
              To
            </label>
            <input
              id="to"
              type="email"
              required
              autoComplete="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="body" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="body"
              required
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <Button type="submit" disabled={status === "loading"} className="w-fit rounded-full">
            {status === "loading" ? "Sending…" : "Send"}
          </Button>
        </form>

        {message && (
          <p
            className={`mt-6 text-sm ${
              status === "error" ? "text-destructive" : "text-muted-foreground"
            }`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
