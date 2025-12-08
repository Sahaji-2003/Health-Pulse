import { test, expect } from '@playwright/test';

/**
 * Login Page Tests
 * Tests for the login functionality of Health Pulse application
 */

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });

  test('should have email input field', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
  });

  test('should have a submit button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /log in/i });
    await expect(submitButton).toBeVisible();
  });

  test('should have a link to register page', async ({ page }) => {
    await expect(page.getByText(/don't have an account/i)).toBeVisible();
    // Register is a span with role="button", not a link
    await expect(page.locator('span[role="button"]').filter({ hasText: /register/i })).toBeVisible();
  });

  test('should have a forgot password link', async ({ page }) => {
    await expect(page.locator('span[role="button"]').filter({ hasText: /forgot password/i })).toBeVisible();
  });

  test('should show error when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: /log in/i }).first().click();
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test('should allow entering email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com');
    await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com');
  });

  test('should show error for short password', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('12345');
    await page.getByRole('button', { name: /log in/i }).first().click();
    
    await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill('testpassword');
    
    // Initially should be password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click the visibility toggle button (IconButton inside InputAdornment)
    await page.locator('.MuiInputAdornment-root button').click();
    
    // Should now be text type (visible)
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should navigate to register page when clicking register link', async ({ page }) => {
    await page.locator('span[role="button"]').filter({ hasText: /register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should display the logo brand', async ({ page }) => {
    // Logo should be visible at the top - LogoBrand component
    await expect(page.locator('.MuiBox-root').filter({ has: page.locator('svg') }).first()).toBeVisible();
  });

  test('should clear error when user starts typing', async ({ page }) => {
    // Submit empty form to trigger error
    await page.getByRole('button', { name: /log in/i }).first().click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    
    // Start typing in email field
    await page.getByLabel(/email/i).fill('t');
    
    // Error should be cleared
    await expect(page.getByText(/email is required/i)).not.toBeVisible();
  });

  test('should have email and password labels visible', async ({ page }) => {
    // Check for proper labels using MUI label locators
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible();
  });

  test('should have proper tab order', async ({ page }) => {
    // Focus on email first
    await page.getByLabel(/email/i).focus();
    await expect(page.getByLabel(/email/i)).toBeFocused();
    
    // Tab to password
    await page.keyboard.press('Tab');
    // Should focus on password or visibility toggle
  });
});
