# Service Request Management — Frontend

Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui

## Routes

| Route | Purpose |
|---|---|
| `/` | Request list with status filter (US-02) |
| `/requests/new` | Create-request form (US-01) |
| `/requests/[id]` | Request details — read-only (US-03, stretch) |

## Getting started

```bash
cp .env.example .env.local   # already done; edit if needed
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mock data

> **All data is mocked.** The backend does not exist yet.

`NEXT_PUBLIC_USE_MOCK=true` (set in `.env.local`) activates the mock client in
`src/lib/api.ts`. Data lives in `src/lib/mock-data.ts` and persists in memory
for the lifetime of the browser session.

### Testing the error state

Set `NEXT_PUBLIC_MOCK_ERROR=true` in `.env.local` to force every API call to
fail and see the error UI.

Alternatively, submit a create-request form with a title that **starts with
"error"** (case-insensitive) — only `createRequest` will throw.

### Switching to the real API (Day 07)

1. Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`.
2. Set `NEXT_PUBLIC_API_URL` to the backend base URL.
3. No component changes are needed.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (check only) |
| `npm test` | Placeholder — no tests yet |

## Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Shell and header
│   ├── page.tsx            # List page
│   ├── not-found.tsx       # 404
│   └── requests/
│       ├── new/page.tsx    # Create form
│       └── [id]/page.tsx   # Details (stretch)
├── components/
│   ├── ui/                 # shadcn/ui primitives (hand-written equivalent)
│   └── states/             # Loading, empty, error shared components
├── features/requests/      # All request-domain logic and components
└── lib/
    ├── api.ts              # Single API client (mock now, real on Day 07)
    ├── mock-data.ts        # Sample requests
    └── utils.ts            # cn() helper
```
