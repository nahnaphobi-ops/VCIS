# Website ↔ EduTrack public profile

## What the website reads
- School name, motto, address, phone, email, logo
- Current academic year/term + term dates + next term begins
- Upcoming public calendar events (`audience = all`)
- Notices marked `publish_to_website = true` (and `target_audience = all`)
- Fee templates / categories marked `is_public = true`
- Active student headcount (aggregate only — no student PII)

## EduTrack setup
1. Push migration: `supabase/migrations/20260820160000_website_public_publish_flags.sql`
2. Deploy function:
   ```bash
   npx supabase functions deploy public-school-profile --project-ref egdjzarvzzxafjdcemyy
   ```
3. Optional secrets / env for the function:
   - `PUBLIC_WEBSITE_SCHOOL_IDS=victoria-crest-international-school`
   - `PUBLIC_WEBSITE_ORIGINS=http://localhost:5173,https://vcis-alpha.vercel.app,https://vcis.edu.gh,https://www.vcis.edu.gh`

## Vercel (vcis-alpha.vercel.app)

Vite bakes `VITE_*` values in at **build** time. Add these on the Vercel project, then **Redeploy**:

- `VITE_EDUTRACK_FUNCTIONS_URL=https://egdjzarvzzxafjdcemyy.supabase.co/functions/v1`
- `VITE_EDUTRACK_ANON_KEY=<anon key>`
- `VITE_EDUTRACK_SCHOOL_ID=victoria-crest-international-school`

Without them, production skips EduTrack and only shows static fallbacks (localhost works because of `.env.local`).

After changing EduTrack CORS defaults, redeploy:

```bash
npx supabase functions deploy public-school-profile --project-ref egdjzarvzzxafjdcemyy
npx supabase functions deploy public-admissions-apply --project-ref egdjzarvzzxafjdcemyy
```

## Publish fees & notices in EduTrack
Until staff mark rows public, fees/notices arrays stay empty (safe default).
- Fees: set `fees.is_public = true` for templates that may appear on the site
- Fee categories: set `fee_categories.is_public = true`
- Notices: set `notices.publish_to_website = true` (audience must be `all`)

## Website admissions applications

### EduTrack
1. Push migration `20260820170000_website_admissions_intake.sql`
2. Deploy functions:
   ```bash
   npx supabase functions deploy public-school-profile --project-ref egdjzarvzzxafjdcemyy
   npx supabase functions deploy public-admissions-apply --project-ref egdjzarvzzxafjdcemyy
   ```
3. Open **Website Admissions** in the school admin sidebar to:
   - Review incoming applications (`pending` → contacted / interview / accepted / declined / enrolled)
   - Edit the public enrolment requirements checklist

### Website
- `/admissions` shows live requirements from EduTrack (with static fallback)
- Online form posts to `public-admissions-apply` and appears in the EduTrack inbox
- Does **not** auto-enroll students — staff review, then enroll from Students as usual

### Requirements data source
`enrollment_requirements` (public + active). Victoria Crest is seeded with common documents/fees/steps.
