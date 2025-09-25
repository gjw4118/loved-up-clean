// Hybrid UI System: HeroUI Native + iOS 26 Glass Components
// Prioritizing HeroUI Native components with glass effects overlay

// ===== PRIMARY: HeroUI Native Components =====
// Use these as the main UI foundation - these are our primary components
export {
    Accordion, Avatar, Button,
    Card, Checkbox, Chip,
    Divider, DropShadowView,
    ErrorView, FormField,
    Radio, RadioGroup, ScrollShadow, Skeleton, SkeletonGroup, Spinner, Surface, Switch, TextField
} from 'heroui-native';

// ===== HEROUI PROVIDERS & THEME =====
// Theme and provider components
export { HeroUINativeProvider, ThemeProvider } from 'heroui-native';

// ===== iOS 26 NATIVE GLASS COMPONENTS =====
// Use these for authentic iOS glass/blur effects
export { BlurView } from 'expo-blur'; // Fallback for older iOS versions
export { GlassContainer, GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
export * as Haptics from 'expo-haptics';
export { LinearGradient } from 'expo-linear-gradient';
export { StatusBar } from 'expo-status-bar';

// ===== EXPO NATIVE MODULES =====
// iOS native functionality
// export * as Accessibility from 'expo-accessibility'; // Temporarily disabled
export * as Clipboard from 'expo-clipboard';
export * as Constants from 'expo-constants';
export * as Device from 'expo-device';
export * as Linking from 'expo-linking';
export * as Sharing from 'expo-sharing';

// ===== REACT NATIVE CORE =====
// Minimal usage - prefer HeroUI when available
export {
    ActivityIndicator, Alert, Pressable, ScrollView, TouchableOpacity, View
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';

// ===== EXPO ROUTER =====
export { Link, router, useLocalSearchParams, useRouter } from 'expo-router';

// ===== GLASS-ENHANCED COMPONENTS =====
// These combine HeroUI components with glass effects
export { default as GlassButton } from './GlassButton';
export { default as GlassCard } from './GlassCard';
export { default as GlassTabBar } from './GlassTabBar';

// ===== LEGACY CUSTOM COMPONENTS (REMOVED) =====
// Custom button and text components removed - using HeroUI equivalents

