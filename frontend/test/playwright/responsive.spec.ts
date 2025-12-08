import { test, expect } from '@playwright/test';

/**
 * Responsive Design Tests
 * Tests for responsive behavior across different viewport sizes
 */

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 },
};

test.describe('Responsive Design - Landing Page', () => {
  test('should render correctly on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pulse' })).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should render correctly on tablet', async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('should render correctly on desktop', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('should render correctly on large desktop', async ({ page }) => {
    await page.setViewportSize(viewports.largeDesktop);
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('buttons should be full width on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');
    
    const registerButton = page.getByRole('button', { name: /register/i });
    const buttonBox = await registerButton.boundingBox();
    
    // Button should take significant width on mobile
    expect(buttonBox?.width).toBeGreaterThan(200);
  });
});

test.describe('Responsive Design - Login Page', () => {
  test('should render login form on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should render login form on tablet', async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should render login form on desktop', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('login form should be visible on all viewports', async ({ page }) => {
    for (const [name, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport);
      await page.goto('/login');
      
      // Login uses MUI Paper, not a form tag
      const paper = page.locator('.MuiPaper-root');
      await expect(paper).toBeVisible();
    }
  });
});

test.describe('Responsive Design - Register Page', () => {
  test('should render register form on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
  });

  test('should render register form on tablet', async ({ page }) => {
    await page.setViewportSize(viewports.tablet);
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
  });

  test('should render register form on desktop', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
  });

  test('age field should be visible on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/register');
    
    // Both fields should be visible
    await expect(page.getByLabel(/age/i)).toBeVisible();
    // Gender uses MUI Select with InputLabel
    await expect(page.locator('label').filter({ hasText: 'Gender' })).toBeVisible();
  });

  test('height and weight should be visible on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/register');
    
    // Both fields should be visible
    await expect(page.getByLabel(/height/i)).toBeVisible();
    await expect(page.getByLabel(/weight/i)).toBeVisible();
  });
});

test.describe('Click Interactions on Mobile', () => {
  test('should navigate to register on mobile click', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');
    
    await page.getByRole('button', { name: /register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to login on mobile click', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/');
    
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should fill form on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('/login');
    
    await page.getByLabel(/email/i).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    
    await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com');
  });
});

test.describe('Viewport Orientation', () => {
  test('should handle landscape orientation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 }); // Landscape mobile
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('should handle landscape orientation on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 }); // Landscape tablet
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: 'Health' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });
});
