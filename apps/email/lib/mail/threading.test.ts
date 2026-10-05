import assert from "node:assert/strict";
import { test } from "node:test";
import {
  extractAddresses,
  hasReplyPrefix,
  matchBySubject,
  normalizeSubject,
  parseMessageIds,
} from "./threading.ts";

test("parseMessageIds reads bracketed and bare ids", () => {
  assert.deepEqual(parseMessageIds("<a@x.com> <b@y.com>"), ["a@x.com", "b@y.com"]);
  assert.deepEqual(parseMessageIds("<a@x.com>\r\n\t<b@y.com>"), ["a@x.com", "b@y.com"]);
  assert.deepEqual(parseMessageIds("a@x.com"), ["a@x.com"]);
  assert.deepEqual(parseMessageIds(undefined), []);
  assert.deepEqual(parseMessageIds(""), []);
});

test("extractAddresses handles names, commas and duplicates", () => {
  assert.deepEqual(extractAddresses('"Doe, Jane" <Jane@X.com>, bob@y.com'), [
    "jane@x.com",
    "bob@y.com",
  ]);
  assert.deepEqual(extractAddresses("a@x.com, A@X.com"), ["a@x.com"]);
  assert.deepEqual(extractAddresses("no address here"), []);
});

test("normalizeSubject strips stacked reply and forward prefixes", () => {
  assert.equal(normalizeSubject("Re: RE: Fwd:  Invoice  #12"), "invoice #12");
  assert.equal(normalizeSubject("رد: فاتورة"), "فاتورة");
  assert.equal(normalizeSubject("Re[2]: Hello"), "hello");
  assert.equal(normalizeSubject("Regarding lunch"), "regarding lunch");
  assert.equal(hasReplyPrefix("Re: hi"), true);
  assert.equal(hasReplyPrefix("Regarding lunch"), false);
});

test("matchBySubject needs the same subject and a shared correspondent", () => {
  const candidates = [
    {
      thread_id: "t-other",
      subject: "Invoice",
      sender: "reach@ahed.dev",
      recipient: "someone-else@gmail.com",
      cc: "",
    },
    {
      thread_id: "t-sara",
      subject: "Invoice",
      sender: "Ahed <reach@ahed.dev>",
      recipient: "sara@gmail.com",
      cc: "",
    },
  ];

  assert.equal(
    matchBySubject({ subject: "Re: Invoice", from: "Sara <SARA@gmail.com>" }, candidates),
    "t-sara"
  );
  assert.equal(
    matchBySubject({ subject: "Re: Invoice", from: "stranger@evil.com" }, candidates),
    null
  );
  assert.equal(
    matchBySubject({ subject: "Re: Something else", from: "sara@gmail.com" }, candidates),
    null
  );
  // an empty subject must never glue unrelated mail together
  assert.equal(
    matchBySubject(
      { subject: "Re:", from: "sara@gmail.com" },
      [{ ...candidates[1], subject: "" }]
    ),
    null
  );
});
