# Crate — Testing Across the Stack

A small issue tracker, built specifically to carry a full automated test suite — Week 5 · Task A (Testing Across the Stack). The app itself is intentionally simple (create, list, delete one resource) so the tests are the actual deliverable, not buried under unrelated features.

**Live frontend:** https://azamagr.github.io/crate/ *(after deploy — see "Deploying" below)*
**Backend API:** deployed separately (Vercel/Render/Railway) — see "Deploying" below

This is a **three-part monorepo**:

```
crate/
├── backend/     # Express + MongoDB API, with a Jest + Supertest test suite
├── frontend/    # React + Vite UI, with a Vitest + React Testing Library suite
└── e2e/           # Playwright end-to-end tests against the real running app
```

## Test counts

| Layer | Tool | Test count | Covers |
|---|---|---|---|
| Backend | Jest + Supertest + mongodb-memory-server | **10** | Every endpoint, happy path + failure cases |
| Frontend | Vitest + React Testing Library | **12** | Component rendering, form validation, user interactions |
| E2E | Playwright | **2** | Full create → appear → delete user flow, plus a validation-blocks-submission case |

## Running the backend tests

```bash
cd backend
npm install
npm test
```

No `.env` or real database needed for tests. `mongodb-memory-server` downloads a small MongoDB binary the **first time you run tests** (a few seconds, one-time, needs internet) and then spins up a real, temporary, in-memory MongoDB instance per test run — the tests talk to an actual database, just not your real one. `backend/tests/setup.js` starts it before all tests and tears it down after; `afterEach` wipes all collections between tests so each test starts clean.

`backend/src/app.js` builds the Express app and exports it *without* connecting to a database or calling `.listen()` — only `backend/src/server.js` does that. This split is what makes the app testable with Supertest in the first place: tests import `app.js` directly and never touch the real network or a real port.

What's covered (`backend/tests/issues.test.js`):
- `GET /api/issues` — empty list initially, and returns created issues
- `POST /api/issues` — creates successfully (happy path), defaults priority to `medium`, rejects a missing title, rejects a too-short title, rejects an invalid priority value
- `DELETE /api/issues/:id` — deletes successfully (happy path), 404s on a valid-but-nonexistent id, 400s on a malformed id

## Running the frontend tests

```bash
cd frontend
npm install
npm test
```

Uses `jsdom` (no real browser needed) via Vitest's config in `frontend/vite.config.js`. `frontend/src/App.test.jsx` mocks the entire API module with `vi.mock()` so it tests real component behavior (loading → success/error states, retry) without needing a backend running at all.

What's covered:
- `IssueForm.test.jsx` (7 tests) — renders all fields, blocks submission with an empty or too-short title and shows the specific error, submits trimmed values when valid, clears itself after success, disables the button while submitting, shows a server-side error
- `IssueList.test.jsx` (3 tests) — renders one card per issue, shows the empty state with zero issues, calls the delete handler with the correct id
- `App.test.jsx` (2 tests) — shows a skeleton while loading then renders real fetched data, shows an error state with a working retry button

## Running the end-to-end test

This is the only layer that needs the real app running — it drives an actual browser against your actual frontend and backend.

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev

# terminal 3 (first time only)
cd e2e && npm install && npx playwright install chromium

# terminal 3
npm test
```

`e2e/tests/issue-flow.spec.js` opens the real app at `http://localhost:5173`, fills in and submits the form, confirms the new issue actually appears in the list (proving the frontend, the backend, and the database all worked together — not a mock), then deletes it and confirms it's gone. A second test confirms an empty-title submission is blocked client-side with a validation message and never reaches the network.

## Why this stack of tools

- **Jest + Supertest + mongodb-memory-server** (backend): the standard combination for testing an Express API against a *real* MongoDB without needing a real database connection, network access, or risk of touching production data. Fast, and every test starts from a clean slate.
- **Vitest + React Testing Library** (frontend): Vitest shares Vite's config and transform pipeline, so no separate build setup is needed alongside the app itself. React Testing Library tests components the way a user would interact with them (by label, role, and visible text) rather than by internal implementation details.
- **Playwright** (E2E): drives a real Chromium browser against the real running app — the only layer that can catch "the frontend and backend don't actually agree with each other," which unit and component tests, by design, can't.

## Running the app itself (not just the tests)

```bash
cd backend
npm install
cp .env.example .env   # fill in your own MONGO_URI
npm run dev              # http://localhost:5000
```

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev               # http://localhost:5173
```

## Deploying the backend

**Vercel** (files already included: `backend/api/index.js`, `backend/vercel.json`):
1. Push this repo to GitHub.
2. [vercel.com](https://vercel.com) → Add New → Project → import the repo.
3. Root Directory: `backend`.
4. Environment Variables: `MONGO_URI`.
5. Deploy.

**Render/Railway** also work: root directory `backend`, build command `npm install`, start command `npm start`, same environment variable.

## Deploying the frontend

1. Repo **Settings → Secrets and variables → Actions → Variables** → add `VITE_API_URL` set to your deployed backend URL.
2. Repo **Settings → Pages → Source** → select **"GitHub Actions"**.
3. Push to `main` — `.github/workflows/deploy.yml` builds `frontend/` with that API URL and publishes it.

`frontend/vite.config.js` sets `base: '/crate/'` to match this repo's name — **keep the repo name all-lowercase**.
