# email.ahed.dev

Private mail client for `*@ahed.dev`: one owner, password login.

- **Resend** sends mail and receives it (inbound webhook).
- **Supabase** stores everything: Postgres (mail, threads, search), Auth (login), Storage (attachments), Realtime (live updates).
- **Web Push** notifies each device you enable it on.

## Run locally

```bash
cp .env.example .env   # fill in the values
npm install
npm run dev
npm test               # threading rules
```

## How it fits together

| Path | What it does |
|------|--------------|
| `proxy.ts` | Refreshes the session; sends signed-out visitors to `/login` |
| `app/api/webhooks/resend/route.ts` | Receives mail and delivery events from Resend. Rejects anything without a valid signature |
| `app/(mail)/[folder]/[[...thread]]/page.tsx` | The mailbox: list, and list + conversation |
| `lib/mail/actions.ts` | Send, archive, trash, star, mark read (server actions) |
| `lib/mail/queries.ts` | Reads, always as the signed-in user so row-level security applies |
| `lib/mail/threading.ts` | How replies are grouped into conversations |
| `supabase/migrations/` | Database schema |

Access is enforced in the database: every table and the attachments bucket only answer to accounts listed in `public.owners`. The service-role key is used by the webhook alone.

## First-time setup

### Supabase

1. SQL editor: run the files in `supabase/migrations/` in name order (skip the ones already applied).
2. Authentication → Users → **Add user**: your login email and a password, with "Auto Confirm User" on.
3. Authentication → Sign In / Providers → Email: turn **off** "Allow new users to sign up".
4. SQL editor, with your login email:

   ```sql
   insert into public.owners (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

To change the password later: Authentication → Users → the user → Reset password.

### Resend

1. Domains → your domain: sending and receiving enabled, DNS records exactly as Resend shows them (one region only).
2. Webhooks → endpoint `https://email.ahed.dev/api/webhooks/resend` with events `email.received`, `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.complained`, `email.failed`.
3. Copy the webhook's signing secret into `RESEND_WEBHOOK_SECRET`.

`email.sent` matters more than it looks: it carries the Message-ID of mail you sent, which is how a reply to it is matched to the right conversation.

### Push notifications

Open the app, click your address at the bottom of the sidebar → **Enable notifications**. Do this once per device. On iPhone, first add the app to the Home Screen (Share → Add to Home Screen) and open it from there; iOS only allows push for installed web apps.

## Not built yet

Drafts folder (unsent text is kept in the browser instead), formatted quoting of the original in replies (quoted as plain text), inline `cid:` images, labels, a password-reset screen, two-factor login.
