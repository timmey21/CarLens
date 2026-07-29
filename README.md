# CarLens

An AI app where users photo or type in a sports car and get a full visual parts breakdown with pricing, sourcing, and common fault history.

## v1 scope

- Text search only (e.g. "2019 Porsche 911 GT3") — photo upload comes later.
- Hand-written demo dataset for a handful of sports cars, behind a single
  lookup function (`lib/getCarBreakdown.ts`) — always free, no account
  needed.
- Any other recognized real US make/model (via a bundled NHTSA vehicle
  database) gets a live AI-generated breakdown from OpenAI, called through
  a server-side API route (`app/api/lookup/route.ts`) so the API key never
  reaches the browser.
- Accounts (Supabase Auth) and a paid subscription (Stripe) gate the three
  AI-calling features (parts breakdown for non-demo cars, "Compare Prices",
  "How to Install") — demo cars' base breakdown stays free for everyone.
  Deployed on Vercel.

## Required environment variables (set in Vercel, not committed)

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`
- `NEXT_PUBLIC_SITE_URL`

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Local dev needs a `.env.local` with the
same variables above (gitignored) — placeholder values are enough to run
the app; real Supabase/Stripe values are only needed to test the actual
sign-up/subscription flow live.
