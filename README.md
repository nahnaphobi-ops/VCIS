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

The floating admissions assistant uses DeepSeek through the Convex HTTP action
at `/chat`. Add `DEEPSEEK_API_KEY` to the Convex deployment environment:

```bash
npx convex env set DEEPSEEK_API_KEY your_key_here
npx convex deploy
```

The frontend uses the configured deployment URL by default. To override it,
set `VITE_CONVEX_URL` in a Vercel environment variable. Do not add the
DeepSeek key to frontend code or commit it to the repository.

## Admin Content Studio

The protected admin area is available at `/admin`. It uses Clerk for identity
and Convex for announcements, photo metadata, and image storage.

1. Create a Clerk application and a JWT template named **`convex`** (required — not the default session token).
2. Set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CONVEX_URL` in the frontend environment.
3. Configure the Convex deployment:

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://YOUR_CLERK_INSTANCE.clerk.accounts.dev
npx convex env set ADMIN_EMAILS admin@example.com
npx convex dev
```

Only email addresses listed in `ADMIN_EMAILS` can read or mutate admin content.
The server validates announcement text and restricts uploads to JPG, PNG, and
WebP files up to 5MB in the admin client before storing them in Convex storage.
