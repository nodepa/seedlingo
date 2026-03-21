import { test, expect } from '@playwright/test';

test.describe('Authentication redirect', () => {
  test('redirects unauthenticated users to the login page', async ({
    page,
  }) => {
    // Visit the home page without authentication
    await page.goto('/');
    // Verify redirect to /login
    await expect(page).toHaveURL(/login/);
  });

  test('serves the login page directly', async ({ page }) => {
    // Visit the login page directly
    await page.goto('/login');
    // Verify we are on the login page
    await expect(page).toHaveURL(/login/);
  });

  test('redirects any protected route to login when unauthenticated', async ({
    page,
  }) => {
    // Visit the words page without authentication
    await page.goto('/words');
    // Verify redirect to /login
    await expect(page).toHaveURL(/login/);
  });

  test('redirects the modules page to login when unauthenticated', async ({
    page,
  }) => {
    // Visit the modules page without authentication
    await page.goto('/modules');
    // Verify redirect to /login
    await expect(page).toHaveURL(/login/);
  });

  test('redirects the units page to login when unauthenticated', async ({
    page,
  }) => {
    // Visit the units page without authentication
    await page.goto('/units');
    // Verify redirect to /login
    await expect(page).toHaveURL(/login/);
  });
});
