import { test, expect } from '@playwright/test';

/**
 * Language Toggle E2E Tests
 *
 * Tests the bilingual (ES/EN) language toggle:
 * - Default language is Spanish
 * - Toggle switches all UI text to English
 * - Language persists across page reloads (localStorage)
 *
 * Selectors used:
 * - [data-testid="language-toggle"]      Language toggle button (shows "EN" or "ES")
 * - [data-testid="login-sign-in-button"] Sign-in button text changes per language
 * - [data-testid="login-subtitle"]       Subtitle changes per language
 */
test.describe('Language toggle', () => {
  test('defaults to Spanish', async ({ page }) => {
    await page.goto('./login');
    const toggle = page.getByTestId('language-toggle');
    // When in Spanish, toggle shows "EN" (to switch to English)
    await expect(toggle).toHaveText('EN');
    await expect(page.getByTestId('login-sign-in-button')).toContainText(
      'Iniciar sesion con Google',
    );
  });

  test('switches to English when clicked', async ({ page }) => {
    await page.goto('./login');
    await page.getByTestId('language-toggle').click();
    // After clicking, toggle shows "ES" (to switch back to Spanish)
    await expect(page.getByTestId('language-toggle')).toHaveText('ES');
    await expect(page.getByTestId('login-sign-in-button')).toContainText(
      'Sign in with Google',
    );
  });

  test('persists language across reload', async ({ page }) => {
    await page.goto('./login');
    await page.getByTestId('language-toggle').click();
    await expect(page.getByTestId('language-toggle')).toHaveText('ES');

    await page.reload();
    await expect(page.getByTestId('language-toggle')).toHaveText('ES');
    await expect(page.getByTestId('login-sign-in-button')).toContainText(
      'Sign in with Google',
    );
  });

  test('switches back to Spanish', async ({ page }) => {
    await page.goto('./login');
    // To English
    await page.getByTestId('language-toggle').click();
    await expect(page.getByTestId('language-toggle')).toHaveText('ES');

    // Back to Spanish
    await page.getByTestId('language-toggle').click();
    await expect(page.getByTestId('language-toggle')).toHaveText('EN');
    await expect(page.getByTestId('login-sign-in-button')).toContainText(
      'Iniciar sesion con Google',
    );
  });
});
