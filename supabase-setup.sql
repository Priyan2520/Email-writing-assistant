-- Run this in your Supabase SQL Editor to create the required table
-- Go to: https://app.supabase.com > Your Project > SQL Editor > New Query

create table if not exists email_logs (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now() not null,
  prompt_preview text,
  tone        text not null,
  email_type  text not null,
  language    text default 'English',
  status      text default 'Success'
);

-- Optional: Create an index for faster queries on the admin dashboard
create index if not exists email_logs_created_at_idx on email_logs (created_at desc);

-- Optional: Enable Row Level Security (recommended for production)
-- alter table email_logs enable row level security;
