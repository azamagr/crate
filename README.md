# Checkpoint — Testing Across the Stack

A small, deliberately simple task checklist app, built for Week 5 · Task A (Testing Across the Stack). The app itself is intentionally minimal — the point of this task is the **test suite**, not new features.

**Live frontend:** https://azamagr.github.io/checkpoint/ *(after deploy — see below)*
**Backend API:** deployed separately (Vercel/Render/Railway) — see "Deploying the backend"

```
checkpoint/
├── backend/     # Express + MongoDB API, tested with Jest + Supertest
├── frontend/    # React + Vite UI, tested with Vitest + React Testing Library
├── e2e/         # Full user-flow tests, tested with Playwright
└── .github/workflows/
    ├── test.yml    # Runs backend + frontend tests on every push
    └── deploy.yml  # Runs frontend tests, then builds + deploys to GitHub Pages
```

## Running all the tests

### Backend — 9 tests (Jest + Supertest)

```bash
cd backend
npm install
npm test
```

No database or `.env` file needed to run these — see "Why the backend tests don't need a real database" below.

### Frontend — 9 tests (Vitest + React Testing Library)

```bash
cd frontend
npm install
npm test
```

### End-to-end — 2 tests (Playwright)

Needs both servers actually running, in two separate terminals:

```bash
# Terminal 1
cd backend && npm install && cp .env.example .env  # fill in MONGO_URI
npm run dev

# Terminal 2
cd frontend && npm install
npm run dev
```

Then, in a third terminal:

```bash
cd e2e
npm install
npx playwright install chromium   # one-time browser download
npm test
```

## What's tested

### Backend (`backend/tests/tasks.test.js`)

| Endpoint | Happy path | Failure case |
|---|---|---|
| `GET /api/tasks` | Returns the task list | Returns `[]` when there are none |
| `POST /api/tasks` | Creates a task, 201 | Empty title → 400 with a field message |
| `PUT /api/tasks/:id` | Updates a task, 200 | Unknown id → 404 |
| `DELETE /api/tasks/:id` | Deletes a task, 200 | Unknown id → 404 |
| *(any)* | — | Unknown route → 404 |

**9 tests total** — comfortably past the 5 required, covering every endpoint's happy path plus at least one failure mode each.

### Why the backend tests don't need a real database

`jest.mock("../src/models/Task")` replaces the Mongoose model with a plain mock before the app is even required. The tests exercise the real Express app — real routing, real controller logic, real status codes and validation-error formatting — but never touch MongoDB. That's a deliberate choice: these are tests of *the API layer*, and mocking the one external dependency (the database) means the whole suite runs in about two seconds, anywhere, with zero setup and zero flakiness from network/DB state. (An alternative would be `mongodb-memory-server` for true integration tests against a real in-memory Mongo instance — noted here as the next step if this suite grew, but overkill for this app's scope.)

### Frontend (`frontend/src/components/*.test.jsx`)

| Component | What's covered |
|---|---|
| `TaskForm` | Renders all fields · shows a field-specific error and blocks submission on an empty title · submits the trimmed title + selected priority and clears itself afterward |
| `TaskItem` | Renders title + priority badge · checkbox click calls `onToggle` with the task · delete click calls `onDelete` with the task id · completed tasks get strikethrough styling |
| `TaskList` | Shows the empty state with zero tasks · renders one row per task |

**9 tests total.** Every test that simulates a click or keystroke uses `@testing-library/user-event`, not `fireEvent`, because it dispatches the same sequence of real DOM events a browser would (focus, keydown, input, etc.) rather than a single synthetic event — closer to how an actual user interacts with the form.

### End-to-end (`e2e/tests/task-flow.spec.js`)

1. **Full CRUD flow**: type a task title → select a priority → click Add → **see it appear** in the list → check it off → **see it render as completed** → delete it → **see it disappear**. This is the "login → create item → see it appear" pattern the task description asks for, adapted to an app that doesn't have auth.
2. **Validation reaches all the way through**: submitting the form with an empty title shows the same inline error a unit test already checks — confirmed here in a real browser against the real running app, not just in isolation.

## CI

`.github/workflows/test.yml` runs the backend and frontend suites on every push and pull request to `main`. `.github/workflows/deploy.yml` also runs the frontend suite as a required step *before* building — a broken test blocks the deploy, not just the CI badge. (The e2e suite isn't wired into CI here, since it needs both a live backend and a live database; documented above for local/manual runs instead of adding the extra infrastructure — MongoDB service container, seeded data, etc. — that a real CI e2e setup would need.)

## Running the app itself (not just tests)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own MONGO_URI
npm run dev               # http://localhost:5000
```

### Frontend

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
3. Push to `main` — `.github/workflows/deploy.yml` runs the frontend tests, then builds and publishes `frontend/`.

`frontend/vite.config.js` sets `base: '/checkpoint/'` to match this repo's name — **keep the repo name all-lowercase**.
