export const PUSH_SUBSCRIPTION_ROW_ID = "default";
export const MAX_STORED_EMAILS = 200;

export type StoredEmail = {
  id: string;
  to: string;
  from: string;
  subject: string;
  text: string;
  date: string;
};

export type InboxEmailRow = {
  id: string;
  recipient: string;
  sender: string;
  subject: string;
  body: string;
  received_at: string;
};

export function rowToStoredEmail(row: InboxEmailRow): StoredEmail {
  return {
    id: row.id,
    to: row.recipient,
    from: row.sender,
    subject: row.subject,
    text: row.body,
    date: row.received_at,
  };
}
