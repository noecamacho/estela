# Estela

Personal therapy exercise journal — a private space to record, reflect, and grow.

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **Firebase** — Google Auth + Firestore
- **Vitest** + **React Testing Library** — unit tests
- **Playwright** — E2E tests
- **GitHub Actions** — CI/CD to GitHub Pages

## Getting Started

### Prerequisites

- Node.js 22+
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

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** > Google provider
3. Create a **Firestore** database in production mode
4. Register a web app and copy config to `.env.local`
5. Add your deployment domain to Authentication > Authorized domains
6. Deploy the security rules from `firestore.rules`

## Scripts

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start dev server          |
| `npm run build`         | Production build          |
| `npm run lint`          | Run ESLint                |
| `npm run format:check`  | Check Prettier formatting |
| `npm run typecheck`     | TypeScript type check     |
| `npm run test`          | Run unit tests            |
| `npm run test:coverage` | Unit tests with coverage  |
| `npm run test:e2e`      | Run Playwright E2E tests  |

## Architecture

```
src/
  lib/          Firebase init + Firestore CRUD helpers
  context/      AuthContext (Google sign-in state)
  components/   UI components
  types/        TypeScript interfaces
```

- **Firestore data** is scoped per user: `users/{userId}/ejercicio{1,2,3}/{entryId}`
- **Security rules** ensure users can only access their own data
- Exercises 2 and 3 share `FreeformExercise` component (DRY)

## License

Private use.
