-- Supabase LMS schema: enums, tables, FKs, indexes, triggers, RLS
-- Safe to run in Supabase SQL editor (public schema)

-- Extensions (commonly enabled by default on Supabase)
create extension if not exists pgcrypto;

-- ===============
-- Enums
-- ===============
do $$ begin
  create type role_type as enum ('admin','trainer','user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type course_status as enum ('draft','published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type badge_rank as enum ('bronze','silver','gold','legendary');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enrollment_status as enum ('enrolled','in_progress','completed');
exception when duplicate_object then null; end $$;

-- ===============
-- Helper functions
-- ===============
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p where p.user_id = uid and p.role = 'admin'
  );
$$;

create or replace function public.is_trainer(uid uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p where p.user_id = uid and p.role in ('trainer','admin')
  );
$$;

-- =================
-- Tables
-- =================

-- 1) PROFILES (link to auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role role_type not null default 'user',
  employee_id text unique,
  created_at timestamptz not null default now()
);

-- 2) COURSES
create table if not exists public.courses (
  course_id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  created_by uuid not null references public.profiles(user_id) on delete restrict,
  status course_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at before update on public.courses
for each row execute function public.set_updated_at();

-- 3) BADGES
create table if not exists public.badges (
  badge_id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  rank badge_rank not null,
  criteria_min integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4) MODULES
create table if not exists public.modules (
  module_id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(course_id) on delete cascade,
  title text not null,
  video_url text,
  doc_url text,
  order_sequence integer not null check (order_sequence > 0),
  created_at timestamptz not null default now(),
  unique(course_id, order_sequence)
);

-- 5) QUIZZES
create table if not exists public.quizzes (
  quiz_id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(module_id) on delete cascade,
  title text not null,
  min_score integer not null default 0 check (min_score between 0 and 100),
  passing_time integer, -- minutes
  limit_attempts integer,
  created_at timestamptz not null default now()
);

-- 6) QUESTIONS
create table if not exists public.questions (
  question_id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(quiz_id) on delete cascade,
  question_text text not null,
  explanation text
);

-- 7) ANSWERS
create table if not exists public.answers (
  answer_id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(question_id) on delete cascade,
  answer_text text not null,
  is_correct boolean not null default false
);

-- 8) ENROLLMENTS
create table if not exists public.enrollments (
  enrollment_id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  course_id uuid not null references public.courses(course_id) on delete cascade,
  status enrollment_status not null default 'enrolled',
  progress_percentage numeric(5,2) not null default 0 check (progress_percentage between 0 and 100),
  created_at timestamptz not null default now(),
  unique(user_id, course_id)
);

-- 9) MODULE_PROGRESS
create table if not exists public.module_progress (
  progress_id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(enrollment_id) on delete cascade,
  module_id uuid not null references public.modules(module_id) on delete cascade,
  is_video_watched boolean not null default false,
  is_quiz_passed boolean not null default false,
  highest_quiz_score integer not null default 0 check (highest_quiz_score between 0 and 100),
  updated_at timestamptz not null default now(),
  unique(enrollment_id, module_id)
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists trg_module_progress_updated_at on public.module_progress;
create trigger trg_module_progress_updated_at before update on public.module_progress
for each row execute function public.touch_updated_at();

-- 10) CERTIFICATES
create table if not exists public.certificates (
  certificate_id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(enrollment_id) on delete cascade,
  certificate_code text not null unique,
  file_url text,
  issued_at timestamptz not null default now(),
  unique(enrollment_id)
);

-- ===============
-- Helpful indexes
-- ===============
create index if not exists idx_courses_created_by on public.courses(created_by);
create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_modules_course on public.modules(course_id);
create index if not exists idx_quizzes_module on public.quizzes(module_id);
create index if not exists idx_questions_quiz on public.questions(quiz_id);
create index if not exists idx_answers_question on public.answers(question_id);
create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);
create index if not exists idx_progress_enrollment on public.module_progress(enrollment_id);
create index if not exists idx_progress_module on public.module_progress(module_id);

-- ========================
-- Trigger: auto-create profile from auth.users
-- ========================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ========================
-- Row Level Security (RLS)
-- ========================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.badges enable row level security;
alter table public.modules enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.enrollments enable row level security;
alter table public.module_progress enable row level security;
alter table public.certificates enable row level security;

-- PROFILES policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- allow inserts only for service role; skip explicit insert policy

-- COURSES policies
drop policy if exists courses_read_all_published on public.courses;
create policy courses_read_all_published on public.courses
  for select using (
    status = 'published'::course_status
    or created_by = auth.uid()
    or public.is_admin()
  );

drop policy if exists courses_insert_creator on public.courses;
create policy courses_insert_creator on public.courses
  for insert to authenticated
  with check (
    public.is_trainer() and created_by = auth.uid()
  );

drop policy if exists courses_update_owner_or_admin on public.courses;
create policy courses_update_owner_or_admin on public.courses
  for update using (created_by = auth.uid() or public.is_admin())
  with check (created_by = auth.uid() or public.is_admin());

drop policy if exists courses_delete_owner_or_admin on public.courses;
create policy courses_delete_owner_or_admin on public.courses
  for delete using (created_by = auth.uid() or public.is_admin());

-- MODULES policies (respect course ownership)
drop policy if exists modules_select_published_or_owner on public.modules;
create policy modules_select_published_or_owner on public.modules
  for select using (
    exists (
      select 1 from public.courses c
      where c.course_id = modules.course_id
        and (c.status = 'published' or c.created_by = auth.uid() or public.is_admin())
    )
  );

drop policy if exists modules_cud_owner_or_admin on public.modules;
create policy modules_cud_owner_or_admin on public.modules
  for all using (
    exists (
      select 1 from public.courses c
      where c.course_id = modules.course_id and (c.created_by = auth.uid() or public.is_admin())
    )
  ) with check (
    exists (
      select 1 from public.courses c
      where c.course_id = modules.course_id and (c.created_by = auth.uid() or public.is_admin())
    )
  );

-- QUIZZES
drop policy if exists quizzes_select_published_or_owner on public.quizzes;
create policy quizzes_select_published_or_owner on public.quizzes
  for select using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.course_id = m.course_id
      where m.module_id = quizzes.module_id and (c.status = 'published' or c.created_by = auth.uid() or public.is_admin())
    )
  );

drop policy if exists quizzes_cud_owner_or_admin on public.quizzes;
create policy quizzes_cud_owner_or_admin on public.quizzes
  for all using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.course_id = m.course_id
      where m.module_id = quizzes.module_id and (c.created_by = auth.uid() or public.is_admin())
    )
  ) with check (
    exists (
      select 1 from public.modules m
      join public.courses c on c.course_id = m.course_id
      where m.module_id = quizzes.module_id and (c.created_by = auth.uid() or public.is_admin())
    )
  );

-- QUESTIONS
drop policy if exists questions_select_published_or_owner on public.questions;
create policy questions_select_published_or_owner on public.questions
  for select using (
    exists (
      select 1 from public.quizzes q
      join public.modules m on m.module_id = q.module_id
      join public.courses c on c.course_id = m.course_id
      where q.quiz_id = questions.quiz_id and (c.status = 'published' or c.created_by = auth.uid() or public.is_admin())
    )
  );

drop policy if exists questions_cud_owner_or_admin on public.questions;
create policy questions_cud_owner_or_admin on public.questions
  for all using (
    exists (
      select 1 from public.quizzes q
      join public.modules m on m.module_id = q.module_id
      join public.courses c on c.course_id = m.course_id
      where q.quiz_id = questions.quiz_id and (c.created_by = auth.uid() or public.is_admin())
    )
  ) with check (
    exists (
      select 1 from public.quizzes q
      join public.modules m on m.module_id = q.module_id
      join public.courses c on c.course_id = m.course_id
      where q.quiz_id = questions.quiz_id and (c.created_by = auth.uid() or public.is_admin())
    )
  );

-- ANSWERS
drop policy if exists answers_select_published_or_owner on public.answers;
create policy answers_select_published_or_owner on public.answers
  for select using (
    exists (
      select 1 from public.questions qs
      join public.quizzes q on q.quiz_id = qs.quiz_id
      join public.modules m on m.module_id = q.module_id
      join public.courses c on c.course_id = m.course_id
      where qs.question_id = answers.question_id and (c.status = 'published' or c.created_by = auth.uid() or public.is_admin())
    )
  );

drop policy if exists answers_cud_owner_or_admin on public.answers;
create policy answers_cud_owner_or_admin on public.answers
  for all using (
    exists (
      select 1 from public.questions qs
      join public.quizzes q on q.quiz_id = qs.quiz_id
      join public.modules m on m.module_id = q.module_id
      join public.courses c on c.course_id = m.course_id
      where qs.question_id = answers.question_id and (c.created_by = auth.uid() or public.is_admin())
    )
  ) with check (
    exists (
      select 1 from public.questions qs
      join public.quizzes q on q.quiz_id = qs.quiz_id
      join public.modules m on m.module_id = q.module_id
      join public.courses c on c.course_id = m.course_id
      where qs.question_id = answers.question_id and (c.created_by = auth.uid() or public.is_admin())
    )
  );

-- ENROLLMENTS
drop policy if exists enrollments_select_owner_admin_trainer on public.enrollments;
create policy enrollments_select_owner_admin_trainer on public.enrollments
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.courses c
      where c.course_id = enrollments.course_id and c.created_by = auth.uid()
    )
  );

drop policy if exists enrollments_insert_self_published on public.enrollments;
create policy enrollments_insert_self_published on public.enrollments
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.courses c where c.course_id = enrollments.course_id and c.status = 'published'
    )
  );

drop policy if exists enrollments_update_owner_or_staff on public.enrollments;
create policy enrollments_update_owner_or_staff on public.enrollments
  for update using (
    user_id = auth.uid() or public.is_admin() or exists (
      select 1 from public.courses c where c.course_id = enrollments.course_id and c.created_by = auth.uid()
    )
  ) with check (
    user_id = auth.uid() or public.is_admin() or exists (
      select 1 from public.courses c where c.course_id = enrollments.course_id and c.created_by = auth.uid()
    )
  );

-- MODULE_PROGRESS
drop policy if exists progress_select_owner_or_staff on public.module_progress;
create policy progress_select_owner_or_staff on public.module_progress
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.enrollment_id = module_progress.enrollment_id
        and (e.user_id = auth.uid() or public.is_admin() or exists (
          select 1 from public.courses c where c.course_id = e.course_id and c.created_by = auth.uid()
        ))
    )
  );

drop policy if exists progress_cud_owner on public.module_progress;
create policy progress_cud_owner on public.module_progress
  for all using (
    exists (
      select 1 from public.enrollments e
      where e.enrollment_id = module_progress.enrollment_id and e.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.enrollments e
      where e.enrollment_id = module_progress.enrollment_id and e.user_id = auth.uid()
    )
  );

-- CERTIFICATES
drop policy if exists certificates_select_owner_or_staff on public.certificates;
create policy certificates_select_owner_or_staff on public.certificates
  for select using (
    exists (
      select 1 from public.enrollments e
      where e.enrollment_id = certificates.enrollment_id
        and (e.user_id = auth.uid() or public.is_admin() or exists (
          select 1 from public.courses c where c.course_id = e.course_id and c.created_by = auth.uid()
        ))
    )
  );

drop policy if exists certificates_cud_admin_only on public.certificates;
create policy certificates_cud_admin_only on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());

-- ========================
-- Optional utility view: public courses listing
-- ========================
create or replace view public.public_courses as
  select course_id, title, description, category, created_by, status, created_at, updated_at
  from public.courses where status = 'published';

-- ========================
-- Done
-- ========================
