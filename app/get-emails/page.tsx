import { Mail } from "lucide-react";

export default function GetEmailsIndexPage() {
  return (
    <div className="hidden h-full flex-col items-center justify-center px-6 text-center lg:flex">
      <div className="mb-4 rounded-full border border-border bg-muted/40 p-4">
        <Mail className="size-8 text-muted-foreground" aria-hidden />
      </div>
      <p className="text-sm font-medium text-foreground">Select an email</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Choose a message from the list to read it here.
      </p>
    </div>
  );
}
