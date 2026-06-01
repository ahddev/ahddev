# Inbound email setup (`*@ahed.dev` catch-all)

## 1. DNS — MX record

Add this MX record for your domain (catch-all routes all addresses):

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX | `@` (or your domain) | `inbound-smtp.resend.com` | `10` |

If you already use Google/iCloud mail, Resend must have the **lowest** priority number to receive mail first, or use a subdomain for inbound only.

## 2. Resend dashboard

1. **Domains** → your domain → enable **Receiving**
2. **Inbound** → route address: `*` (wildcard catch-all)
3. **Webhooks** → create endpoint:
   - URL: `https://ahddev.dev/api/receive-email`
   - Events: `email.received`
4. Copy the **webhook signing secret** into `RESEND_WEBHOOK_SECRET`

## 3. Vercel KV

1. Vercel project → **Storage** → **Create Database** → **KV**
2. Link to the project and pull env vars: `vercel env pull`

## 4. iPhone push

1. Open `https://ahddev.dev/get-emails` in **Safari** (iOS 16.4+)
2. Tap **Enable push notifications** and allow
3. New inbound emails will notify your phone while a subscription is saved in KV

Push is only sent if you have subscribed (visited `/get-emails` and enabled notifications).
