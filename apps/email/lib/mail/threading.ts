// Pure helpers for grouping mail into conversations. No imports, so
// `node --test lib/mail/threading.test.ts` runs this file directly.

/** Message-IDs in an In-Reply-To / References / Message-ID value, without the angle brackets. */
export function parseMessageIds(header: string | null | undefined): string[] {
  if (!header) return [];
  const bracketed = header.match(/<[^<>\s]+>/g);
  if (bracketed) return bracketed.map((id) => id.slice(1, -1));
  return header.split(/\s+/).filter(Boolean);
}

/** Bare lowercase addresses found in a From / To style string. */
export function extractAddresses(value: string): string[] {
  const found = value.match(/[^\s<>,;:"'()]+@[^\s<>,;:"'()]+/g) ?? [];
  return [...new Set(found.map((address) => address.toLowerCase()))];
}

const REPLY_PREFIX = /^(re|fwd?|aw|wg|رد|إعادة توجيه)\s*(\[\d+\])?\s*[:：]\s*/i;

/** Subject without reply/forward prefixes, for comparing conversations. */
export function normalizeSubject(subject: string): string {
  let rest = subject.trim();
  while (REPLY_PREFIX.test(rest)) rest = rest.replace(REPLY_PREFIX, "");
  return rest.replace(/\s+/g, " ").toLowerCase();
}

export function hasReplyPrefix(subject: string): boolean {
  return REPLY_PREFIX.test(subject.trim());
}

export type ThreadCandidate = {
  thread_id: string;
  subject: string;
  sender: string;
  recipient: string;
  cc: string;
};

/**
 * Fallback for a reply whose In-Reply-To / References match nothing we stored
 * (the first reply to mail we sent can arrive before its Message-ID is known).
 *
 * ponytail: subject + correspondent heuristic. It will merge two unrelated
 * conversations that share a subject and a person. Callers match on stored
 * Message-IDs first and only use this for messages that look like replies.
 */
export function matchBySubject(
  message: { subject: string; from: string },
  candidates: ThreadCandidate[]
): string | null {
  const subject = normalizeSubject(message.subject);
  const [from] = extractAddresses(message.from);
  if (!subject || !from) return null;

  const hit = candidates.find(
    (candidate) =>
      normalizeSubject(candidate.subject) === subject &&
      extractAddresses(
        `${candidate.sender} ${candidate.recipient} ${candidate.cc}`
      ).includes(from)
  );
  return hit?.thread_id ?? null;
}
