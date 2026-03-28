import { test, expect } from '@playwright/test';

/**
 * E2E tests for the unit detail page (/units/[id]).
 *
 * The exercise preview panel lives on this page. These tests cover the
 * unauthenticated behaviour (auth guard redirect) and verify that the correct
 * static structure is rendered on the login page that the user is redirected to
 * — confirming the full navigation flow a real user experiences before logging
 * in.
 *
 * Testing the authenticated exercise panel is not feasible in e2e without live
 * AWS credentials; that behaviour is covered by the unit tests in
 * tests/unit/pages/exercise-completion.test.ts and
 * tests/unit/utils/EditorAudioProvider.test.ts.
 */

test.describe('Unit detail page — unauthenticated', () => {
  test('redirects /units/[id] to login when unauthenticated', async ({
    page,
  }) => {
    await page.goto('/units/fake-unit-id');
    await expect(page).toHaveURL(/login/, { timeout: 10_000 });
  });

  test('redirects a realistic UUID unit path to login', async ({ page }) => {
    await page.goto('/units/550e8400-e29b-41d4-a716-446655440000');
    await expect(page).toHaveURL(/login/, { timeout: 10_000 });
  });

  test('login page shown after redirect still renders the Amplify sign-in form', async ({
    page,
  }) => {
    await page.goto('/units/fake-unit-id');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('[data-amplify-authenticator]')).toBeAttached();
  });

  test('login page shown after redirect still renders the Seedlingo Apiary heading', async ({
    page,
  }) => {
    await page.goto('/units/fake-unit-id');
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('Seedlingo Apiary')).toBeVisible();
  });
});
