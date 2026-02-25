# Estela — Project Conventions

## Overview

Estela is a personal therapy exercise journal. Users authenticate with Google and record private entries across three exercises stored in Firestore. The app is deployed to GitHub Pages as a public repo with private data.

**Stack:** Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + Firebase (Auth + Firestore)

**Live URL:** `https://noecamacho.github.io/estela/`

## Code Principles

- **KISS** — keep solutions simple; no over-engineering
- **DRY** — shared components for identical structures (e.g. `FreeformExercise` for exercises 2 and 3)
- **SOLID** — single responsibility per component/module
- **No deep nesting** — extract early returns, split components
- **Clean code** — descriptive names, small functions, no dead code

## TypeScript

- Strict mode enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- Never use `any` or `Function` type — use explicit types
- Use `interface` for object shapes, `type` for unions/intersections
- Named exports for components and hooks
- When mocking callbacks in tests, always use explicit types (e.g. `(entries: unknown[]) => void`), never `Function`

## Formatting (Prettier)

- Single quotes, trailing commas, semicolons
- Print width: 80, tab width: 2 spaces
- Config: `.prettierrc`

## Linting (ESLint)

- Flat config format (`eslint.config.js`)
- Plugins: `typescript-eslint`, `react-hooks`, `react-refresh`
- Integrated with Prettier via `eslint-config-prettier` — **must be last** in config array
- `react-refresh/only-export-components` requires eslint-disable comment when exporting both a component and a hook from the same file (e.g. `AuthContext.tsx`)

## Components

- One component per file, named exports (`export function ComponentName`)
- No inline styles — use Tailwind CSS classes exclusively
- Colocate related logic (e.g. `ListSection` inside `DosBanderas.tsx` when only used there)

## State Management

- **Auth:** React Context (`AuthContext.tsx` with `useAuth` hook)
- **Data:** Local `useState` + `useEffect` with Firestore `onSnapshot` for real-time sync
- No external state management libraries — the app is small enough without them
- Always return unsubscribe function from `onSnapshot` in `useEffect` cleanup

## Firebase

- Modular SDK v10+ (tree-shakeable imports from `firebase/*`, never `firebase/compat/*`)
- Config via `import.meta.env.VITE_FIREBASE_*` environment variables
- Firestore data model: `users/{userId}/ejercicio{1,2,3}/{entryId}`
- Security rules: `request.auth.uid == userId` — owner-only access
- Never commit `.env.local` or actual Firebase config values
- Firebase project: `estela-journal`
- Authorized domains: `localhost`, `estela-journal.firebaseapp.com`, `estela-journal.web.app`, `noecamacho.github.io`

### Firebase Programmatic Setup Notes

- Use `firebase-tools` CLI for project management and rule deployment
- Access tokens can be obtained from `~/.config/configstore/firebase-tools.json` refresh token
- Firestore API must be enabled via `serviceusage.googleapis.com` before creating database — wait 30-60s for propagation
- Firestore database creation: POST to `firestore.googleapis.com/v1/projects/{id}/databases`
- Authorized domains: PATCH to `identitytoolkit.googleapis.com/v2/projects/{id}/config`
- **Google Auth provider cannot be enabled programmatically** for personal (non-organization) GCP projects — must use Firebase Console

## Tailwind CSS

- Version 4 with CSS-based config (`@tailwindcss/vite` plugin)
- No `tailwind.config.js` — theme defined in `src/app.css` via `@theme {}`
- Semantic CSS token system via custom properties (`--c-bg`, `--c-fg`, `--c-border`, etc.)
- Light/dark theme: tokens swap between `:root` (light) and `:root.dark` (dark)
- Fonts: General Sans (UI), Georgia serif (journal content)
- Mobile-first responsive design

## Testing

- **Unit tests:** Vitest + React Testing Library (`src/__tests__/*.test.{ts,tsx}`)
- **E2E tests:** Playwright (`e2e/*.spec.ts`)
- Mock Firebase SDK in unit tests (never call real Firebase)
- **Critical:** Use `queueMicrotask` for async subscription callbacks in mocks — synchronous callbacks cause infinite re-render loops and OOM crashes
- **Critical:** Explicit `afterEach(cleanup)` in test setup — without this, DOM elements stack across tests
- Test setup: `src/__tests__/setup.ts` (jest-dom matchers + cleanup)
- Coverage via `@vitest/coverage-v8`

## Git Conventions

- **Conventional commits:** `feat:`, `fix:`, `chore:`, `test:`, `ci:`, `docs:`, `style:`
- **Atomic/modular commits** — one logical change per commit
- Pre-commit hooks via Husky + lint-staged enforce linting and formatting
- Never skip hooks (`--no-verify`)

## Versioning & Releases

- **Semantic Versioning** (semver.org)
- **Keep a Changelog** format in `CHANGELOG.md`
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security
- **Every PR must update `CHANGELOG.md`** — CI enforces this; add entries under `[Unreleased]`
- When releasing, move `[Unreleased]` entries to a new `[X.Y.Z] - YYYY-MM-DD` section and bump `package.json` version
- GitHub releases are created automatically on successful deploy to GitHub Pages
- Version comes from `package.json`, tag format: `v{version}`
- Release notes extracted from `CHANGELOG.md` matching `## [{version}]`, with commit-log fallback

## CI/CD

- **CI (`ci.yml`):** Runs on PRs — lint, format check, typecheck, unit tests, build, changelog check
- **Deploy (`deploy.yml`):** Runs on main push — build, deploy to GitHub Pages, create release
- Firebase config injected via GitHub secrets (6 `VITE_FIREBASE_*` secrets)
- SPA routing fix: `cp dist/index.html dist/404.html` in build script
- GitHub Pages must be enabled (`build_type=workflow`) BEFORE first deploy workflow runs
- `GITHUB_TOKEN` is auto-provided for release creation

## Build

- Vite `base` must match repo name: `base: '/estela/'`
- BrowserRouter `basename` must match: `basename="/estela"`
- Build script: `tsc -b && vite build && cp dist/index.html dist/404.html`
- The `404.html` copy is essential for SPA routing on GitHub Pages

## Project Structure

```
src/
  lib/          Firebase init (firebase.ts) + Firestore CRUD helpers (firestore.ts)
  context/      AuthContext (Google sign-in state + useAuth hook)
  components/   UI components (LoginPage, AppShell, ExerciseTabs, etc.)
  types/        TypeScript interfaces (DosBanderasEntry, FreeformEntry, etc.)
  __tests__/    Unit tests + setup
e2e/            Playwright E2E tests
.github/
  workflows/    CI (ci.yml) + Deploy (deploy.yml)
```

## Scripts

```
npm run dev          # Start dev server
npm run build        # Production build (includes SPA routing fix)
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier auto-format
npm run format:check # Prettier check
npm run test         # Unit tests (Vitest)
npm run test:watch   # Unit tests in watch mode
npm run test:coverage # Unit tests with coverage
npm run test:e2e     # E2E tests (Playwright)
```
