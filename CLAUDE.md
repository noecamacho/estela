# Estela — Project Conventions

## Overview

Estela is a personal therapy exercise journal. Users authenticate with Google and record private entries across three exercises stored in Firestore. The app is deployed to GitHub Pages as a public repo with private data.

**Stack:** Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + Firebase (Auth + Firestore)

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

## Formatting (Prettier)

- Single quotes, trailing commas, semicolons
- Print width: 80, tab width: 2 spaces
- Config: `.prettierrc`

## Linting (ESLint)

- Flat config format (`eslint.config.js`)
- Plugins: `typescript-eslint`, `react-hooks`, `react-refresh`
- Integrated with Prettier via `eslint-config-prettier`

## Components

- One component per file, named exports (`export function ComponentName`)
- No inline styles — use Tailwind CSS classes exclusively
- Colocate related logic (e.g. `ListSection` inside `DosBanderas.tsx` when only used there)

## State Management

- **Auth:** React Context (`AuthContext.tsx` with `useAuth` hook)
- **Data:** Local `useState` + `useEffect` with Firestore `onSnapshot` for real-time sync
- No external state management libraries — the app is small enough without them

## Firebase

- Modular SDK v10+ (tree-shakeable imports)
- Config via `import.meta.env.VITE_FIREBASE_*` environment variables
- Firestore data model: `users/{userId}/ejercicio{1,2,3}/{entryId}`
- Security rules: `request.auth.uid == userId` — owner-only access
- Never commit `.env.local` or actual Firebase config values

## Tailwind CSS

- Version 4 with CSS-based config (`@tailwindcss/vite` plugin)
- Dark warm theme with custom palette in `src/app.css` via `@theme {}`
- Custom colors: `--color-warm-100` through `--color-warm-900`, `--color-surface`
- Font: `font-serif` (Georgia, Times New Roman)
- Mobile-first responsive design

## Testing

- **Unit tests:** Vitest + React Testing Library (`src/__tests__/*.test.{ts,tsx}`)
- **E2E tests:** Playwright (`e2e/*.spec.ts`)
- Mock Firebase SDK in unit tests (never call real Firebase)
- Use `queueMicrotask` for async subscription callbacks in mocks
- Test setup: `src/__tests__/setup.ts` (jest-dom matchers + cleanup)

## Git Conventions

- **Conventional commits:** `feat:`, `fix:`, `chore:`, `test:`, `ci:`, `docs:`, `style:`
- **Atomic/modular commits** — one logical change per commit
- Pre-commit hooks via Husky + lint-staged enforce linting and formatting
- Never skip hooks (`--no-verify`)

## Versioning & Releases

- **Semantic Versioning** (semver.org)
- **Keep a Changelog** format in `CHANGELOG.md`
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security
- GitHub releases are created automatically on successful deploy to GitHub Pages
- Version comes from `package.json`, tag format: `v{version}`

## CI/CD

- **CI (`ci.yml`):** Runs on PRs — lint, format check, typecheck, unit tests, build
- **Deploy (`deploy.yml`):** Runs on main push — build, deploy to GitHub Pages, create release
- Firebase config injected via GitHub secrets
- SPA routing fix: `cp dist/index.html dist/404.html` in build script

## Scripts

```
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run format:check # Prettier check
npm run test         # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
```
