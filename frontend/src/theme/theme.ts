import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Extend MUI theme to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    customSpacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    customSizes: {
      icon: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      avatar: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      emoji: {
        small: { fontSize: number; lineHeight: number };
        medium: { fontSize: number; lineHeight: number };
        large: { fontSize: number; lineHeight: number };
      };
      button: {
        height: {
          sm: number;
          md: number;
          lg: number;
        };
      };
      borderRadius: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
        full: number;
      };
      maxWidth: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
    };
    customColors: {
      background: {
        mint: string;
        mintLight: string;
        mintDark: string;
      };
      surface: {
        elevated: string;
        overlay: string;
      };
      accent: {
        mint: string;
        mintHover: string;
        dark: string;
      };
      snackbar: {
        background: string;
        text: string;
      };
    };
  }
  interface ThemeOptions {
    customSpacing?: Theme['customSpacing'];
    customSizes?: Theme['customSizes'];
    customColors?: Theme['customColors'];
  }
}

// Custom spacing scale (in pixels, converted to theme.spacing units)
const customSpacing = {
  xs: 4,    // 0.5 spacing unit
  sm: 8,    // 1 spacing unit
  md: 16,   // 2 spacing units
  lg: 24,   // 3 spacing units
  xl: 32,   // 4 spacing units
  '2xl': 48, // 6 spacing units
  '3xl': 64, // 8 spacing units
  '4xl': 80, // 10 spacing units
};

// Custom sizes for consistent sizing across components
const customSizes = {
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
  avatar: {
    xs: 32,
    sm: 36,
    md: 44,
    lg: 50,
    xl: 64,
  },
  emoji: {
    small: { fontSize: 32, lineHeight: 40 },
    medium: { fontSize: 48, lineHeight: 56 },
    large: { fontSize: 57, lineHeight: 64 },
  },
  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
    },
  },
  borderRadius: {
    xs: 1,     // Input fields - nearly rectangular
    sm: 2,
    md: 3,    // Cards, Paper
    lg: 4,    // Menu items, buttons
    xl: 6,
    xxl: 8,   // FAB, large rounded elements
    full: 9999,
  },
  maxWidth: {
    xs: '320px',
    sm: '422px',
    md: '550px',
    lg: '650px',
    xl: '720px',
  },
};

// Custom colors for consistent branding
const customColors = {
  background: {
    mint: '#F4FBF8',
    mintLight: '#FAFDFC',
    mintDark: '#E8F5F0',
  },
  surface: {
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
  accent: {
    mint: '#9EF2E3',
    mintHover: '#7DD8C9',
    dark: '#1E1E1E',
  },
  snackbar: {
    background: '#322F35',
    text: '#F5EFF7',
  },
};

// Material Design 3 inspired theme for Health Pulse
const themeOptions: ThemeOptions = {
  customSpacing,
  customSizes,
  customColors,
  palette: {
    mode: 'light',
    primary: {
      main: '#006A6A',
      light: '#4CDADA',
      dark: '#004F4F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A6363',
      light: '#B0CCCB',
      dark: '#324B4B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
      light: '#FFB4AB',
      dark: '#93000A',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#7D5800',
      light: '#FFDEA6',
      dark: '#4A3400',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#4B607C',
      light: '#B3C8E8',
      dark: '#334863',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#006D3C',
      light: '#7EF9A4',
      dark: '#00522C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFDFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#191C1C',
      secondary: '#3F4948',
    },
    divider: '#BEC9C8',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 500,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 1,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 1,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
};

// Create light theme
export const lightTheme = createTheme(themeOptions);

// Create dark theme
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CDADA',
      light: '#6FF7F6',
      dark: '#003737',
      contrastText: '#003737',
    },
    secondary: {
      main: '#B0CCCB',
      light: '#CCE8E7',
      dark: '#1B3534',
      contrastText: '#1B3534',
    },
    error: {
      main: '#FFB4AB',
      light: '#FFDAD6',
      dark: '#690005',
      contrastText: '#690005',
    },
    warning: {
      main: '#FFDEA6',
      light: '#FFEECC',
      dark: '#4A3400',
      contrastText: '#4A3400',
    },
    info: {
      main: '#B3C8E8',
      light: '#D3E4FF',
      dark: '#1C314B',
      contrastText: '#1C314B',
    },
    success: {
      main: '#7EF9A4',
      light: '#93FFB3',
      dark: '#00522C',
      contrastText: '#00522C',
    },
    background: {
      default: '#191C1C',
      paper: '#1E2222',
    },
    text: {
      primary: '#E0E3E2',
      secondary: '#BEC9C8',
    },
    divider: '#3F4948',
  },
});

export default lightTheme;
