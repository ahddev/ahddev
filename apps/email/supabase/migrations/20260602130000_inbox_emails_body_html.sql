alter table public.inbox_emails
  add column if not exists body_html text not null default '';

comment on column public.inbox_emails.body_html is 'Original HTML body from Resend inbound (displayed in sandboxed viewer)';
