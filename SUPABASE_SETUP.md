# Supabase and Vercel setup

## 1. Run the SQL schema

1. Open the Supabase project dashboard.
2. Go to **SQL Editor**.
3. Create a new query.
4. Copy the complete contents of [`supabase/schema.sql`](supabase/schema.sql) into the editor.
5. Click **Run**.

The script creates only the first student-dashboard data model:

- Auth-linked profiles
- Student profiles
- Student applications and approval status
- Academic years and grade sections
- Student enrollments
- Published announcements

It does not create student IDs, payments, parents, library, dormitory, or meal records.

The starter rows create academic year `2026/2027` and Sections A–F for Grades 9–12. Change or remove those seed rows if the school calendar is different.

## 2. Disable email confirmation for this first test

The current registration form uses the student’s full name to derive an internal synthetic Auth email because the requested public form does not collect email. For this local test:

1. Open **Authentication → Providers → Email** in Supabase.
2. Turn off **Confirm email**.
3. Save the setting.

This lets registration create an authenticated session immediately. The generated internal email is not shown to the student. Full-name login is acceptable for the first test, but duplicate names will need a future username or phone-login change.

## 3. Local environment variables

The repository uses `.env.local`, which is ignored by Git. It contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Never put a `service_role` key in `.env.local`, browser code, GitHub, or Vercel client-side variables.

Start the app locally with:

```bash
npm run dev
```

Then open the local URL shown by Next.js. Register a student using the current form. The application is saved as `pending`.

## 4. Approve the test student for dashboard testing

After registering, open **Table Editor → profiles** and change that student’s `account_status` from `pending` to `active`. Then open **student_applications** and change that student’s `status` from `pending` to `approved`.

Or run this SQL after replacing the name:

```sql
update public.profiles
set account_status = 'active'
where full_name = 'YOUR TEST STUDENT FULL NAME';

update public.student_applications
set status = 'approved', reviewed_at = now()
where full_name = 'YOUR TEST STUDENT FULL NAME';
```

The student can then log out and log in again. The app redirects to `/student/dashboard`.

## 5. Vercel environment variables

In Vercel:

1. Open the project.
2. Go to **Settings → Environment Variables**.
3. Add both variables below for **Production**, **Preview**, and **Development**:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Use the same Supabase project URL and publishable key as the local `.env.local` file. Save the variables, then redeploy the project. A redeploy is required because Next.js reads `NEXT_PUBLIC_*` variables during the build.

Also add the Vercel site URL in Supabase under **Authentication → URL Configuration**:

- Site URL: your production Vercel URL
- Redirect URLs: your production URL and local development URL if needed

The current flow uses client-side `router.push`, so no email redirect is required while email confirmation is disabled.

## Current pages

- `/` — landing page with registration and login
- `/student/dashboard` — protected student dashboard and pending-approval state
- `/student/profile` — post-approval profile completion form
