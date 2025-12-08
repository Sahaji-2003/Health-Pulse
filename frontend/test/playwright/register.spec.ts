import { test, expect } from '@playwright/test';

/**
 * Register Page Tests
 * Tests for the registration functionality of Health Pulse application
 */

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display the register form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
  });

  test('should have first name input field', async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible();
  });

  test('should have last name input field', async ({ page }) => {
    await expect(page.getByLabel(/last name/i)).toBeVisible();
  });

  test('should have email input field', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should have age input field', async ({ page }) => {
    await expect(page.getByLabel(/age/i)).toBeVisible();
  });

  test('should have gender select field', async ({ page }) => {
    // Gender field uses MUI Select with InputLabel
    await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
  });

  test('should have height input field', async ({ page }) => {
    await expect(page.getByLabel(/height/i)).toBeVisible();
  });

  test('should have weight input field', async ({ page }) => {
    await expect(page.getByLabel(/weight/i)).toBeVisible();
  });

  test('should have medical conditions field', async ({ page }) => {
    await expect(page.getByLabel(/medical conditions/i)).toBeVisible();
  });

  test('should have a register button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /register/i }).first()).toBeVisible();
  });

  test('should have a link to login page', async ({ page }) => {
    await expect(page.getByText(/already have an account/i)).toBeVisible();
  });

  test('should show error when first name is empty', async ({ page }) => {
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /register/i }).first().click();
    
    await expect(page.getByText(/first name is required/i)).toBeVisible();
  });

  test('should show error when last name is empty', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /register/i }).first().click();
    
    await expect(page.getByText(/last name is required/i)).toBeVisible();
  });

  test('should show error when email is invalid', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /register/i }).first().click();
    
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('1234567');
    await page.getByRole('button', { name: /register/i }).first().click();
    
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
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

  test('should navigate to login page when clicking login link', async ({ page }) => {
    // Login is a span with role="button"
    await page.locator('span[role="button"]').filter({ hasText: /log in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should display helper text for age field', async ({ page }) => {
    await expect(page.getByText(/must be between 1 and 120/i)).toBeVisible();
  });

  test('should display helper text for height field', async ({ page }) => {
    await expect(page.getByText(/height in cm/i)).toBeVisible();
  });

  test('should display helper text for weight field', async ({ page }) => {
    await expect(page.getByText(/weight in kg/i)).toBeVisible();
  });

  test('should display helper text for gender field', async ({ page }) => {
    await expect(page.getByText(/male, female, other/i)).toBeVisible();
  });

  test('should allow selecting gender from dropdown', async ({ page }) => {
    // Click on the Select component to open dropdown
    await page.locator('.MuiSelect-select').click();
    
    // Gender options should be visible in the dropdown menu - use exact match
    await expect(page.getByRole('option', { name: 'Male', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Female', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Other', exact: true })).toBeVisible();
  });

  test('should select male gender', async ({ page }) => {
    // Click on the Select component to open dropdown
    await page.locator('.MuiSelect-select').click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    
    // Dropdown should now show Male
    await expect(page.locator('.MuiSelect-select')).toHaveText(/male/i);
  });

  test('should allow entering numeric age', async ({ page }) => {
    const ageInput = page.getByLabel(/age/i);
    await ageInput.fill('25');
    await expect(ageInput).toHaveValue('25');
  });

  test('should allow entering numeric height', async ({ page }) => {
    const heightInput = page.getByLabel(/height/i);
    await heightInput.fill('175');
    await expect(heightInput).toHaveValue('175');
  });

  test('should allow entering numeric weight', async ({ page }) => {
    const weightInput = page.getByLabel(/weight/i);
    await weightInput.fill('70');
    await expect(weightInput).toHaveValue('70');
  });

  test('should allow multiline text in medical conditions', async ({ page }) => {
    const medicalInput = page.getByLabel(/medical conditions/i);
    await medicalInput.fill('Allergies\nAsthma');
    await expect(medicalInput).toHaveValue('Allergies\nAsthma');
  });

  test('should display logo brand at top', async ({ page }) => {
    // LogoBrand component should be visible
    await expect(page.locator('.MuiBox-root').first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/register');
    
    // Form should still be visible
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i }).first()).toBeVisible();
  });
});
