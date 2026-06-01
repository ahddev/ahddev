import { NextResponse } from "next/server";
import { PUSH_SUB_KEY } from "@/lib/inbox";
import { isKvConfigured, kv } from "@/lib/kv";
import { isPushConfigured } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured (KV)." },
      { status: 503 }
    );
  }

  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Web Push is not configured (VAPID keys)." },
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
    !("subscription" in body) ||
    typeof (body as { subscription: unknown }).subscription !== "object"
  ) {
    return NextResponse.json({ error: "Missing subscription object." }, { status: 400 });
  }

  const { subscription } = body as { subscription: unknown };

  await kv.set(PUSH_SUB_KEY, JSON.stringify(subscription));

  return NextResponse.json({ ok: true });
}
