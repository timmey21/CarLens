# CarLens

An AI app where users photo or type in a sports car and get a full visual parts breakdown with pricing, sourcing, and common fault history.

## v1 scope

- Text search only (e.g. "2019 Porsche 911 GT3") — photo upload comes later.
- Hand-written demo dataset for a handful of sports cars, behind a single
  lookup function (`lib/getCarBreakdown.ts`).
- Any other recognized real US make/model (via a bundled NHTSA vehicle
  database) gets a live AI-generated breakdown from OpenAI, called through
  a server-side API route (`app/api/lookup/route.ts`) so the API key never
  reaches the browser.
- No accounts, no backend auth. Deployed on Vercel (needs the `OPENAI_API_KEY`
  environment variable set there).

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
