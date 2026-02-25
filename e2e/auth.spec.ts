import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * Tests the unauthenticated user experience:
 * - Login page rendering and content
 * - Route protection (redirect to /login)
 * - UI element visibility and interactivity
 *
 * Note: Google OAuth cannot be tested in E2E without service account.
 * These tests cover the pre-authentication state.
 *
 * Selectors used:
 * - [data-testid="login-page"]           Login page container
 * - [data-testid="login-title"]          "Estela" heading
 * - [data-testid="login-subtitle"]       "Diario de Proceso" subtitle
 * - [data-testid="login-sign-in-button"] Google sign-in button
 * - [data-testid="theme-toggle"]         Light/dark theme toggle
 * - [data-testid="language-toggle"]      ES/EN language toggle
 */
test.describe('Authentication — unauthenticated flow', () => {
  test('redirects to /login when accessing protected route', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders app branding', async ({ page }) => {
    await page.goto('./login');
    await expect(page.getByTestId('login-page')).toBeVisible();
    await expect(page.getByTestId('login-title')).toHaveText('Estela');
    await expect(page.getByTestId('login-subtitle')).toBeVisible();
  });

  test('Google sign-in button is visible and enabled', async ({ page }) => {
    await page.goto('./login');
    const btn = page.getByTestId('login-sign-in-button');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('login page displays theme and language toggles', async ({ page }) => {
    await page.goto('./login');
    await expect(page.getByTestId('theme-toggle')).toBeVisible();
    await expect(page.getByTestId('language-toggle')).toBeVisible();
  });
});
