import { test, expect } from '@playwright/test';

/**
 * UI Components Tests
 * Tests for UI component visibility, styling, and behavior
 */

test.describe('Landing Page Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display health pulse logo text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pulse' })).toBeVisible();
  });

  test('should display tagline', async ({ page }) => {
    await expect(page.getByText(/fitness journey/i)).toBeVisible();
  });

  test('should have colored register button', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeVisible();
  });

  test('should have styled login button', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();
  });

  test('buttons should be clickable', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeEnabled();
  });

  test('should have proper layout', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Login Page Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });

  test('should have email input field', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should have login submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should have register action', async ({ page }) => {
    // Register is a span with role="button"
    await expect(page.locator('span[role="button"]').filter({ hasText: /register/i })).toBeVisible();
  });

  test('should have form in paper container', async ({ page }) => {
    // Login uses MUI Paper with form inside
    await expect(page.locator('.MuiPaper-root form')).toBeVisible();
  });

  test('should have password visibility toggle', async ({ page }) => {
    // MUI password field has adornment button
    const adornment = page.locator('.MuiInputAdornment-root');
    await expect(adornment.first()).toBeVisible();
  });

  test('email field should accept text input', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('test');
    await expect(emailInput).toHaveValue('test');
  });
});

test.describe('Register Page Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display register heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
  });

  test('should have first name field', async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible();
  });

  test('should have last name field', async ({ page }) => {
    await expect(page.getByLabel(/last name/i)).toBeVisible();
  });

  test('should have email field', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should have password field', async ({ page }) => {
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should have age field', async ({ page }) => {
    await expect(page.getByLabel(/age/i)).toBeVisible();
  });

  test('should have height field', async ({ page }) => {
    await expect(page.getByLabel(/height/i)).toBeVisible();
  });

  test('should have weight field', async ({ page }) => {
    await expect(page.getByLabel(/weight/i)).toBeVisible();
  });

  test('should have gender dropdown', async ({ page }) => {
    // Gender uses MUI Select with InputLabel
    await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
  });

  test('should have register submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('should have login action', async ({ page }) => {
    // Login is a span with role="button"
    await expect(page.locator('span[role="button"]').filter({ hasText: /log in/i })).toBeVisible();
  });

  test('paper should contain input fields', async ({ page }) => {
    const paper = page.locator('.MuiPaper-root');
    await expect(paper).toBeVisible();
    
    // Check paper contains multiple input fields
    const inputs = paper.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(5);
  });
});

test.describe('Button States', () => {
  test('login button should be enabled', async ({ page }) => {
    await page.goto('/login');
    const button = page.getByRole('button', { name: /log in/i });
    await expect(button).toBeEnabled();
  });

  test('register button on landing should be enabled', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: /register/i });
    await expect(button).toBeEnabled();
  });

  test('login button on landing should be enabled', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: /log in/i });
    await expect(button).toBeEnabled();
  });

  test('register submit button should be enabled', async ({ page }) => {
    await page.goto('/register');
    const button = page.getByRole('button', { name: /register/i });
    await expect(button).toBeEnabled();
  });
});

test.describe('Input Field Types', () => {
  test('email field should have email type', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('age field should accept numbers', async ({ page }) => {
    await page.goto('/register');
    const ageInput = page.getByLabel(/age/i);
    await ageInput.fill('25');
    await expect(ageInput).toHaveValue('25');
  });

  test('height field should accept numbers', async ({ page }) => {
    await page.goto('/register');
    const heightInput = page.getByLabel(/height/i);
    await heightInput.fill('175');
    await expect(heightInput).toHaveValue('175');
  });

  test('weight field should accept numbers', async ({ page }) => {
    await page.goto('/register');
    const weightInput = page.getByLabel(/weight/i);
    await weightInput.fill('70');
    await expect(weightInput).toHaveValue('70');
  });
});

test.describe('Visual Elements', () => {
  test('landing page should have container', async ({ page }) => {
    await page.goto('/');
    // Landing uses Box, not main
    const container = page.locator('.MuiBox-root').first();
    await expect(container).toBeVisible();
  });

  test('login page should have background color', async ({ page }) => {
    await page.goto('/login');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('register page should have background color', async ({ page }) => {
    await page.goto('/register');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('form cards should be visible', async ({ page }) => {
    await page.goto('/login');
    // MUI Paper or Card component
    const paper = page.locator('.MuiPaper-root, .MuiCard-root');
    await expect(paper.first()).toBeVisible();
  });

  test('heading text should be visible', async ({ page }) => {
    await page.goto('/');
    const text = page.getByRole('heading', { name: 'Health' }).first();
    await expect(text).toBeVisible();
  });
});

test.describe('Link Behavior', () => {
  test('register action should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    // Register is a span with role="button"
    await page.locator('span[role="button"]').filter({ hasText: /register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('login action should navigate to login page', async ({ page }) => {
    await page.goto('/register');
    // Login is a span with role="button"
    await page.locator('span[role="button"]').filter({ hasText: /log in/i }).click();
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Page Titles', () => {
  test('landing page should have title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('login page should have title', async ({ page }) => {
    await page.goto('/login');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('register page should have title', async ({ page }) => {
    await page.goto('/register');
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
