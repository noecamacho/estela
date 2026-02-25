import { test, expect } from '@playwright/test';

/**
 * Theme Toggle E2E Tests
 *
 * Tests the light/dark theme toggle functionality:
 * - Default theme (light)
 * - Theme toggle switches to dark mode
 * - Theme persists across page reloads (localStorage)
 *
 * Selectors used:
 * - [data-testid="theme-toggle"]   Theme toggle button
 * - html.dark                      Dark mode class on <html>
 */
test.describe('Theme toggle', () => {
  test('starts in light mode by default', async ({ page }) => {
    await page.goto('./login');
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('toggles to dark mode when clicked', async ({ page }) => {
    await page.goto('./login');
    await page.getByTestId('theme-toggle').click();
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('persists dark mode across reload', async ({ page }) => {
    await page.goto('./login');
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('toggles back to light mode', async ({ page }) => {
    await page.goto('./login');
    // Toggle to dark
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle back to light
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});
