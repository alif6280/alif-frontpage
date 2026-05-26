-- ══════════════════════════════════════════════════════════════════
-- KYAU Front Page Generator — Supabase SQL Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Departments ───────────────────────────────────────────────────
create table if not exists departments (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  short_name      text,
  university_name text default 'Khwaja Yunus Ali University',
  created_at      timestamptz default now()
);

insert into departments (name, short_name) values
  ('Computer Science and Engineering', 'CSE'),
  ('Electrical and Electronic Engineering', 'EEE'),
  ('Business Administration', 'BBA'),
  ('Law', 'Law'),
  ('Pharmacy', 'Pharmacy')
on conflict do nothing;

-- ── Teachers ──────────────────────────────────────────────────────
create table if not exists teachers (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  designation     text,
  department_id   uuid references departments(id),
  email           text,
  created_at      timestamptz default now()
);

-- Insert all KYAU CSE teachers
with cse_dept as (select id from departments where short_name = 'CSE' limit 1)
insert into teachers (name, designation, department_id) 
select t.name, t.designation, cse_dept.id from cse_dept, (values
  ('Mohammad Gazi Golam Faruque', 'Asst. Prof. & Head of CSE'),
  ('Md. Tarequl Islam',           'Asst. Prof. & Program Coordinator'),
  ('Prince Mahmud',               'Lecturer'),
  ('A. Hasib Uddin',              'Lecturer on Probation'),
  ('Rokeya Akter',                'Lecturer on Probation'),
  ('Abu Raihan',                  'Lecturer on Probation'),
  ('Ishrat Zahan Raka',           'Lecturer on Probation'),
  ('Nikhat Rejoana Sadia',        'Lecturer on Probation'),
  ('Md. Matiur Rahman',           'Lecturer (Physics)'),
  ('Md. Harun-or-Rashid',         'Lecturer (Math)'),
  ('Saikat Mitra',                'Lecturer (EEE)'),
  ('Sumaiya Shahria',             'Lecturer on Probation'),
  ('Prof. AHM Abual Islam',       'Professor (English)'),
  ('Farha Atif',                  'Lecturer (English)'),
  ('Dr. Md. Rajaul Karim',        'Lecturer (HUM)'),
  ('Rabia Bosri',                 'Lecturer (Accounting)'),
  ('Kamrul Hasan',                'Lecturer (Economics)'),
  ('Md. Mohitul Ameen Ahmed Mustafi', 'Lecturer (Statistics)'),
  ('Md. Roni Islam',              'Lecturer on Probation'),
  ('Dr. Md. Yaqub Sharif',        'Lecturer (Ethics)')
) as t(name, designation)
on conflict do nothing;

-- ── Courses ───────────────────────────────────────────────────────
create table if not exists courses (
  id              uuid primary key default uuid_generate_v4(),
  course_code     text not null,
  course_title    text not null,
  course_type     text default 'Theory',
  semester        text,
  department_id   uuid references departments(id),
  teacher_id      uuid references teachers(id),
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- NOTE: After running this schema, use the Admin Panel at /admin/courses
-- to add/edit courses, or bulk-insert them via the SQL Editor using
-- the teacher UUIDs from the teachers table.

-- ── Templates ─────────────────────────────────────────────────────
create table if not exists templates (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  description     text,
  thumbnail_url   text,
  is_default      boolean default false,
  is_active       boolean default true,
  created_at      timestamptz default now()
);

insert into templates (name, description, is_default, is_active) values
  ('KYAU Style',    'Centered logo, bold blue headings, two-column table',  true,  true),
  ('Modern Clean',  'Clean sans-serif, thin accent bar, card-style bottom', false, true),
  ('Minimal',       'Maximum whitespace, hairline borders, editorial',       false, true),
  ('Dark Academic', 'Navy header with gold text — elegant formal look',     false, true),
  ('Colorful',      'Teal-blue gradient header with vibrant accents',        false, true),
  ('Thesis Style',  'Fully centered, formal layout for final year projects', false, true)
on conflict do nothing;

-- ── Users ─────────────────────────────────────────────────────────
create table if not exists users (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  student_id       text unique,
  email            text unique,
  university_name  text default 'Khwaja Yunus Ali University',
  department       text,
  department_id    uuid references departments(id),
  batch            text,
  semester         text,
  role             text default 'student',
  avatar_url       text,
  profile_complete boolean default false,
  created_at       timestamptz default now()
);

-- ── History ───────────────────────────────────────────────────────
create table if not exists history (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references users(id) on delete cascade,
  template_id             uuid references templates(id),
  course_id               uuid references courses(id),
  university_name_override text,
  student_name            text,
  student_id_override     text,
  batch_override          text,
  semester_override       text,
  topic                   text,
  submission_date         date,
  pdf_url                 text,
  created_at              timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────
alter table users       enable row level security;
alter table history     enable row level security;
alter table courses     enable row level security;
alter table teachers    enable row level security;
alter table templates   enable row level security;
alter table departments enable row level security;

-- Users
create policy "users_select_own"  on users for select using (auth.uid() = id);
create policy "users_insert_own"  on users for insert with check (auth.uid() = id);
create policy "users_update_own"  on users for update using (auth.uid() = id);

-- History
create policy "history_own" on history for all using (auth.uid() = user_id);

-- Lookup tables: readable by authenticated users
create policy "courses_select"    on courses    for select using (auth.role() = 'authenticated');
create policy "teachers_select"   on teachers   for select using (auth.role() = 'authenticated');
create policy "templates_select"  on templates  for select using (auth.role() = 'authenticated');
create policy "depts_select"      on departments for select using (auth.role() = 'authenticated');

-- Admin: full access to everything
create policy "admin_courses"    on courses    for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "admin_teachers"   on teachers   for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "admin_templates"  on templates  for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "admin_users"      on users      for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "admin_history"    on history    for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "admin_depts"      on departments for all using ((select role from users where id = auth.uid()) = 'admin');

-- ── Storage Buckets (run separately in Storage dashboard or here) ──
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('logos', 'logos', true) on conflict do nothing;

-- Storage policies (after creating buckets)
-- create policy "avatar_upload" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "avatar_public" on storage.objects for select using (bucket_id = 'avatars');
