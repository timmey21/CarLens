# CarLens

An AI app where users photo or type in a sports car and get a full visual parts breakdown with pricing, sourcing, and common fault history.

## v1 scope

- Text search only (e.g. "2019 Porsche 911 GT3") — photo upload comes later.
- Hand-written demo dataset for a handful of sports cars, behind a single
  lookup function (`lib/getCarBreakdown.ts`) so live AI generation can be
  swapped in later without touching the UI.
- No accounts, no backend auth, no external deployment yet.

## Development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
