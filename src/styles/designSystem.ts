export const DESIGN_SYSTEM = {
  COLORS: {
    PRIMARY: '#4F46E5', // Indigo
    SECONDARY: '#7C3AED', // Purple
    ACCENT: '#10B981', // Emerald
    BACKGROUND: '#F9FAFB',
    SURFACE: '#FFFFFF',
    TEXT_PRIMARY: '#111827',
    TEXT_SECONDARY: '#6B7280',
    BORDER: '#E5E7EB',
    ERROR: '#EF4444',
    WHITE: '#FFFFFF',
    TRANSPARENT: 'transparent',
  },
  SPACING: {
    S: 12,
    M: 16,
    L: 20,
    XL: 24,
    XXL: 32,
  },
  RADIUS: {
    S: 8,
    M: 12, // Inputs
    L: 14, // Buttons
    XL: 16, // Cards
    ROUND: 999,
  },
  SHADOWS: {
    SMALL: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    MEDIUM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 15,
      elevation: 4,
    },
  },
  TYPOGRAPHY: {
    H1: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 40,
    },
    H2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    SUBTITLE: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
    },
    BODY: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    LABEL: {
      fontSize: 12,
      fontWeight: '600' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
  }
};
