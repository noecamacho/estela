# Estela

Personal therapy exercise journal — a private space to record, reflect, and grow.

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite** — build tool
- **Tailwind CSS v4** — styling (CSS-based config, no `tailwind.config.js`)
- **Firebase** — Google Auth + Firestore
- **Vitest** + **React Testing Library** — unit tests
- **Playwright** — E2E tests
- **ESLint** + **Prettier** — linting + formatting
- **Husky** + **lint-staged** — pre-commit hooks
- **GitHub Actions** — CI/CD to GitHub Pages with auto-releases

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- GitHub CLI (`gh`) logged in
- A Firebase project with Auth (Google provider) and Firestore enabled

### Setup

```bash
git clone https://github.com/noecamacho/estela.git
cd estela
npm install
cp .env.example .env.local
# Fill in your Firebase config values in .env.local
npm run dev
```

### Firebase Setup

#### Quick Setup (CLI)

If you have `firebase-tools` installed and a project already created:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project <project-id>
```

#### Full Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** > Google provider (set support email)
3. Create a **Firestore** database in production mode
4. Register a web app and copy the config object
5. Create `.env.local` from `.env.example` and fill in config values
6. Add your deployment domain to Authentication > Settings > Authorized domains:
   - `localhost` (local dev)
   - `<your-username>.github.io` (GitHub Pages)
7. Deploy the security rules: `firebase deploy --only firestore:rules`

#### Programmatic Setup (via REST API)

Most Firebase setup can be automated with the CLI and REST APIs:

```bash
# Create project + web app
firebase projects:create <project-id> --display-name "<Name>"
firebase apps:create web "<App Name>" --project <project-id>
firebase apps:sdkconfig web <app-id> --project <project-id>

# Enable Firestore API (wait 30-60s after for propagation)
# Create Firestore database
# Add authorized domains
# Deploy security rules
firebase deploy --only firestore:rules --project <project-id>

# Set GitHub secrets for CI/CD
gh secret set VITE_FIREBASE_API_KEY -b "<value>"
gh secret set VITE_FIREBASE_AUTH_DOMAIN -b "<value>"
gh secret set VITE_FIREBASE_PROJECT_ID -b "<value>"
gh secret set VITE_FIREBASE_STORAGE_BUCKET -b "<value>"
gh secret set VITE_FIREBASE_MESSAGING_SENDER_ID -b "<value>"
gh secret set VITE_FIREBASE_APP_ID -b "<value>"
```

**Note**: Enabling Google Auth provider requires the Firebase Console (one manual step) — the Google Cloud API blocks programmatic OAuth consent screen creation for personal (non-organization) projects.

### GitHub Secrets

The CI/CD pipeline requires these repository secrets (Settings > Secrets > Actions):

| Secret                              | Value                              |
| ----------------------------------- | ---------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase API key                   |
| `VITE_FIREBASE_AUTH_DOMAIN`         | `<project-id>.firebaseapp.com`     |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID                |
| `VITE_FIREBASE_STORAGE_BUCKET`      | `<project-id>.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID       |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID                    |

`GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Scripts

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start dev server (localhost:5173)  |
| `npm run build`         | Production build + SPA routing fix |
| `npm run preview`       | Preview production build locally   |
| `npm run typecheck`     | TypeScript type check              |
| `npm run lint`          | Run ESLint                         |
| `npm run lint:fix`      | Auto-fix ESLint issues             |
| `npm run format`        | Auto-format with Prettier          |
| `npm run format:check`  | Check Prettier formatting          |
| `npm run test`          | Run unit tests (Vitest)            |
| `npm run test:watch`    | Unit tests in watch mode           |
| `npm run test:coverage` | Unit tests with coverage           |
| `npm run test:e2e`      | Run Playwright E2E tests           |

## Architecture

```
src/
  lib/          Firebase init + Firestore CRUD helpers
  context/      AuthContext (Google sign-in state)
  components/   UI components
  types/        TypeScript interfaces
  __tests__/    Unit tests (Vitest + React Testing Library)
e2e/            E2E tests (Playwright)
```

### Data Model

Firestore collections scoped per user:

```
users/{userId}/
  ejercicio1/{entryId}    # Dos Banderas — structured (estrellas, madeja, aprendizaje)
  ejercicio2/{entryId}    # Mi Mama — freeform (titulo, contenido)
  ejercicio3/{entryId}    # El Hombre Ideal — freeform (titulo, contenido)
```

### Key Patterns

- **Security rules** enforce owner-only access: `request.auth.uid == userId`
- **Real-time sync** via Firestore `onSnapshot` subscriptions with `useEffect` cleanup
- **DRY**: Exercises 2 and 3 share `FreeformExercise` component
- **SPA routing fix**: Build copies `index.html` to `404.html` for GitHub Pages
- **Modular Firebase SDK**: Tree-shakeable imports from `firebase/*` (never `firebase/compat/*`)

### CI/CD Pipeline

```
PR to main  ──>  CI: lint + format + typecheck + test + build
Push to main ──>  Deploy: build + GitHub Pages + auto-release
```

- **CI** validates every PR before merge
- **Deploy** builds with Firebase secrets, deploys to GitHub Pages
- **Release** auto-creates a GitHub release from `CHANGELOG.md` + `package.json` version

## Known Gotchas

| Issue                                           | Fix                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| GitHub Pages 404 on direct navigation           | `cp dist/index.html dist/404.html` in build script                                                |
| Assets load from wrong path on GH Pages         | Set `base: '/estela/'` in `vite.config.ts`                                                        |
| ESLint + Prettier conflicts                     | `eslint-config-prettier` must be LAST in ESLint config                                            |
| Test DOM elements stack across tests            | Explicit `afterEach(cleanup)` in test setup                                                       |
| OOM crash in tests with Firestore mocks         | Use `queueMicrotask` for async callbacks (never sync)                                             |
| `Function` type in test mocks                   | Use explicit callback types like `(entries: unknown[]) => void`                                   |
| `useAuth` export triggers react-refresh warning | Add `eslint-disable-next-line` comment                                                            |
| Deploy fails with "Not Found"                   | Enable GitHub Pages (`gh api repos/.../pages -X POST -f build_type=workflow`) BEFORE first deploy |
| Firestore API "not enabled" after enabling      | Wait 30-60 seconds for API propagation                                                            |
| Google Auth can't be enabled via CLI            | Enable manually in Firebase Console (personal projects)                                           |

## License

Private use.
