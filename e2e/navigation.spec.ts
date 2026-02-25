import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 *
 * Tests SPA routing behavior:
 * - Unknown routes redirect to root (then to /login)
 * - Direct access to /login works
 * - 404.html SPA fallback works for deep routes
 *
 * Selectors used:
 * - [data-testid="login-page"]   Login page container
 * - [data-testid="login-title"]  "Estela" heading
 */
test.describe('Navigation — SPA routing', () => {
  test('unknown routes redirect to login', async ({ page }) => {
    await page.goto('./some/unknown/path');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-page')).toBeVisible();
  });

  test('direct access to /login renders correctly', async ({ page }) => {
    await page.goto('./login');
    await expect(page.getByTestId('login-title')).toHaveText('Estela');
  });

  test('page has correct document title', async ({ page }) => {
    await page.goto('./login');
    await expect(page).toHaveTitle(/Estela/);
  });
});
