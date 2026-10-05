"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyEmailButton({ email }: { email: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => {
        navigator.clipboard.writeText(email);
      }}
    >
      <Mail className="h-4 w-4" />
      Copy email
    </Button>
  );
}
