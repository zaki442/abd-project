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

-- (Optional) Create policy to allow read access only to service role or authenticated users if needed
-- For now, we only need insert.
