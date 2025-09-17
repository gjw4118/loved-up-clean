// Connect App - Design System Colors
// Based on PRD requirements and iOS 26 design guidelines

// Deck Category Colors (Primary Brand Colors)
export const DECK_COLORS = {
  friends: {
    primary: '#FF6B35',    // Warm Orange
    secondary: '#F7931E',
    gradient: ['#FF6B35', '#F7931E'],
    light: '#FFE5D9',
    dark: '#CC5429',
  },
  family: {
    primary: '#4ECDC4',    // Teal
    secondary: '#44A08D', 
    gradient: ['#4ECDC4', '#44A08D'],
    light: '#E0F7F5',
    dark: '#3EA39D',
  },
  romantic: {
    primary: '#E74C3C',    // Red
    secondary: '#C0392B',
    gradient: ['#E74C3C', '#C0392B'],
    light: '#FADBD8',
    dark: '#B93A30',
  },
  professional: {
    primary: '#3498DB',    // Blue
    secondary: '#2980B9',
    gradient: ['#3498DB', '#2980B9'],
    light: '#D6EAF8',
    dark: '#2A7AAF',
  },
} as const;

// iOS System Colors
export const SYSTEM_COLORS = {
  // Primary System Colors
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemYellow: '#FFCC00',
  systemPurple: '#AF52DE',
  systemPink: '#FF2D92',
  systemTeal: '#5AC8FA',
  systemIndigo: '#5856D6',
  
  // Neutral Colors (Light Mode)
  label: '#000000',           // Primary text
  secondaryLabel: '#3C3C43',  // Secondary text  
  tertiaryLabel: '#3C3C4399', // Tertiary text
  quaternaryLabel: '#3C3C432E', // Quaternary text
  
  // Background Colors (Light Mode)
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  
  // Grouped Background Colors
  systemGroupedBackground: '#F2F2F7',
  secondarySystemGroupedBackground: '#FFFFFF',
  tertiarySystemGroupedBackground: '#F2F2F7',
  
  // Fill Colors
  systemFill: '#78788033',
  secondarySystemFill: '#78788028',
  tertiarySystemFill: '#7878801E',
  quaternarySystemFill: '#78788014',
  
  // Separator Colors
  separator: '#3C3C4349',
  opaqueSeparator: '#C6C6C8',
} as const;

// Glass Effect Colors
export const GLASS_COLORS = {
  light: {
    background: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.15)',
    shadow: 'rgba(0, 0, 0, 0.15)',
  },
  heavy: {
    background: 'rgba(255, 255, 255, 0.4)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.2)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

// Legacy support for existing code
const tintColorLight = SYSTEM_COLORS.systemBlue;
const tintColorDark = '#fff';

export default {
  light: {
    text: SYSTEM_COLORS.label,
    background: SYSTEM_COLORS.systemBackground,
    tint: tintColorLight,
    tabIconDefault: SYSTEM_COLORS.tertiaryLabel,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

// Utility function to get deck color by category
export const getDeckColor = (category: string) => {
  return DECK_COLORS[category as keyof typeof DECK_COLORS] || DECK_COLORS.friends;
};
