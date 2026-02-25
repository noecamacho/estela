import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Estela')).toBeVisible();
    await expect(page.getByText('Iniciar sesion con Google')).toBeVisible();
  });

  test('login page shows Google sign-in button', async ({ page }) => {
    await page.goto('/login');
    const button = page.getByText('Iniciar sesion con Google');
    await expect(button).toBeEnabled();
  });
});
