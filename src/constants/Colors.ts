// Connect App - Design System Colors
// Based on PRD requirements and iOS 26 design guidelines

// Deck Category Colors (Primary Brand Colors) - Updated Color Scheme
export const DECK_COLORS = {
  friends: {
    primary: '#2196F3',    // Vibrant Blue
    secondary: '#42A5F5',  // Bright Blue
    gradient: ['#2196F3', '#42A5F5', '#64B5F6'],
    light: '#E3F2FD',
    dark: '#1565C0',
  },
  family: {
    primary: '#4CAF50',    // Vibrant Green
    secondary: '#66BB6A',  // Bright Green
    gradient: ['#4CAF50', '#66BB6A', '#81C784'],
    light: '#E8F5E8',
    dark: '#388E3C',
  },
  romantic: {
    primary: '#E91E63',    // Vibrant Pink
    secondary: '#F06292',  // Bright Pink
    gradient: ['#E91E63', '#F06292', '#F48FB1'],
    light: '#FCE4EC',
    dark: '#AD1457',
  },
  professional: {
    primary: '#2196F3',    // Vibrant Blue
    secondary: '#42A5F5',  // Bright Blue
    gradient: ['#2196F3', '#42A5F5', '#64B5F6'],
    light: '#E3F2FD',
    dark: '#1565C0',
  },
  work: {
    primary: '#9C27B0',    // Vibrant Purple
    secondary: '#BA68C8',  // Bright Purple
    gradient: ['#9C27B0', '#BA68C8', '#CE93D8'],
    light: '#F3E5F5',
    dark: '#7B1FA2',
  },
  lovers: {
    primary: '#F44336',    // Vibrant Red
    secondary: '#EF5350',  // Bright Red
    gradient: ['#F44336', '#EF5350', '#E57373'],
    light: '#FFEBEE',
    dark: '#D32F2F',
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
