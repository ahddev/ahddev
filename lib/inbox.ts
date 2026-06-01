export const EMAILS_LIST_KEY = "emails";
export const PUSH_SUB_KEY = "push:sub";
export const MAX_STORED_EMAILS = 200;

export type StoredEmail = {
  id: string;
  to: string;
  from: string;
  subject: string;
  text: string;
  date: string;
};

export function parseStoredEmail(raw: unknown): StoredEmail | null {
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as StoredEmail;
    if (
      typeof parsed.id === "string" &&
      typeof parsed.to === "string" &&
      typeof parsed.from === "string" &&
      typeof parsed.subject === "string" &&
      typeof parsed.text === "string" &&
      typeof parsed.date === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
