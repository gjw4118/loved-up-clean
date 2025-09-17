# Connect App - Design System

## 🎨 Design Philosophy

Connect's design system embodies **meaningful simplicity** - creating beautiful, intuitive interfaces that fade into the background, allowing authentic human connections to take center stage.

### Core Principles
1. **iOS Native First**: Authentic iOS 26 experience with glass morphism
2. **Content-Focused**: Questions are the hero, UI supports them
3. **Emotional Resonance**: Colors and interactions that feel warm and inviting
4. **Accessibility**: Inclusive design for all users

## 🏗️ Architecture

### Hybrid UI System
Our design system combines the best of both worlds:

**Foundation Layer**: HeroUI Native
- Provides robust, accessible components
- Consistent behavior across platforms
- Built-in theme support

**Enhancement Layer**: Custom iOS 26 Glass Components
- Authentic native iOS feel
- Glass morphism effects using `expo-blur`
- Haptic feedback integration

**Native Layer**: Expo modules
- Platform-specific functionality
- Performance-optimized native features

## 🎨 Visual Language

### Color Palette

#### Primary Colors (Deck Categories)
```typescript
const DECK_COLORS = {
  friends: {
    primary: '#FF6B35',    // Warm Orange
    secondary: '#F7931E',
    gradient: ['#FF6B35', '#F7931E'],
    description: 'Energetic and social'
  },
  family: {
    primary: '#4ECDC4',    // Teal
    secondary: '#44A08D', 
    gradient: ['#4ECDC4', '#44A08D'],
    description: 'Nurturing and stable'
  },
  romantic: {
    primary: '#E74C3C',    // Red
    secondary: '#C0392B',
    gradient: ['#E74C3C', '#C0392B'],
    description: 'Passionate and intimate'
  },
  professional: {
    primary: '#3498DB',    // Blue
    secondary: '#2980B9',
    gradient: ['#3498DB', '#2980B9'],
    description: 'Professional and trustworthy'
  }
};
```

#### System Colors
```typescript
const SYSTEM_COLORS = {
  // iOS System Colors
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemYellow: '#FFCC00',
  systemPurple: '#AF52DE',
  
  // Neutral Colors
  label: '#000000',           // Primary text
  secondaryLabel: '#3C3C43',  // Secondary text
  tertiaryLabel: '#3C3C4399', // Tertiary text
  quaternaryLabel: '#3C3C432E', // Quaternary text
  
  // Background Colors
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  
  // Glass Effect Colors
  glassLight: 'rgba(255, 255, 255, 0.8)',
  glassDark: 'rgba(0, 0, 0, 0.3)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};
```

### Typography

#### Font Family
- **Primary**: SF Pro Display (iOS system font)
- **Fallback**: System font stack

#### Type Scale
```typescript
const TYPOGRAPHY = {
  // Display Text
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  // Headings
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  
  // UI Text
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  button: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
};
```

### Spacing System

#### Spacing Scale
```typescript
const SPACING = {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem  
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  '2xl': 48, // 3rem
  '3xl': 64, // 4rem
  '4xl': 96, // 6rem
};
```

#### Layout Guidelines
- **Screen Padding**: 16px (md)
- **Card Padding**: 16px (md) 
- **Component Spacing**: 8px (sm) between related items
- **Section Spacing**: 24px (lg) between sections
- **Screen Margins**: 32px (xl) for major sections

### Elevation & Shadows

#### Glass Morphism Effects
```typescript
const GLASS_EFFECTS = {
  light: {
    intensity: 25,
    tint: 'light',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  medium: {
    intensity: 40,
    tint: 'system',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heavy: {
    intensity: 60,
    tint: 'dark',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
};
```

#### Shadow System
```typescript
const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
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
```

## 🧩 Component Library

### Core Components

#### GlassCard
The foundation component for content containers.

```typescript
<GlassCard 
  intensity={25} 
  tint="light" 
  radius="xl"
  shadow="lg"
>
  <Text>Card content</Text>
</GlassCard>
```

**Props:**
- `intensity`: Blur intensity (0-100)
- `tint`: 'light' | 'dark' | 'system'
- `radius`: Border radius size
- `shadow`: Shadow intensity

#### GlassButton
Interactive button with glass morphism.

```typescript
<GlassButton
  variant="primary"
  size="lg"
  onPress={handlePress}
>
  Continue
</GlassButton>
```

#### GlassTabBar
Custom tab bar with native iOS feel.

```typescript
// Automatically used by Expo Router tabs
<Tabs tabBar={(props) => <GlassTabBar {...props} />} />
```

### Question Components

#### QuestionCard
Primary component for displaying questions.

```typescript
<QuestionCard
  question={question}
  onComplete={handleComplete}
  onSkip={handleSkip}
  onShare={handleShare}
/>
```

#### DeckCard
Component for displaying question decks.

```typescript
<DeckCard
  deck={deck}
  progress={userProgress}
  onSelect={handleDeckSelect}
/>
```

## 🎭 Interaction Design

### Haptic Feedback
```typescript
// Light feedback for selections
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium feedback for actions
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy feedback for important actions
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
```

### Animation Principles
- **Duration**: 200-300ms for micro-interactions
- **Easing**: iOS native curves (`ease-in-out`)
- **Transform**: Scale (0.95-1.0) for press states
- **Opacity**: 0.7 for disabled states

### Gesture Support
- **Swipe**: Navigate between questions
- **Long Press**: Show additional options
- **Pull to Refresh**: Refresh question lists
- **Pinch**: Zoom question text (accessibility)

## ♿ Accessibility

### Guidelines
1. **Color Contrast**: Minimum 4.5:1 ratio for text
2. **Touch Targets**: Minimum 44x44pt
3. **VoiceOver**: Proper labels and hints
4. **Dynamic Type**: Support for text scaling
5. **Reduced Motion**: Respect motion preferences

### Implementation
```typescript
// Accessibility props example
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Complete question"
  accessibilityHint="Mark this question as completed"
>
  <Text>Complete</Text>
</Pressable>
```

## 📱 Responsive Design

### Breakpoints
- **iPhone SE**: 375px width
- **iPhone Standard**: 390px width  
- **iPhone Plus**: 428px width
- **iPad**: 768px+ width

### Layout Adaptations
- **Portrait**: Single column layout
- **Landscape**: Maintain readability with max-width
- **iPad**: Multi-column layouts where appropriate

## 🎨 Usage Examples

### Screen Layout Pattern
```typescript
export default function ExampleScreen() {
  return (
    <SafeAreaView className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={DECK_COLORS.friends.gradient}
        className="absolute inset-0"
      />
      
      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-6">
        <GlassCard intensity={25} tint="light">
          <Text className="text-xl font-bold">Content</Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Question Card Pattern
```typescript
<GlassCard className="mb-4">
  <View className="p-6">
    <Text className="text-2xl font-bold text-gray-800 mb-4">
      {question.text}
    </Text>
    
    <View className="flex-row justify-between">
      <GlassButton variant="secondary" onPress={onSkip}>
        Skip
      </GlassButton>
      <GlassButton variant="primary" onPress={onComplete}>
        Complete
      </GlassButton>
    </View>
  </View>
</GlassCard>
```

## 🔧 Development Tools

### Design Tokens
All design tokens are defined in:
- `/constants/Colors.ts` - Color definitions
- `/constants/Typography.ts` - Text styles
- `/constants/Spacing.ts` - Layout spacing

### Component Testing
```typescript
// Test glass card rendering
test('renders GlassCard with correct props', () => {
  render(
    <GlassCard intensity={25} tint="light">
      <Text>Test content</Text>
    </GlassCard>
  );
  
  expect(screen.getByText('Test content')).toBeOnTheScreen();
});
```

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintained by**: Connect Design Team
