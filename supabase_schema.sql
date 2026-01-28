-- Create the table
create table registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  formation_id text not null
);

-- Enable RLS
alter table registrations enable row level security;

-- Create policy to allow public inserts
create policy "Enable insert for public"
on registrations
for insert
with check (true);

-- Allow read access for dashboard
create policy "Enable read for all"
on registrations
for select
using (true);

-- =============================================
-- ADMINS TABLE
-- =============================================

-- Create admins table for dashboard access
create table admins (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null,
  password_hash text not null
);

-- Enable RLS on admins
alter table admins enable row level security;

-- Allow reading admins for login verification
create policy "Enable read for login"
on admins
for select
using (true);
