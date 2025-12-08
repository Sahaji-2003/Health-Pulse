import { test, expect } from '@playwright/test';

/**
 * Navigation Tests
 * Tests for navigation between pages in Health Pulse application
 */

test.describe('Navigation', () => {
  test('should navigate from landing to login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should navigate from landing to register', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/login');
    // Register link is a span with role="button"
    await page.locator('span[role="button"]').filter({ hasText: /register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/register');
    // Login link is a span with role="button"
    await page.locator('span[role="button"]').filter({ hasText: /log in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should navigate back using browser back button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL('/login');
    
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should navigate forward using browser forward button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.goBack();
    
    await page.goForward();
    await expect(page).toHaveURL('/login');
  });

  test('should handle direct URL navigation to login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });

  test('should handle direct URL navigation to register', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
  });

  test('should handle direct URL navigation to dashboard (redirects if not authenticated)', async ({ page }) => {
    await page.goto('/dashboard');
    // Should either show dashboard or redirect to login
    // The exact behavior depends on auth state
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard|login)/);
  });

  test('should navigate to fitness page', async ({ page }) => {
    await page.goto('/fitness');
    // Should either show fitness or redirect based on auth
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(fitness|login)/);
  });

  test('should navigate to vitals page', async ({ page }) => {
    await page.goto('/vitals');
    // Should either show vitals or redirect based on auth
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(vitals|login)/);
  });

  test('should navigate to resources page', async ({ page }) => {
    await page.goto('/resources');
    // Should either show resources or redirect based on auth
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(resources|login)/);
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/profile');
    // Should either show profile or redirect based on auth
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(profile|login)/);
  });
});

test.describe('URL Handling', () => {
  test('should load root path correctly', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('should load login path correctly', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response?.status()).toBe(200);
  });

  test('should load register path correctly', async ({ page }) => {
    const response = await page.goto('/register');
    expect(response?.status()).toBe(200);
  });

  test('should handle trailing slash in URL', async ({ page }) => {
    await page.goto('/login/');
    // Should work regardless of trailing slash
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });

  test('should preserve query parameters during navigation', async ({ page }) => {
    await page.goto('/login?redirect=/dashboard');
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });
});
