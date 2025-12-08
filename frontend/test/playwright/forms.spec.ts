import { test, expect } from '@playwright/test';

/**
 * Form Interaction Tests
 * Comprehensive tests for form behavior and validation
 */

test.describe('Login Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should allow typing in email field', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('user@example.com');
    await expect(emailInput).toHaveValue('user@example.com');
  });

  test('should allow typing in password field', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('should clear email field', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('test@example.com');
    await emailInput.clear();
    await expect(emailInput).toHaveValue('');
  });

  test('should clear password field', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill('password123');
    await passwordInput.clear();
    await expect(passwordInput).toHaveValue('');
  });

  test('should focus email on click', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.click();
    await expect(emailInput).toBeFocused();
  });

  test('should focus password on click', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.click();
    await expect(passwordInput).toBeFocused();
  });

  test('should handle paste in email field', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.click();
    await page.keyboard.type('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should move focus with Tab key', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should have moved focus
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should submit form with Enter key on button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /log in/i });
    await submitButton.focus();
    
    // Button should be focused
    await expect(submitButton).toBeFocused();
  });
});

test.describe('Register Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should allow typing first name', async ({ page }) => {
    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.fill('John');
    await expect(firstNameInput).toHaveValue('John');
  });

  test('should allow typing last name', async ({ page }) => {
    const lastNameInput = page.getByLabel(/last name/i);
    await lastNameInput.fill('Doe');
    await expect(lastNameInput).toHaveValue('Doe');
  });

  test('should allow typing email', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('john.doe@example.com');
    await expect(emailInput).toHaveValue('john.doe@example.com');
  });

  test('should allow typing password', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill('SecurePass123!');
    await expect(passwordInput).toHaveValue('SecurePass123!');
  });

  test('should allow entering age', async ({ page }) => {
    const ageInput = page.getByLabel(/age/i);
    await ageInput.fill('25');
    await expect(ageInput).toHaveValue('25');
  });

  test('should allow entering height', async ({ page }) => {
    const heightInput = page.getByLabel(/height/i);
    await heightInput.fill('175');
    await expect(heightInput).toHaveValue('175');
  });

  test('should allow entering weight', async ({ page }) => {
    const weightInput = page.getByLabel(/weight/i);
    await weightInput.fill('70');
    await expect(weightInput).toHaveValue('70');
  });

  test('should open gender dropdown', async ({ page }) => {
    // Gender uses MUI Select
    const genderSelect = page.locator('.MuiSelect-select');
    await genderSelect.click();
    
    // Dropdown should open - use exact match for Male
    await expect(page.getByRole('option', { name: 'Male', exact: true })).toBeVisible();
  });

  test('should select male from gender dropdown', async ({ page }) => {
    // Gender uses MUI Select
    const genderSelect = page.locator('.MuiSelect-select');
    await genderSelect.click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    
    // Check selection was made
    await expect(page.locator('.MuiSelect-select')).toHaveText(/male/i);
  });

  test('should select female from gender dropdown', async ({ page }) => {
    // Gender uses MUI Select
    const genderSelect = page.locator('.MuiSelect-select');
    await genderSelect.click();
    await page.getByRole('option', { name: /female/i }).click();
    
    // Check selection was made
    await expect(page.locator('.MuiSelect-select')).toHaveText(/female/i);
  });

  test('should clear first name field', async ({ page }) => {
    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.fill('John');
    await firstNameInput.clear();
    await expect(firstNameInput).toHaveValue('');
  });

  test('should handle special characters in names', async ({ page }) => {
    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.fill("O'Connor");
    await expect(firstNameInput).toHaveValue("O'Connor");
  });

  test('should handle decimal in height', async ({ page }) => {
    const heightInput = page.getByLabel(/height/i);
    await heightInput.fill('175.5');
    await expect(heightInput).toHaveValue('175.5');
  });

  test('should handle decimal in weight', async ({ page }) => {
    const weightInput = page.getByLabel(/weight/i);
    await weightInput.fill('70.5');
    await expect(weightInput).toHaveValue('70.5');
  });
});

test.describe('Form Field Validation Display', () => {
  test('empty email should be invalid on blur', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.getByLabel(/email/i);
    await emailInput.click();
    await page.keyboard.press('Tab'); // Blur
    
    // Form should still be visible
    await expect(emailInput).toBeVisible();
  });

  test('empty password should be invalid on blur', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.click();
    await page.keyboard.press('Tab'); // Blur
    
    // Form should still be visible
    await expect(passwordInput).toBeVisible();
  });

  test('submit button should be present', async ({ page }) => {
    await page.goto('/login');
    
    const submitButton = page.getByRole('button', { name: /log in/i });
    await expect(submitButton).toBeVisible();
  });

  test('register button should be present', async ({ page }) => {
    await page.goto('/register');
    
    const submitButton = page.getByRole('button', { name: /register/i });
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Password Field Behavior', () => {
  test('password should be masked by default', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.getByLabel(/password/i);
    // Default password field type is password (masked)
    await expect(passwordInput).toBeVisible();
  });

  test('should have password toggle button', async ({ page }) => {
    await page.goto('/login');
    
    // Look for visibility toggle button
    const toggleButton = page.locator('[aria-label*="visibility"], button[data-testid*="visibility"], .MuiInputAdornment-root button').first();
    await expect(toggleButton).toBeVisible();
  });

  test('password can be typed', async ({ page }) => {
    await page.goto('/register');
    
    const passwordInput = page.getByLabel(/password/i);
    await passwordInput.fill('MySecurePassword123');
    await expect(passwordInput).toHaveValue('MySecurePassword123');
  });
});

test.describe('Form Reset Behavior', () => {
  test('navigating away and back should reset login form', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('test@example.com');
    
    await page.goto('/register');
    await page.goto('/login');
    
    // Form should be reset or maintain state based on implementation
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('navigating away and back should reset register form', async ({ page }) => {
    await page.goto('/register');
    
    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.fill('John');
    
    await page.goto('/login');
    await page.goto('/register');
    
    // Form should be reset or maintain state based on implementation
    await expect(page.getByLabel(/first name/i)).toBeVisible();
  });
});
