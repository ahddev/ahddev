-- Mail platform: single-owner mailbox with threads, folders, attachments,
-- search and realtime. Builds on inbox_emails / push_subscriptions.

-- 1. Owner allowlist. Every policy below checks it, so an account that is not
--    listed here can read nothing even if sign-ups are ever left enabled.
create table public.owners (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.owners enable row level security;

create policy "owner reads own row" on public.owners
  for select to authenticated
  using (user_id = (select auth.uid()));

create function public.is_owner() returns boolean
  language sql stable
  set search_path = ''
  as $$ select exists (select 1 from public.owners where user_id = (select auth.uid())) $$;

-- 2. Emails: received and sent mail in one table.
alter table public.inbox_emails rename to emails;
alter index public.inbox_emails_received_at_idx rename to emails_received_at_idx;

alter table public.emails
  add column direction text not null default 'in' check (direction in ('in', 'out')),
  add column folder text not null default 'inbox'
    check (folder in ('inbox', 'sent', 'archive', 'trash')),
  -- existing rows each become their own thread
  add column thread_id uuid not null default gen_random_uuid(),
  add column message_id text,
  add column in_reply_to text,
  add column refs text not null default '',
  add column reply_to text not null default '',
  add column cc text not null default '',
  add column bcc text not null default '',
  -- mail that is already here counts as read; new mail defaults to unread below
  add column is_read boolean not null default true,
  add column is_starred boolean not null default false,
  add column has_attachments boolean not null default false,
  add column status text,
  -- 'simple' config: no stemming, so Arabic and English are both searchable.
  -- body is capped because a tsvector cannot exceed 1 MB.
  add column search tsvector generated always as (
    to_tsvector(
      'simple',
      coalesce(subject, '') || ' ' || coalesce(sender, '') || ' ' ||
      coalesce(recipient, '') || ' ' || left(coalesce(body, ''), 100000)
    )
  ) stored;

alter table public.emails alter column is_read set default false;

create index emails_thread_idx on public.emails (thread_id, received_at);
create index emails_folder_idx on public.emails (folder, received_at desc);
create index emails_message_id_idx on public.emails (message_id);
create index emails_search_idx on public.emails using gin (search);

comment on table public.emails is 'Received (Resend inbound webhook) and sent mail';

create policy "owner manages emails" on public.emails
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

-- 3. Attachments: metadata here, bytes in the private "attachments" bucket.
create table public.attachments (
  id text primary key default gen_random_uuid()::text,
  email_id text not null references public.emails (id) on delete cascade,
  filename text not null,
  content_type text not null default 'application/octet-stream',
  size bigint not null default 0,
  -- null when the copy from Resend failed
  storage_path text
);

create index attachments_email_idx on public.attachments (email_id);

alter table public.attachments enable row level security;

create policy "owner manages attachments" on public.attachments
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "owner reads attachment files" on storage.objects
  for select to authenticated
  using (bucket_id = 'attachments' and (select public.is_owner()));

create policy "owner uploads attachment files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'attachments' and (select public.is_owner()));

create policy "owner deletes attachment files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'attachments' and (select public.is_owner()));

-- 4. Push subscriptions: one row per device instead of a single 'default' row.
--    The old row belonged to the ahed.dev origin and cannot be reused.
drop table public.push_subscriptions;

create table public.push_subscriptions (
  endpoint text primary key,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "owner manages push subscriptions" on public.push_subscriptions
  for all to authenticated
  using ((select public.is_owner()))
  with check ((select public.is_owner()));

-- 5. One row per thread per folder, carrying its latest message.
--    Scans emails on every read: fine for a personal mailbox, replace with a
--    maintained threads table if it grows past tens of thousands of messages.
create view public.thread_list with (security_invoker = true) as
select distinct on (e.thread_id, e.folder)
  e.thread_id,
  e.folder,
  e.id as last_id,
  e.direction,
  e.sender,
  e.recipient,
  e.subject,
  left(e.body, 200) as snippet,
  e.received_at as last_at,
  count(*) over w as message_count,
  bool_or(not e.is_read) over w as unread,
  bool_or(e.is_starred) over w as starred,
  bool_or(e.has_attachments) over w as has_attachments
from public.emails e
window w as (partition by e.thread_id, e.folder)
order by e.thread_id, e.folder, e.received_at desc;

-- 6. Live updates in the browser (delivered only to rows the user may select).
alter publication supabase_realtime add table public.emails;

-- 7. Explicit grants, so this does not depend on the project's default privileges.
grant select on public.owners, public.thread_list to authenticated;
grant select, insert, update, delete
  on public.emails, public.attachments, public.push_subscriptions to authenticated;
grant all
  on public.owners, public.emails, public.attachments, public.push_subscriptions, public.thread_list
  to service_role;
