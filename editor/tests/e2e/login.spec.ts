import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    // Visit the login page
    await page.goto('/login');
  });

  test('renders the Seedlingo Apiary heading', async ({ page }) => {
    // Verify the page title heading is present
    await expect(page.getByText('Seedlingo Apiary')).toBeVisible();
  });

  test('renders a link to seedlingo.com', async ({ page }) => {
    // Verify the Seedlingo link is present
    await expect(page.getByText('Content editor for Seedlingo')).toBeVisible();
  });

  test('renders the Toggle Dark Mode button', async ({ page }) => {
    // Verify the dark mode toggle button is present
    await expect(page.getByText('Toggle Dark Mode')).toBeVisible();
  });

  test('renders the Amplify Authenticator sign-in form', async ({ page }) => {
    // Verify the sign-in form is rendered
    await expect(page.locator('[data-amplify-authenticator]')).toBeAttached();
  });
});
