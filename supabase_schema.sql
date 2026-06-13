-- Create the table
create table registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  phone_number text,
  where_did_you_hear text,
  specialite text,
  ville text,
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

-- Allow update for dashboard
create policy "Enable update for all"
on registrations
for update
using (true);

-- Allow delete for dashboard
create policy "Enable delete for all"
on registrations
for delete
using (true);

-- =============================================
-- ADMINS TABLE
-- =============================================

-- Create admins table for dashboard access
create table admins (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
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

-- Allow inserting admins
create policy "Enable insert for all"
on admins
for insert
with check (true);

-- Allow update for all
create policy "Enable update for all"
on admins
for update
using (true);

-- Allow delete for all
create policy "Enable delete for all"
on admins
for delete
using (true);

-- =============================================
-- FORMATION CATEGORIES TABLE
-- =============================================

create table formations_category (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique
);

alter table formations_category enable row level security;

create policy "Enable read for all"
on formations_category
for select
using (true);

create policy "Enable write for authenticated admins"
on formations_category
for all
using (true); -- Ideally restrict to admins, but relying on app-level auth for now or 'true' for simplicity as per existing pattern

-- =============================================
-- FORMATIONS TABLE
-- =============================================

create table formations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  date text not null,
  price text not null,
  image_url text not null
);

alter table formations enable row level security;

create policy "Enable read for all"
on formations
for select
using (true);

create policy "Enable write for authenticated admins"
on formations
for all
using (true);

-- =============================================
-- FORMATION CATEGORIES LINK (Junction Table)
-- =============================================

create table formation_category_link (
  formation_id uuid references formations(id) on delete cascade,
  category_id uuid references formations_category(id) on delete cascade,
  primary key (formation_id, category_id)
);

alter table formation_category_link enable row level security;

create policy "Enable read for all"
on formation_category_link
for select
using (true);

create policy "Enable write for authenticated admins"
on formation_category_link
for all
using (true);

-- =============================================
-- STORAGE
-- =============================================

-- Create the 'formations' bucket
-- (Bucket creation moved to seed.sql)

-- Allow public read access to the 'formations' bucket
drop policy if exists "Public Access to Formations Images" on storage.objects;
create policy "Public Access to Formations Images"
on storage.objects for select
using ( bucket_id = 'formations' );

-- Allow authenticated uploads to the 'formations' bucket
drop policy if exists "Authenticated Users Can Upload Images" on storage.objects;
create policy "Authenticated Users Can Upload Images"
on storage.objects for insert
with check ( bucket_id = 'formations' );

-- Allow authenticated updates/deletes (e.g. for admins)
drop policy if exists "Authenticated Users Can Update Images" on storage.objects;
create policy "Authenticated Users Can Update Images"
on storage.objects for update
using ( bucket_id = 'formations' );

drop policy if exists "Authenticated Users Can Delete Images" on storage.objects;
create policy "Authenticated Users Can Delete Images"
on storage.objects for delete
using ( bucket_id = 'formations' );

-- =============================================
-- JOBS TABLE
-- =============================================

create table jobs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  is_active boolean default true not null
);

alter table jobs enable row level security;

create policy "Enable read for jobs"
on jobs
for select
using (true);

create policy "Enable write for jobs admins"
on jobs
for all
using (true);

-- =============================================
-- JOB REGISTRATIONS TABLE
-- =============================================

create table job_registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  job_id uuid references jobs(id) on delete cascade not null,
  full_name text not null,
  email text not null,
  phone_number text,
  cover_letter text
);

alter table job_registrations enable row level security;

create policy "Enable insert for public job registrations"
on job_registrations
for insert
with check (true);

create policy "Enable read and write for job registrations admins"
on job_registrations
for all
using (true);

-- =============================================
-- FEEDBACKS TABLE
-- =============================================

create table feedbacks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text,
  role text,
  feedback text not null,
  image_url text
);

alter table feedbacks enable row level security;

create policy "Enable insert for public feedbacks"
on feedbacks
for insert
with check (true);

create policy "Enable read and write for feedbacks admins"
on feedbacks
for all
using (true);
