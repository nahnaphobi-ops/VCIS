# Victoria Crest International School

Marketing website for Victoria Crest International School (Kumasi, Ghana).

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` → `.env.local` for EduTrack and (optional) admin credentials.

## Build

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Tailwind CSS · Framer Motion · React Router

## Pages

`/` · `/about` · `/programmes` · `/admissions` · `/gallery` · `/contact` · `/admin`

## EduTrack

Public school data (calendar, notices, fees, enrolment requirements) and admissions
applications sync through EduTrack edge functions. See `EDUTRACK_INTEGRATION.md`.

## AI Chatbot

The floating assistant uses **OpenRouter free models** through the Convex HTTP
action at `/chat` (primary: `google/gemma-4-26b-a4b-it:free`, with free
Nemotron backups). Each reply is grounded in the EduTrack public school profile
(term dates, class levels, enrolment requirements, published fees/notices/events)
plus static school facts. It guides admissions and points families to
`/admissions` or WhatsApp/phone.

Set the key on the Convex deployment (never in frontend code or git):

```bash
npx convex env set OPENROUTER_API_KEY your_key_here --deployment loyal-woodpecker-470
npx convex dev --once
```

Optional Convex overrides: `OPENROUTER_MODEL`, `EDUTRACK_FUNCTIONS_URL`,
`EDUTRACK_ANON_KEY`, `EDUTRACK_SCHOOL_ID`.

The frontend prefers `VITE_CONVEX_SITE_URL` for HTTP actions (falls back to
`VITE_CONVEX_URL`).

## Admin Content Studio

The protected admin area is available at `/admin`. It uses Clerk for identity
and Convex for announcements, photo metadata, and image storage.

This project’s **live** Clerk instance uses a Frontend API **proxy** at `/__clerk`
(required because the custom FAPI host is not directly usable). Local Vite and
Vercel both proxy that path to Clerk.

1. Create a Clerk application and a JWT template named **`convex`** (required — not the default session token).
2. Set frontend env:
   - `VITE_CLERK_PUBLISHABLE_KEY` (live `pk_live_…`)
   - `VITE_CLERK_PROXY_URL=/__clerk`
   - `VITE_CONVEX_URL`
3. Set server env (Vercel + local `.env.local`, never commit secrets):
   - `CLERK_SECRET_KEY` (live `sk_live_…`)
   - `CLERK_PROXY_URL=https://vcis-alpha.vercel.app/__clerk`
4. Configure the Convex deployment:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://clerk.vcis-alpha.vercel.app
npx convex env set ADMIN_EMAILS admin@example.com
npx convex dev
```

Only email addresses listed in `ADMIN_EMAILS` can read or mutate admin content.
Uploads are validated server-side (images/PDF for announcements; images for gallery).
