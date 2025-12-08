# Health Pulse - Test Runner Guide

This document provides comprehensive instructions for running tests in the Health Pulse frontend application.

## Overview

The Health Pulse frontend uses two testing frameworks:
- **Vitest**: Unit and integration testing
- **Playwright**: End-to-end (E2E) testing

---

## Vitest (Unit & Integration Tests)

### Location
All Vitest test files are located in `test/vitest/`:
```
test/vitest/
├── setup.ts           # Test configuration and mocks
├── helpers.test.ts    # Utility function tests (33 tests)
├── types.test.ts      # TypeScript type validation tests (19 tests)
├── api.test.ts        # API service tests (38 tests)
├── hooks.test.ts      # React hooks tests (32 tests)
└── integration.test.ts # Integration scenario tests (22 tests)
```

### Test Coverage
| Test File | Description | Test Count |
|-----------|-------------|------------|
| `helpers.test.ts` | Date formatting, BMI calculations, debounce/throttle, string utilities, storage helpers | 33 |
| `types.test.ts` | User, Auth, Fitness, Vitals, Reminder, Recommendation, Provider, Appointment, Dashboard types | 19 |
| `api.test.ts` | Auth, Fitness, Vitals, Reminders, Notifications, Community, Providers, Recommendations, User APIs | 38 |
| `hooks.test.ts` | Query key constants, widget metadata, data validation enums | 32 |
| `integration.test.ts` | Registration flow, vital signs, fitness goals, reminders, dashboard, notifications | 22 |

**Total: ~144 unit/integration tests**

### Running Vitest Tests

```bash
# Run all tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Vitest Configuration
Configuration is in `vitest.config.ts`:
- Environment: `jsdom`
- Setup file: `test/vitest/setup.ts`
- Globals: enabled
- Coverage: v8 reporter

---

## Playwright (E2E Tests)

### Location
All Playwright test files are located in `test/playwright/`:
```
test/playwright/
├── playwright.config.ts  # Playwright configuration
├── landing.spec.ts       # Landing page tests (~10 tests)
├── login.spec.ts         # Login page tests (~15 tests)
├── register.spec.ts      # Register page tests (~30 tests)
├── navigation.spec.ts    # Navigation & routing tests (~18 tests)
├── responsive.spec.ts    # Responsive design tests (~22 tests)
├── accessibility.spec.ts # Accessibility/ARIA tests (~33 tests)
├── forms.spec.ts         # Form interaction tests (~40 tests)
└── ui-components.spec.ts # UI component tests (~45 tests)
```

### Test Coverage
| Test File | Description | Test Count |
|-----------|-------------|------------|
| `landing.spec.ts` | Logo, tagline, buttons, navigation | ~10 |
| `login.spec.ts` | Form fields, validation, password toggle, links | ~15 |
| `register.spec.ts` | All 9 form fields, gender dropdown, validation | ~30 |
| `navigation.spec.ts` | Page routing, browser history, URL handling | ~18 |
| `responsive.spec.ts` | Mobile, tablet, desktop, landscape orientations | ~22 |
| `accessibility.spec.ts` | ARIA labels, keyboard navigation, focus management, screen reader support | ~33 |
| `forms.spec.ts` | Input typing, clearing, focus, dropdown interactions | ~40 |
| `ui-components.spec.ts` | Button states, input types, visual elements, links | ~45 |

**Total: ~193 E2E tests**

### Prerequisites

Before running Playwright tests, install the browser:

```bash
npx playwright install chromium
```

### Running Playwright Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with Playwright UI (interactive)
npm run test:e2e:ui

# Run with browser visible (headed mode)
npm run test:e2e:headed
```

### Playwright Configuration
Configuration is in `test/playwright/playwright.config.ts`:
- Browser: Chromium
- Base URL: `http://localhost:5173`
- Timeout: 30 seconds
- Retries: 0 (local), 2 (CI)
- Web Server: Auto-starts `npm run dev`

---

## Quick Reference

### All Test Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once (CI mode) |
| `npm run test:coverage` | Run Vitest with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests (headless) |
| `npm run test:e2e:ui` | Run Playwright with interactive UI |
| `npm run test:e2e:headed` | Run Playwright with browser visible |

### Test Statistics

| Framework | Test Count | Test Files |
|-----------|------------|------------|
| Vitest | ~144 | 5 |
| Playwright | ~193 | 8 |
| **Total** | **~337** | **13** |

---

## Continuous Integration

For CI/CD pipelines, use these commands:

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install chromium --with-deps

# Run unit tests
npm run test:run

# Run E2E tests
npm run test:e2e
```

---

## Troubleshooting

### Vitest Issues
- If tests fail with "matchMedia not found", ensure `test/vitest/setup.ts` is loaded
- If React Query tests fail, check that mocks are properly set up

### Playwright Issues
- If browser not found, run `npx playwright install chromium`
- If tests timeout, ensure dev server is running or let Playwright start it
- If tests fail on CI, increase timeout in `playwright.config.ts`

### Common Solutions
1. **Clear test cache**: Delete `node_modules/.vitest` or `node_modules/.cache`
2. **Reinstall dependencies**: `rm -rf node_modules && npm install`
3. **Update Playwright**: `npx playwright install`

---

## Adding New Tests

### Vitest
1. Create a new file in `test/vitest/` with `.test.ts` extension
2. Import from `vitest`: `import { describe, test, expect } from 'vitest'`
3. Follow existing patterns in other test files

### Playwright
1. Create a new file in `test/playwright/` with `.spec.ts` extension
2. Import from Playwright: `import { test, expect } from '@playwright/test'`
3. Follow existing patterns in other spec files

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
