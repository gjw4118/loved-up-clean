// Hybrid UI System: HeroUI Native + iOS 26 Glass Components
// Based on user preference for HeroUI standard + Expo iOS native components

// ===== PRIMARY: HeroUI Native Components =====
// Use these as the main UI foundation
export {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Badge,
  Chip,
  Divider,
  Spinner,
  Skeleton,
  Switch,
  Checkbox,
  Accordion,
  AccordionItem,
  HeroUINativeProvider,
} from 'heroui-native';

// ===== iOS 26 NATIVE GLASS COMPONENTS =====
// Use these for authentic iOS glass/blur effects
export { BlurView } from 'expo-blur';
export { LinearGradient } from 'expo-linear-gradient';
export * as Haptics from 'expo-haptics';
export { StatusBar } from 'expo-status-bar';

// ===== EXPO NATIVE MODULES =====
// iOS native functionality
export * as ImagePicker from 'expo-image-picker';
export * as Notifications from 'expo-notifications';
export * as Device from 'expo-device';
export * as Constants from 'expo-constants';
export * as Linking from 'expo-linking';
export * as Clipboard from 'expo-clipboard';
export * as Sharing from 'expo-sharing';
export * as Accessibility from 'expo-accessibility';

// ===== REACT NATIVE CORE =====
// Minimal usage - prefer HeroUI when available
export { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  Alert
} from 'react-native';

// ===== EXPO ROUTER =====
export { Link, router, useRouter, useLocalSearchParams } from 'expo-router';

// ===== CUSTOM iOS 26 GLASS COMPONENTS =====
// Custom components that combine HeroUI + iOS glass effects
export { default as GlassCard } from './GlassCard';
export { default as GlassButton } from './GlassButton';
export { default as GlassModal } from './GlassModal';
export { default as GlassTabBar } from './GlassTabBar';
export { default as GlassHeader } from './GlassHeader';
