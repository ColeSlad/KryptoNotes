export const theme = {
  colors: {
    background: '#0D1117',
    cardBg: '#161B22',
    accent: '#1F6FEB',
    secondaryAccent: '#58A6FF',
    success: '#238636',
    error: '#F85149',
    warning: '#D29922',
    text: '#C9D1D9',
    textDim: '#8B949E',
    border: '#30363D',
  },
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
    h3: {
      fontSize: 18,
      fontWeight: '700' as const,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
    body: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      letterSpacing: 0.5,
    },
    button: {
      fontSize: 14,
      fontWeight: '700' as const,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
  },
  animation: {
    fast: 100,
    normal: 300,
    slow: 500,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  },
};