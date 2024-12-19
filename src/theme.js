import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1', // Vibrant indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899', // Energetic pink
      light: '#F472B6',
      dark: '#DB2777',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Fresh green
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444', // Bright red
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B', // Warm amber
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6', // Clear blue
      light: '#60A5FA',
      dark: '#2563EB',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #6366F1, #EC4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#374151',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#374151',
    },
    body1: {
      fontSize: '1rem',
      color: '#4B5563',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6B7280',
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontSize: '1rem',
          padding: '0.75rem 1.5rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #6366F1, #EC4899)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4F46E5, #DB2777)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
  },
});

export default theme;
