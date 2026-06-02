# Inbound email setup (`*@yourdomain.com` catch-all)

Email is delivered by **Resend** (send + inbound). Messages and push subscriptions are stored in **Supabase** (not Vercel KV).

## Important: use Resend’s exact DNS values

Resend MX hosts are **region-specific** (e.g. `inbound-smtp.us-east-1.amazonaws.com`), not `inbound-smtp.resend.com`.

If you see **“Invalid SPF MX: Records point to multiple regions”**:

1. Open **Resend → Domains → your domain** and copy DNS records from there only.
2. In your DNS provider, **delete** any extra Resend MX records (old region, generic hostnames, or duplicates).
3. Keep **one region** for all Resend MX records (send + inbound must match the region shown in Resend).
4. Click **Verify DNS records** again after DNS propagates (often 5–30 minutes).

## Recommended layout (avoids Gmail/iCloud conflicts)

Resend recommends a **subdomain** for receiving, not the root domain `@`:

| Purpose | Type | Name (host) | Example value (from *your* Resend dashboard) |
|---------|------|-------------|---------------------------------------------|
| Sending (SPF return path) | MX | `send` | `10 feedback-smtp.us-east-1.amazonses.com` |
| Receiving | MX | `inbound` | `10 inbound-smtp.us-east-1.amazonaws.com` |

Use the **exact** hostname and region from your domain page — do not mix `us-east-1` with `eu-west-1`.

### Catch-all on a subdomain

1. In Resend, verify **`mail.ahed.dev`** (example) with receiving enabled.
2. Inbound route: `*` → webhook `https://ahddev.dev/api/receive-email`.
3. Mail to `anything@mail.ahed.dev` is received by Resend.

### Catch-all on root `@`

Only if you **do not** need Google/iCloud mail on the same domain:

- Single MX on `@` pointing to the **inbound** host from Resend (one region only).
- Remove other MX records for `@` (Gmail, etc.) or inbound will not go to Resend.

## SPF (TXT)

- **One** TXT record on `@` starting with `v=spf1` (merge all `include:` mechanisms; never two SPF TXT records).
- Resend’s sending SPF is usually on the `send` subdomain — follow what the dashboard lists.

## Resend dashboard checklist

1. **Domains** → domain → enable **Receiving**
2. **Inbound** → route `*` (wildcard)
3. **Webhooks** → `https://ahddev.dev/api/receive-email` → event `email.received`
4. Set `RESEND_WEBHOOK_SECRET` in your app env (local `.env` and Vercel/host env)

## Supabase storage

Tables `inbox_emails` and `push_subscriptions` live in your Supabase project. Migration: `supabase/migrations/20260602120000_inbox_emails_and_push.sql` (already applied if you used the Supabase MCP/CLI).

### Environment variables

From [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings** → **API**:

| Variable | Where to use |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` or publishable key (optional for this app; inbox uses service role only) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — Next.js API routes and `/get-emails` |

Copy keys into `.env` locally. On Vercel, add the same keys under **Project → Settings → Environment Variables** (do not commit `.env`).

RLS is enabled on both tables with **no public policies** — only the service role (server) can read/write.

## iPhone push

1. Open `/get-emails` in **Safari** (iOS 16.4+)
2. Tap **Enable push notifications**

Push only fires after you subscribe on that page.
