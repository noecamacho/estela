import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// CI: serve pre-built dist (env vars baked in at build time)
// Local: use Vite dev server with HMR
const port = isCI ? 4173 : 5173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${port}/estela/`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: isCI ? 'npm run preview' : 'npm run dev',
    url: `http://localhost:${port}/estela/`,
    reuseExistingServer: !isCI,
  },
});
