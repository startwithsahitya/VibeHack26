/*This file contains all the SQL Command using Supabase.*/

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp default now()
);


create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp default now()
);


create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp default now(),

  unique(group_id, user_id)
);


alter publication supabase_realtime add table messages;


alter table groups enable row level security;
alter table messages enable row level security;
alter table group_members enable row level security;


create policy "Allow authenticated users to read groups"
on groups for select
to authenticated
using (true);

create policy "Allow authenticated users to create groups"
on groups for insert
to authenticated
with check (auth.uid() = created_by);





create policy "Allow read messages"
on messages for select
to authenticated
using (true);

create policy "Allow insert messages"
on messages for insert
to authenticated
with check (auth.uid() = user_id);



create policy "Allow read group members"
on group_members for select
to authenticated
using (true);

create policy "Allow join group"
on group_members for insert
to authenticated
with check (auth.uid() = user_id);


create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text
);





create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();


