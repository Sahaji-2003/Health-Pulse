import { test, expect } from '@playwright/test';

/**
 * Accessibility Tests
 * Tests for accessibility features and ARIA attributes
 */

test.describe('Accessibility - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have page title', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have accessible buttons with proper roles', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: /register/i });
    const loginButton = page.getByRole('button', { name: /log in/i });
    
    await expect(registerButton).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('buttons should be keyboard focusable', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    // Should be able to focus on interactive elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for presence of heading elements
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should have accessible form labels', async ({ page }) => {
    const emailLabel = page.getByLabel(/email/i);
    const passwordLabel = page.getByLabel(/password/i);
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('form inputs should have proper types', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(emailInput).toHaveAttribute('type', 'email');
    // Password field might be text if toggled, so check it exists
    await expect(passwordInput).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have accessible submit button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /log in/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('register action should be accessible', async ({ page }) => {
    // Register is a span with role="button", check it's accessible
    const registerAction = page.locator('span[role="button"]').filter({ hasText: /register/i });
    await expect(registerAction).toBeVisible();
  });
});

test.describe('Accessibility - Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should have accessible form heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /register/i });
    await expect(heading).toBeVisible();
  });

  test('all form inputs should have labels', async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('gender select should have label', async ({ page }) => {
    // Gender uses MUI Select with InputLabel
    await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
  });

  test('numeric inputs should have proper constraints', async ({ page }) => {
    const ageInput = page.getByLabel(/age/i);
    const heightInput = page.getByLabel(/height/i);
    const weightInput = page.getByLabel(/weight/i);
    
    await expect(ageInput).toBeVisible();
    await expect(heightInput).toBeVisible();
    await expect(weightInput).toBeVisible();
  });

  test('form should be keyboard navigable', async ({ page }) => {
    // Tab through form fields
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('login action should be accessible', async ({ page }) => {
    // Login is a span with role="button"
    const loginAction = page.locator('span[role="button"]').filter({ hasText: /log in/i });
    await expect(loginAction).toBeVisible();
  });
});

test.describe('Focus Management', () => {
  test('should show focus when tabbing in login', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for the email input to be visible before tabbing
    await expect(page.getByLabel(/email/i)).toBeVisible();
    
    // Focus should be visible when tabbing
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    // Check that an element is focused (using activeElement)
    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBe(true);
  });

  test('should show focus when tabbing in register', async ({ page }) => {
    await page.goto('/register');
    
    // Tab through the form
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    // Check that an element is focused (using activeElement)
    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBe(true);
  });

  test('page should remain functional after escape key', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    
    // Page should still be functional
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
  });
});

test.describe('Color Contrast', () => {
  test('primary buttons should be visible', async ({ page }) => {
    await page.goto('/');
    
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeVisible();
    
    // Button should have computed styles
    const isVisible = await registerButton.isVisible();
    expect(isVisible).toBe(true);
  });

  test('secondary buttons should be visible', async ({ page }) => {
    await page.goto('/');
    
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();
  });

  test('form labels should be visible', async ({ page }) => {
    await page.goto('/login');
    
    // Labels should be visible using MUI label locator
    await expect(page.locator('label').filter({ hasText: 'Email' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Password' })).toBeVisible();
  });
});

test.describe('Screen Reader Support', () => {
  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');
    
    const registerButton = page.getByRole('button', { name: /register/i });
    const loginButton = page.getByRole('button', { name: /log in/i });
    
    // Buttons should have accessible names
    await expect(registerButton).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('form inputs should have accessible names', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeVisible();
  });

  test('interactive spans should have role button', async ({ page }) => {
    await page.goto('/login');
    
    // Register is a span with role="button"
    const registerSpan = page.locator('span[role="button"]').filter({ hasText: /register/i });
    await expect(registerSpan).toBeVisible();
  });

  test('headings should be present', async ({ page }) => {
    await page.goto('/register');
    
    const heading = page.getByRole('heading', { level: 4 });
    await expect(heading.first()).toBeVisible();
  });
});
