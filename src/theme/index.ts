// src/theme/index.ts
export const Colors = {
  primary: '#1D9E75',
  primaryDark: '#0F6E56',
  primaryLight: '#E1F5EE',
  primaryMid: '#5DCAA5',

  background: '#FFFFFF',
  backgroundSecondary: '#F7F8F6',
  backgroundTertiary: '#EFF0EE',

  text: '#1A1A18',
  textSecondary: '#6B6B68',
  textTertiary: '#A0A09D',

  border: 'rgba(0,0,0,0.08)',
  borderSecondary: 'rgba(0,0,0,0.15)',

  error: '#E24B4A',
  errorLight: '#FCEBEB',

  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '600' as const, letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '500' as const, letterSpacing: -0.2, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 19 },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 8,
  },
};
