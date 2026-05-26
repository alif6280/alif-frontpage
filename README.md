# KYAU Front Page Generator — Complete Setup Guide

> Smart Assignment Front Page Generator for Khwaja Yunus Ali University (CSE Department)
> Version 1.0 · React + Tailwind + Supabase + Vercel

---

## 📁 Project Structure

```
kyau-frontpage/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/index.jsx          ← All reusable UI components
│   │   ├── layout/Navbar.jsx     ← Horizontal top navigation bar
│   │   └── FrontPagePreview.jsx  ← All 6 live preview templates
│   ├── data/
│   │   └── courses.js            ← Full KYAU CSE course database
│   ├── hooks/
│   │   ├── useAuth.jsx           ← Auth context (Email + Google)
│   │   └── useTheme.jsx          ← Dark mode context
│   ├── lib/
│   │   ├── supabase.js           ← Supabase client + all DB helpers
│   │   └── export.js             ← PDF (jsPDF) + DOCX export
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx         ← Email + Google OAuth login
│   │   ├── RegisterPage.jsx      ← 3-step: Account → Academic → OTP
│   │   ├── AuthCallbackPage.jsx  ← Google OAuth redirect handler
│   │   ├── ProfileSetupPage.jsx  ← Google users fill academic info here
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── GeneratorPage.jsx     ← Main 2-panel generator
│   │   ├── HistoryPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminCourses.jsx
│   │       ├── AdminTeachers.jsx
│   │       ├── AdminStudents.jsx
│   │       └── AdminTemplates.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env.example
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 Quick Start

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials (see Step 3):

```
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Go to **Project Settings → API** → copy `Project URL` and `anon public` key into your `.env`
3. Go to **SQL Editor** → paste and run the SQL below

### Step 4 — Enable Google OAuth (optional but recommended)

See [Google OAuth Setup](#-google-oauth-setup) section below.

### Step 5 — Run the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Supabase SQL — Run this in SQL Editor

```sql
-- ── Extensions ────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Departments ───────────────────────────────────────────────────
create table if not exists departments (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  short_name    text,
  university_name text default 'Khwaja Yunus Ali University',
  created_at    timestamptz default now()
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
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  designation   text,
  department_id uuid references departments(id),
  email         text,
  created_at    timestamptz default now()
);

-- ── Courses ───────────────────────────────────────────────────────
create table if not exists courses (
  id            uuid primary key default uuid_generate_v4(),
  course_code   text not null,
  course_title  text not null,
  course_type   text default 'Theory',   -- Theory | Lab | Project
  semester      text,                    -- '1st Year 1st Semester' etc.
  department_id uuid references departments(id),
  teacher_id    uuid references teachers(id),
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- ── Templates ─────────────────────────────────────────────────────
create table if not exists templates (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  thumbnail_url text,
  is_default    boolean default false,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

insert into templates (name, description, is_default, is_active) values
  ('KYAU Style',    'Centered logo, bold blue headings, two-column table', true,  true),
  ('Modern Clean',  'Clean sans-serif, thin accent bar, card-style bottom', false, true),
  ('Minimal',       'Maximum whitespace, hairline borders, editorial',      false, true),
  ('Dark Academic', 'Navy header with gold text — elegant formal look',    false, true),
  ('Colorful',      'Teal-blue gradient header with vibrant accents',       false, true),
  ('Thesis Style',  'Fully centered, formal layout for final year projects',false, true)
on conflict do nothing;

-- ── Users (profile table — extends Supabase Auth) ─────────────────
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
  role             text default 'student',  -- student | admin
  avatar_url       text,
  profile_complete boolean default false,
  created_at       timestamptz default now()
);

-- ── History ───────────────────────────────────────────────────────
create table if not exists history (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references users(id) on delete cascade,
  template_id           uuid references templates(id),
  course_id             uuid references courses(id),
  university_name_override text,
  student_name          text,
  student_id_override   text,
  batch_override        text,
  semester_override     text,
  topic                 text,
  submission_date       date,
  pdf_url               text,
  created_at            timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────
alter table users     enable row level security;
alter table history   enable row level security;
alter table courses   enable row level security;
alter table teachers  enable row level security;
alter table templates enable row level security;

-- Users: can read/write own row
create policy "Users read own"   on users for select using (auth.uid() = id);
create policy "Users update own" on users for update using (auth.uid() = id);
create policy "Users insert own" on users for insert with check (auth.uid() = id);

-- History: own rows only
create policy "History own" on history for all using (auth.uid() = user_id);

-- Courses/Teachers/Templates: readable by all authenticated users
create policy "Courses readable"   on courses   for select using (auth.role() = 'authenticated');
create policy "Teachers readable"  on teachers  for select using (auth.role() = 'authenticated');
create policy "Templates readable" on templates for select using (auth.role() = 'authenticated');

-- Admin full access (set role='admin' in users table for admin accounts)
create policy "Admin full courses"   on courses   for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "Admin full teachers"  on teachers  for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "Admin full templates" on templates for all using ((select role from users where id = auth.uid()) = 'admin');
create policy "Admin full users"     on users     for all using ((select role from users where id = auth.uid()) = 'admin');

-- ── Storage buckets ───────────────────────────────────────────────
-- Run these in Supabase Dashboard → Storage (or via SQL):
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('logos', 'logos', true);
```

---

## 🔑 Google OAuth Setup

### In Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Go to **APIs & Services → OAuth consent screen**
   - User type: External
   - Fill in App name, email
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs — add:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
5. Copy the **Client ID** and **Client Secret**

### In Supabase Dashboard

1. Go to **Authentication → Providers → Google**
2. Enable Google
3. Paste your **Client ID** and **Client Secret**
4. Go to **Authentication → URL Configuration**
5. Add to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-vercel-domain.vercel.app/auth/callback
   ```
6. Save

### How it works in the app

- User clicks **"Continue with Google"** on Login or Register page
- Supabase redirects to Google, user authenticates
- Google redirects to `https://your-project.supabase.co/auth/v1/callback`
- Supabase redirects to `/auth/callback` in the React app
- `AuthCallbackPage.jsx` checks if the profile is complete
  - **Complete** → goes to `/generator`
  - **Incomplete** (first login) → goes to `/profile-setup` where the student fills in their Student ID, Batch, Semester, etc.
- Profile is saved to the `users` table and auto-fills the generator on every subsequent visit

---

## 📦 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
vercel --prod
```

Or connect your GitHub repo to Vercel and it auto-deploys on every push.

**Add environment variables in Vercel:**
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

---

## 👤 Create an Admin Account

1. Register normally (email or Google)
2. Go to Supabase Dashboard → Table Editor → `users`
3. Find the row with your email
4. Change `role` from `student` to `admin`
5. The Admin panel link will appear in the navbar

---

## 🌱 Seed Courses into Supabase (optional)

The app uses the built-in static course data from `src/data/courses.js` as fallback.
To seed into the DB, go to Supabase SQL Editor and run the insert queries based on the course list in `courses.js`.

Or use the Admin Panel at `/admin/courses` to add courses one by one.

---

## ✅ Feature Checklist

### Version 1.0 (implemented)
- [x] Email + OTP registration (3-step)
- [x] Google OAuth login/register
- [x] Profile auto-complete page for Google users
- [x] Auto-fill from profile (all fields editable per session)
- [x] "Reset to my info" button
- [x] 6 front page templates with live preview
- [x] Course search + auto-fill teacher info
- [x] PDF export (jsPDF + html2canvas, A4)
- [x] DOCX export (docx.js, client-side)
- [x] Print button
- [x] Generation history (last 20)
- [x] Dark mode (entire app, preview stays white)
- [x] Admin panel: Courses CRUD, Teachers CRUD, Students list, Templates toggle
- [x] Settings: profile photo, password reset, delete account
- [x] Mobile responsive
- [x] Horizontal nav top bar — professional design

### Version 2.0 (planned)
- [ ] QR verification on PDF
- [ ] AI topic suggestion (Claude API)
- [ ] Digital teacher signature on PDF
- [ ] Watermark support
- [ ] Reuse previous history entry pre-fills generator

---

## 🛠 Tech Stack

| Layer        | Technology                  | Free Plan     |
|--------------|-----------------------------|---------------|
| Frontend     | React 18 + Tailwind CSS 3   | Unlimited     |
| Fonts        | Playfair Display + DM Sans  | Free (Google) |
| Database     | Supabase (PostgreSQL)        | 500 MB        |
| Auth         | Supabase Auth (Email + Google) | 50k MAU    |
| Storage      | Supabase Storage             | 1 GB          |
| PDF Export   | jsPDF + html2canvas          | Client-side   |
| DOCX Export  | docx.js                      | Client-side   |
| Deployment   | Vercel                       | Unlimited     |

---

*Built for KYAU CSE Department · PRD v3.0 · May 2026*
