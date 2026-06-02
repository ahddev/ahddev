import { NextResponse } from "next/server";
import { savePushSubscription } from "@/lib/inbox-store";
import { isPushConfigured } from "@/lib/push";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Storage is not configured (Supabase)." },
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

  try {
    await savePushSubscription(subscription);
  } catch (err) {
    console.error("Failed to save push subscription:", err);
    return NextResponse.json({ error: "Failed to save subscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
