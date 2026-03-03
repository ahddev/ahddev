"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopySnippetButtonProps = {
  value: string;
};

export function CopySnippetButton({ value }: CopySnippetButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
