// Arunella Design System - Sri Lanka Agricultural Platform
export const Colors = {
  // Brand greens (agriculture-inspired)
  primary: '#2D7D46',
  primaryDark: '#1A5C30',
  primaryLight: '#4CAF72',
  primaryGradient: ['#2D7D46', '#1A5C30'],

  // Accent colors
  accent: '#F5A623',
  accentLight: '#FFD280',

  // Role-specific colors
  farmer: '#2D7D46',
  farmerLight: '#E8F5EB',
  buyer: '#1565C0',
  buyerLight: '#E3F0FF',
  transporter: '#D4380D',
  transporterLight: '#FFF1ED',

  // Status colors
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1890FF',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  background: '#F7F9F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#1A2E1A',
  textSecondary: '#637966',
  textMuted: '#98A89B',
  textInverse: '#FFFFFF',

  // Borders
  border: '#DDE8DE',
  borderLight: '#EEF4EF',

  // Card shadow
  shadow: 'rgba(45, 125, 70, 0.15)',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600', letterSpacing: -0.2 },
  h4: { fontSize: 17, fontWeight: '600', letterSpacing: -0.1 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  button: { fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
  circle: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#2D7D46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2D7D46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default { Colors, Typography, Spacing, Radii, Shadows };
