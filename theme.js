// src/theme.js
export const colors = {
  ink: '#0F0F0F',
  gold: '#C4923A',
  goldPale: '#FDF3E3',
  goldLight: '#F0C060',
  surface: '#FFFFFF',
  bg: '#F6F4F0',
  muted: '#888888',
  border: 'rgba(0,0,0,0.09)',
  success: '#2EAD6E',
  white: '#FFFFFF',
};

export const fonts = {
  display: 'serif', // заменяется на кастомный шрифт ниже
  body: 'System',
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
};
