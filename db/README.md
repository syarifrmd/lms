# Supabase Schema for LMS

This folder contains SQL to set up the LMS schema on Supabase.

## What it creates
- Enums: `role_type`, `course_status`, `badge_rank`, `enrollment_status`
- Tables: `profiles`, `courses`, `badges`, `modules`, `quizzes`, `questions`, `answers`, `enrollments`, `module_progress`, `certificates`
- FKs, indexes, and constraints
- Trigger `handle_new_user` to auto-create `profiles` on sign-up
- RLS policies for common access rules (admin/trainer/user)

## Apply on Supabase (SQL Editor)
1. Open your Supabase project → SQL Editor
2. Paste the contents of `db/supabase_schema.sql`
3. Execute the script

## Optional: Supabase CLI
If you use the CLI and a local `supabase` project, copy this file into your migrations and apply:

```bash
supabase db reset        # destructive; recreates local db
# or
supabase db push         # applies new migrations
```

## Notes
- `profiles.user_id` references `auth.users.id`. A trigger inserts a profile row for each new user.
- RLS is enabled on all tables. Admins (role `admin`) can access everything.
- Trainers can manage courses they created and all nested content under those courses.
- Users can see published courses and manage only their own enrollments/progress.