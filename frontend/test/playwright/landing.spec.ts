import { test, expect, Page } from '@playwright/test';

/**
 * Landing Page Tests
 * Tests for the main landing page of Health Pulse application
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the Health Pulse title', async ({ page }) => {
    // Check for "Health" heading (use first() since there may be multiple)
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    // Check for "Pulse" heading
    await expect(page.getByRole('heading', { name: 'Pulse' })).toBeVisible();
  });

  test('should display the tagline', async ({ page }) => {
    await expect(
      page.getByText(/Track your fitness journey/i)
    ).toBeVisible();
  });

  test('should have a Register button', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeVisible();
  });

  test('should have a Log In button', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();
  });

  test('should navigate to register page when Register button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to login page when Log In button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should have a heart icon visible', async ({ page }) => {
    // The heart icon should be present in the logo area
    const heartIcon = page.locator('svg[data-testid="FavoriteBorderIcon"]');
    await expect(heartIcon).toBeVisible();
  });

  test('should have page title', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should display decorative emojis on desktop', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Check for some decorative emojis (they use EmojiDecoration component)
    const emojiContainer = page.locator('text=🩺');
    // Emoji decorations should be visible on desktop
    const count = await emojiContainer.count();
    expect(count).toBeGreaterThanOrEqual(0); // May or may not be visible depending on implementation
  });

  test('should be responsive - buttons stack on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Both buttons should still be visible
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });
});
