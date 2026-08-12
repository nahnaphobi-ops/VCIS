# Victoria Crest International School

Single-page marketing site for Victoria Crest International School (Kumasi, Ghana).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Tailwind CSS · Framer Motion

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
