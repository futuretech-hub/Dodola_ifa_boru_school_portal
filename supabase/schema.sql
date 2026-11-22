-- Dodola Ifa Boru School Portal
-- Minimal student-dashboard schema.
-- Run this file in Supabase Dashboard -> SQL Editor.
-- It intentionally does not create student IDs, payments, parents, library, dormitory, or meal records.

create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum (
    'student',
    'teacher',
    'admission_officer',
    'academic_leader',
    'school_director',
    'super_admin'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.account_status as enum ('pending', 'active', 'suspended', 'disabled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.application_status as enum ('pending', 'approved', 'rejected', 'returned_for_correction');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.enrollment_status as enum ('pending', 'active', 'withdrawn', 'graduated');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'student',
  account_status public.account_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  gender text check (gender in ('Male', 'Female')),
  date_of_birth date,
  profile_photo_url text,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  profile_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  starts_on date,
  ends_on date,
  is_current boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.grade_sections (
  id uuid primary key default gen_random_uuid(),
  academic_year_id uuid not null references public.academic_years(id) on delete cascade,
  grade smallint not null check (grade between 9 and 12),
  section text not null check (section in ('A', 'B', 'C', 'D', 'E', 'F')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (academic_year_id, grade, section)
);

create table if not exists public.student_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  full_name text not null,
  gender text not null check (gender in ('Male', 'Female')),
  grade smallint not null check (grade between 9 and 12),
  section text not null check (section in ('A', 'B', 'C', 'D', 'E', 'F')),
  status public.application_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  reviewer_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  grade_section_id uuid not null references public.grade_sections(id) on delete restrict,
  status public.enrollment_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  unique (student_id, academic_year_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  audience text not null default 'all_students' check (audience in ('all_students', 'grade', 'section')),
  grade smallint check (grade between 9 and 12),
  section text check (section in ('A', 'B', 'C', 'D', 'E', 'F')),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists student_applications_status_idx on public.student_applications(status);
create index if not exists student_enrollments_student_idx on public.student_enrollments(student_id);
create index if not exists announcements_published_idx on public.announcements(is_published, published_at desc);

-- New Auth users become student profiles by default. Staff accounts can be changed later
-- by a protected admin workflow; the client can never choose an elevated role here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, account_status)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Student'),
    'student',
    'pending'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.academic_years enable row level security;
alter table public.grade_sections enable row level security;
alter table public.student_applications enable row level security;
alter table public.student_enrollments enable row level security;
alter table public.announcements enable row level security;

-- Table privileges are required in addition to RLS policies.
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update on public.student_profiles to authenticated;
grant select on public.academic_years to authenticated;
grant select on public.grade_sections to anon, authenticated;
grant select, insert, update on public.student_applications to authenticated;
grant select on public.student_enrollments to authenticated;
grant select on public.announcements to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Students can read their own student profile" on public.student_profiles;
create policy "Students can read their own student profile"
on public.student_profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Students can create their own student profile" on public.student_profiles;
create policy "Students can create their own student profile"
on public.student_profiles for insert to authenticated
with check (id = auth.uid());

drop policy if exists "Students can update their own student profile" on public.student_profiles;
create policy "Students can update their own student profile"
on public.student_profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Anyone can read active academic sections" on public.grade_sections;
create policy "Anyone can read active academic sections"
on public.grade_sections for select to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated users can read academic years" on public.academic_years;
create policy "Authenticated users can read academic years"
on public.academic_years for select to authenticated
using (true);

drop policy if exists "Students can create their own application" on public.student_applications;
create policy "Students can create their own application"
on public.student_applications for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "Students can read their own application" on public.student_applications;
create policy "Students can read their own application"
on public.student_applications for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Students can update their pending application" on public.student_applications;
create policy "Students can update their pending application"
on public.student_applications for update to authenticated
using (user_id = auth.uid() and status = 'pending')
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "Students can read their own enrollment" on public.student_enrollments;
create policy "Students can read their own enrollment"
on public.student_enrollments for select to authenticated
using (student_id = auth.uid());

drop policy if exists "Students can read published announcements" on public.announcements;
create policy "Students can read published announcements"
on public.announcements for select to authenticated
using (is_published = true and published_at is not null and published_at <= now());

-- Optional starter data. Change the year and section rows to match the school calendar
-- before using this in production.
insert into public.academic_years (name, starts_on, ends_on, is_current)
values ('2026/2027', '2026-09-01', '2027-07-31', true)
on conflict (name) do nothing;

insert into public.grade_sections (academic_year_id, grade, section)
select y.id, g.grade, s.section
from public.academic_years y
cross join generate_series(9, 12) as g(grade)
cross join unnest(array['A', 'B', 'C', 'D', 'E', 'F']) as s(section)
where y.name = '2026/2027'
on conflict (academic_year_id, grade, section) do nothing;

insert into public.announcements (title, message, audience, is_published, published_at)
select
  'Welcome to the student portal',
  'Your student dashboard is ready. Complete your profile after your account is approved.',
  'all_students',
  true,
  now()
where not exists (select 1 from public.announcements);
