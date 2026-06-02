-- Inbound email storage (written by Next.js API with service role)
create table public.inbox_emails (
  id text primary key,
  recipient text not null,
  sender text not null,
  subject text not null default '',
  body text not null default '',
  received_at timestamptz not null default now()
);

create index inbox_emails_received_at_idx on public.inbox_emails (received_at desc);

-- Single Web Push subscription for /get-emails
create table public.push_subscriptions (
  id text primary key default 'default',
  subscription jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.inbox_emails enable row level security;
alter table public.push_subscriptions enable row level security;

comment on table public.inbox_emails is 'Catch-all inbox messages from Resend inbound webhook';
comment on table public.push_subscriptions is 'Web Push subscription for new-email notifications';
