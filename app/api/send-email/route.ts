import { Resend } from "resend";
import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  if (!from) {
    return NextResponse.json(
      { error: "Sender address is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("to" in body) ||
    !("subject" in body) ||
    !("text" in body)
  ) {
    return NextResponse.json(
      { error: "Missing required fields: to, subject, text." },
      { status: 400 }
    );
  }

  const { to, subject, text } = body as Record<string, unknown>;

  if (typeof to !== "string" || typeof subject !== "string" || typeof text !== "string") {
    return NextResponse.json(
      { error: "Fields to, subject, and text must be strings." },
      { status: 400 }
    );
  }

  const toTrim = to.trim();
  const subjectTrim = subject.trim();
  const textTrim = text.trim();

  if (!toTrim || !subjectTrim || !textTrim) {
    return NextResponse.json(
      { error: "to, subject, and text cannot be empty." },
      { status: 400 }
    );
  }

  if (!emailPattern.test(toTrim)) {
    return NextResponse.json({ error: "Invalid recipient email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: toTrim,
    subject: subjectTrim,
    text: textTrim,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to send email." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
