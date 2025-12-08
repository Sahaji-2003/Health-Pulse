# Health Pulse - Frontend Development Instructions

## Project Overview

Health Pulse is a cutting-edge web application for fitness tracking, vital signs monitoring, and personalized health recommendations. This document provides comprehensive guidelines for frontend development following atomic design principles and modern React best practices.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Material UI 3
- **State Management**: TanStack Query (React Query)
- **Design System**: Atomic Design Pattern
- **UI Library**: Material UI (Primary) + Custom Components (Secondary)

## Folder Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── atoms/           # Smallest UI elements
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── Typography/
│   │   │   ├── Icon/
│   │   │   ├── EmojiDecoration/
│   │   │   ├── Input/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   └── Chip/
│   │   ├── molecules/       # Groups of atoms
│   │   │   ├── LogoBrand/
│   │   │   ├── SearchBar/
│   │   │   ├── FormField/
│   │   │   ├── Card/
│   │   │   ├── NavigationItem/
│   │   │   ├── MetricCard/
│   │   │   └── AlertBanner/
│   │   └── organisms/       # Complex UI sections
│   │       ├── Header/
│   │       ├── Sidebar/
│   │       ├── DataTable/
│   │       ├── Dashboard/
│   │       ├── UserProfile/
│   │       └── ActivityForm/
│   └── layout/
│       ├── AppLayout/
│       ├── AuthLayout/
│       └── DashboardLayout/
├── pages/
│   ├── auth/                # Authentication-related pages
│   │   ├── Landing.tsx      # Main landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   ├── ForgotPassword.tsx
│   │   └── index.ts
│   ├── dashboard/           # Authenticated user pages
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Profile.tsx      # User profile
│   │   ├── Fitness.tsx      # Fitness tracking
│   │   ├── Vitals.tsx       # Vital signs
│   │   ├── Resources.tsx    # Health resources
│   │   └── index.ts
│   └── index.ts             # Main page exports
├── hooks/
├── services/
├── types/
├── utils/
└── styles/
```

## Page Organization

### Auth Pages (`src/pages/auth/`)
Pages for unauthenticated users:
- **Landing.tsx**: Main entry point with branding and auth navigation
- **Login.tsx**: User login form
- **Register.tsx**: New user registration
- **ForgotPassword.tsx**: Password recovery

### Dashboard Pages (`src/pages/dashboard/`)
Pages for authenticated users:
- **Dashboard.tsx**: Main dashboard with health overview
- **Profile.tsx**: User profile management
- **Fitness.tsx**: Fitness tracking and activities
- **Vitals.tsx**: Vital signs monitoring
- **Resources.tsx**: Health resources and articles

## Dashboard Layout, Sidebar & Header

This project uses a shared layout for all authenticated pages. The layout is implemented by `DashboardLayout` and composes the `Sidebar` and `PageHeader` organisms. Keep these guidelines in mind when building or updating dashboard pages.

- **`DashboardLayout` (layout)**: Provides the overall two-column layout with the app `Sidebar` and main content area. Use it to wrap dashboard pages so navigation, responsive mobile behavior, and bottom navigation are consistent across pages.
- **`Sidebar` (organism)**: Primary navigation on the left. It is controlled by the `DashboardLayout` and will open/close automatically on mobile via the header menu button. Keep sidebar items as `NavigationItem` molecules and avoid embedding page content inside the sidebar.
- **`PageHeader` (organism)**: Reusable header used by all dashboard pages. It shows the page `title`, optional `subtitle` (e.g. a `Chip`), right-side `actions` (buttons, menus), and an optional notification badge. On mobile the header will optionally render a menu button to toggle the sidebar.

Usage example (page):
```
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';

export const Fitness = () => {
  return (
    <DashboardLayout
      title="Fitness Activity"
      headerSubtitle={<Chip label="Weekly" size="small" />}
      headerActions={<Button variant="outlined">Export</Button>}
      showNotification={true}
      notificationCount={3}
      onNotificationClick={() => console.log('open notifications')}
    >
      {/* page content */}
    </DashboardLayout>
  );
};
```

Best practices:
- Use `DashboardLayout` on all pages under `src/pages/dashboard/` to keep navigation consistent.
- Keep the `Sidebar` limited to navigation items only; complex page controls belong in `PageHeader` or page content.
- Pass small, focused React nodes to `headerSubtitle` and `headerActions` rather than full complex trees.

Styling recommendation — use MUI `sx`:

The project prefers Material UI primitives and the `sx` prop for styling instead of inserting custom CSS. The `sx` prop is lightweight, responsive, and theme-aware. For examples and details see:

- `sx` prop docs: https://mui.com/material-ui/customization/the-sx-prop/
- MUI System: https://mui.com/material-ui/system/getting-started/

Keep styles inside components using `sx` or theme overrides — avoid global custom CSS rules that conflict with MUI theming.


### Page Component Rules
1. **NEVER write raw UI code directly in pages** - always use atoms, molecules, and organisms
2. **Pages should only compose components** - no styled-components or raw MUI in pages
3. **Import from component index files** - use barrel exports
4. **Pages handle routing and data fetching** - UI logic stays in components

## Atomic Design Principles

### CRITICAL: Component Usage in Pages
**Pages should NEVER contain raw UI code.** Always follow this hierarchy:

```typescript
// ❌ WRONG - Raw UI code in page
export const Landing = () => {
  return (
    <Box sx={{ backgroundColor: '#f4fbf8' }}>
      <Typography sx={{ fontSize: '57px' }}>Health Pulse</Typography>
      <Button variant="contained">Register</Button>
    </Box>
  );
};

// ✅ CORRECT - Page composed of atoms, molecules, organisms
import { Button, EmojiDecoration } from '../../components/ui/atoms';
import { LogoBrand } from '../../components/ui/molecules';

export const Landing = () => {
  return (
    <LandingContainer>
      <EmojiDecoration emoji="🩺" size="large" top="20%" left="12%" />
      <LogoBrand size="large" showTagline />
      <ButtonContainer>
        <Button variant="primary" size="large">Register</Button>
        <Button variant="outlined" size="large">Log In</Button>
      </ButtonContainer>
    </LandingContainer>
  );
};
```

### Atoms
- **Purpose**: Smallest, indivisible UI elements
- **Examples**: Buttons, inputs, icons, labels, badges, Typography, EmojiDecoration
- **Location**: `src/components/ui/atoms/`
- **Requirements**:
  - Must include all possible variants
  - Use Material UI components as base
  - Extend with styled-components
  - Include proper TypeScript interfaces (`.types.ts` file)
  - Support theming and accessibility
  - Export via barrel file (`index.ts`)

### Molecules
- **Purpose**: Groups of atoms functioning together
- **Examples**: LogoBrand, search bars, form fields, cards, navigation items
- **Location**: `src/components/ui/molecules/`
- **Requirements**:
  - Combine 2-5 atoms maximum
  - Maintain single responsibility
  - Reusable across different contexts
  - Include proper prop validation

### Organisms
- **Purpose**: Complex UI sections with specific functionality
- **Examples**: Headers, sidebars, forms, data tables
- **Location**: `src/components/ui/organisms/`
- **Requirements**:
  - Combine atoms and molecules
  - Handle business logic
  - Connect to state management
  - Include error boundaries

## Material UI Guidelines

### Primary Usage
- **Always prefer Material UI components** over custom implementations
- Use MUI components for:
  - Buttons, inputs, selects, checkboxes
  - Navigation (AppBar, Drawer, Tabs)
  - Data display (Tables, Lists, Cards)
  - Feedback (Alerts, Snackbars, Progress)
  - Layout (Grid, Stack, Container)

### Customization Approach
```typescript
// 1. Extend MUI components with styled-components or sx prop
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(MuiButton)(({ theme }) => ({
  // Custom styles here
}));

// 2. Use Tailwind for spacing and utilities only
<MuiButton className="ml-4 mt-2" sx={{ customProperty: 'value' }}>
  Click me
</MuiButton>
```

### Theme Configuration
```typescript
// src/theme/index.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      // Define all variants
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    // Define typography variants
  },
  components: {
    // Override component defaults
  },
});
```

## Component Development Standards

### Button Component Example
```typescript
// src/components/ui/atoms/Button/Button.types.ts
import { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

// src/components/ui/atoms/Button/Button.tsx
import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'start',
  children,
  disabled,
  ...props
}) => {
  const getMuiVariant = () => {
    switch (variant) {
      case 'primary': return 'contained';
      case 'secondary': return 'contained';
      case 'outlined': return 'outlined';
      case 'text': return 'text';
      case 'danger': return 'contained';
      default: return 'contained';
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'danger': return 'error';
      case 'secondary': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      color={getColor()}
      size={size}
      disabled={disabled || loading}
      startIcon={iconPosition === 'start' && !loading ? icon : undefined}
      endIcon={iconPosition === 'end' && !loading ? icon : undefined}
      {...props}
    >
      {loading && (
        <CircularProgress size={16} className="mr-2" />
      )}
      {children}
    </MuiButton>
  );
};
```

## TanStack Query Implementation

### Setup
```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Hooks Pattern
```typescript
// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth.api';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'currentUser'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};
```

## Responsive Design (CRITICAL)

### Mobile-First Approach
All components and pages MUST be responsive and work on mobile, tablet, and desktop views.

### MUI Breakpoints
```typescript
// Theme breakpoints (default MUI values)
// xs: 0px      - Extra small (mobile portrait)
// sm: 600px    - Small (mobile landscape / small tablet)
// md: 900px    - Medium (tablet)
// lg: 1200px   - Large (desktop)
// xl: 1536px   - Extra large (large desktop)
```

### Using Responsive Hooks
```typescript
import { useMediaQuery, useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box>
      {isMobile ? <MobileView /> : <DesktopView />}
    </Box>
  );
};
```

### Responsive Styled Components
```typescript
const ResponsiveContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));
```

### Responsive Props in MUI
```typescript
// Use responsive object syntax
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 2, md: 4 },
    px: { xs: 2, sm: 3, md: 4 },
  }}
>
  <Button fullWidth={isMobile}>Submit</Button>
</Box>
```

### Responsive Design Checklist
- [ ] Test on mobile (320px - 480px)
- [ ] Test on tablet (481px - 768px)
- [ ] Test on desktop (769px+)
- [ ] Buttons should be full-width on mobile
- [ ] Hide non-essential decorative elements on mobile
- [ ] Adjust typography sizes for smaller screens
- [ ] Ensure touch targets are at least 44x44px on mobile
- [ ] Stack horizontal layouts vertically on mobile

## Tailwind CSS Guidelines

### Usage Priority
1. **Material UI**: Primary for components
2. **Tailwind**: Secondary for spacing, layout, utilities
3. **Custom CSS**: Last resort only

### Recommended Tailwind Usage
```typescript
// ✅ Good - Use for spacing and layout
<div className="flex items-center justify-between p-4 mb-6">
  <MuiButton>Click me</MuiButton>
</div>

// ✅ Good - Use for responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Avoid - Don't recreate MUI components
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
```

### Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  important: '#root', // Ensure Tailwind overrides MUI when needed
  theme: {
    extend: {
      colors: {
        // Extend with custom colors that complement MUI theme
      },
    },
  },
  plugins: [],
};
```

## Component Reusability Strategy

### Before Creating New Components

1. **Check Atoms**: Look for existing basic components
2. **Check Molecules**: Look for similar component combinations
3. **Check Organisms**: Look for complex sections that can be reused
4. **Check Material UI**: Verify if MUI has a suitable component

### Component Discovery Process
```typescript
// Create a component registry for easy discovery
// src/components/index.ts
export { Button } from './ui/atoms/Button';
export { Input } from './ui/atoms/Input';
export { SearchBar } from './ui/molecules/SearchBar';
export { Header } from './ui/organisms/Header';

// Use barrel exports for easy imports
import { Button, Input, SearchBar } from '@/components';
```

### Variant Management
```typescript
// Always include comprehensive variants
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger' | 'success';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state: 'default' | 'loading' | 'disabled' | 'success' | 'error';
}
```

## Development Workflow

## Skeleton Components

### Purpose
Create skeleton loading states for all components and pages to provide immediate visual feedback while content loads.

### Implementation Strategy
```typescript
// src/components/ui/atoms/Skeleton/Skeleton.tsx
import { Skeleton as MuiSkeleton } from '@mui/material';
import { SkeletonProps as MuiSkeletonProps } from '@mui/material/Skeleton';

export interface SkeletonProps extends MuiSkeletonProps {
  lines?: number;
  spacing?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  lines = 1,
  spacing = 1,
  ...props
}) => {
  if (lines === 1) {
    return <MuiSkeleton {...props} />;
  }

  return (
    <div className={`space-y-${spacing}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <MuiSkeleton key={index} {...props} />
      ))}
    </div>
  );
};
```

### Skeleton Patterns

#### Card Skeleton
```typescript
// src/components/ui/molecules/Card/CardSkeleton.tsx
import { Card, CardContent } from '@mui/material';
import { Skeleton } from '@/components/ui/atoms/Skeleton';

export const CardSkeleton: React.FC = () => (
  <Card className="p-4">
    <CardContent>
      <Skeleton variant="text" width="60%" height={24} className="mb-2" />
      <Skeleton variant="text" lines={3} height={16} />
      <Skeleton variant="rectangular" height={120} className="mt-4" />
    </CardContent>
  </Card>
);
```

#### Dashboard Skeleton
```typescript
// src/pages/Dashboard/DashboardSkeleton.tsx
import { Grid, Container } from '@mui/material';
import { CardSkeleton } from '@/components/ui/molecules/Card/CardSkeleton';
import { Skeleton } from '@/components/ui/atoms/Skeleton';

export const DashboardSkeleton: React.FC = () => (
  <Container maxWidth="lg" className="py-6">
    <Skeleton variant="text" width="40%" height={32} className="mb-6" />
    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  </Container>
);
```

### Skeleton Guidelines

1. **Match Component Structure**: Skeleton should mirror the actual component's layout
2. **Use Appropriate Variants**:
   - `text`: For text content
   - `rectangular`: For images, charts, buttons
   - `circular`: For avatars, icons
3. **Maintain Spacing**: Use same margins/padding as actual component
4. **Progressive Loading**: Show skeletons immediately, replace with real content
5. **Consistent Timing**: Use same animation duration across all skeletons

### Integration Pattern
```typescript
// Component with skeleton integration
import { DashboardContent } from './DashboardContent';
import { DashboardSkeleton } from './DashboardSkeleton';
import { useDashboardData } from '@/hooks/useDashboardData';

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return <DashboardContent data={data} />;
};
```

### Component Creation Checklist
- [ ] Check existing atoms/molecules/organisms first
- [ ] Use Material UI as base
- [ ] Create corresponding skeleton component
- [ ] Implement skeleton in loading states
- [ ] Match skeleton structure to actual component
- [ ] Test skeleton with realistic loading times component
- [ ] Add Tailwind for spacing/layout only
- [ ] Include all necessary variants
- [ ] Add proper TypeScript interfaces
- [ ] Include accessibility attributes
- [ ] Add error boundaries where needed
- [ ] Write component stories (Storybook)
- [ ] Add unit tests

### Code Quality Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Follow React and TypeScript best practices
- **Prettier**: Consistent code formatting
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lazy loading, memoization where appropriate

### File Naming Conventions
```
PascalCase for components: Button.tsx, SearchBar.tsx
camelCase for hooks: useAuth.ts, useFitness.ts
kebab-case for utilities: api-client.ts, date-helpers.ts
UPPERCASE for constants: API_ENDPOINTS.ts
```

## State Management Patterns

### Local State
```typescript
// Use useState for component-specific state
const [isOpen, setIsOpen] = useState(false);
```

### Server State
```typescript
// Use TanStack Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ['fitness', 'activities'],
  queryFn: fitnessApi.getActivities,
});
```

### Global State
```typescript
// Use React Context for global UI state
const ThemeContext = createContext();
const AuthContext = createContext();
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
```

### Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data);
}, [data]);

// Memoize components
const MemoizedComponent = memo(Component);
```

## Testing Strategy

Health Pulse uses a comprehensive testing strategy with two frameworks:

### Vitest (Unit & Integration Tests)
Located in `test/vitest/` with ~144 test cases covering:
- **Utility Functions**: Date formatting, BMI calculations, debounce/throttle
- **Type Validation**: TypeScript interfaces for User, Auth, Fitness, Vitals, etc.
- **API Services**: All API endpoints (Auth, Fitness, Vitals, Reminders, etc.)
- **React Hooks**: Query keys, widget metadata, validation enums
- **Integration Scenarios**: Registration flow, vital signs, dashboard widgets

```bash
# Run unit tests
npm run test          # Watch mode
npm run test:run      # Single run (CI)
npm run test:coverage # With coverage report
```

### Playwright (E2E Tests)
Located in `test/playwright/` with ~193 test cases covering:
- **Landing Page**: Logo, tagline, buttons, navigation
- **Login/Register**: Form fields, validation, interactions
- **Navigation**: Page routing, browser history, URLs
- **Responsive Design**: Mobile, tablet, desktop viewports
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **UI Components**: Button states, input types, visual elements

```bash
# Run E2E tests
npm run test:e2e         # Headless
npm run test:e2e:ui      # Interactive UI
npm run test:e2e:headed  # With browser visible
```

### Component Testing
```typescript
// Use React Testing Library
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Integration Testing
- Test component interactions
- Test API integration with MSW
- Test user workflows

> **See [TestRunner.md](./TestRunner.md) for complete testing documentation.**

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast ratios
- Screen reader compatibility
- Focus management

### Implementation
```typescript
// Always include accessibility props
<Button
  aria-label="Save user profile"
  aria-describedby="save-help-text"
  role="button"
>
  Save
</Button>
```

## Error Handling

### Error Boundaries
```typescript
// Wrap organisms and pages with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <Dashboard />
</ErrorBoundary>
```

### API Error Handling
```typescript
// Use TanStack Query error handling
const { data, error, isError } = useQuery({
  queryKey: ['user'],
  queryFn: userApi.getProfile,
  onError: (error) => {
    toast.error(error.message);
  },
});
```

## Deployment Considerations

### Build Optimization
- Bundle analysis and optimization
- Asset optimization (images, fonts)
- CDN integration for static assets
- Progressive Web App features

### Environment Configuration
```typescript
// Use environment variables for configuration
const API_URL = import.meta.env.VITE_API_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;
```

## Best Practices Summary

1. **NEVER write raw UI code in pages** - compose from atoms, molecules, organisms
2. **Always check existing components** before creating new ones
3. **Prefer Material UI** over custom implementations
4. **Use Tailwind** for spacing and layout utilities only
5. **Follow atomic design** principles strictly
6. **Organize pages by authentication state** - auth/ for public, dashboard/ for private
7. **Implement comprehensive variants** for all components
8. **Use TanStack Query** for all server state management
9. **Maintain UI consistency** across the application
10. **Write accessible code** from the start
11. **Test components** thoroughly
12. **Document component APIs** clearly

## Import Patterns

### From Pages
```typescript
// In pages/auth/Landing.tsx
import { Button, Typography, EmojiDecoration } from '../../components/ui/atoms';
import { LogoBrand } from '../../components/ui/molecules';
```

### From Components
```typescript
// In molecules, import atoms
import { Typography } from '../../atoms/Typography';
import { Icon } from '../../atoms/Icon';
```

### Main Exports
```typescript
// src/pages/index.ts
export { Landing } from './auth';
export { Dashboard, Profile, Fitness, Vitals, Resources } from './dashboard';
```

## Resources

- [Material UI Documentation](https://mui.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)