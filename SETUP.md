# Connect App - Setup Instructions

## 🚀 Quick Setup for Development Build

Follow these steps to get your development build ready for testing:

### 1. Install Dependencies

```bash
# Install all dependencies (including new ones)
npm install

# Clear any existing cache
npx expo install --fix
```

### 2. Environment Setup

Create `.env.local` file in the root directory:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development flags
EXPO_PUBLIC_DEV_MODE=true
```

### 3. iOS Development Build

```bash
# For iOS Simulator
npm run ios

# For physical device (requires Apple Developer account)
eas build --platform ios --profile development
```

### 4. Verify Installation

Run these commands to ensure everything is working:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Start development server
npm start
```

## 📦 New Dependencies Added

### Core Functionality
- **expo-linear-gradient**: For gradient backgrounds (already used in your code)
- **react-native-gesture-handler**: For swipe gestures on question cards
- **zustand**: Lightweight state management for question interactions

### Utility Libraries
- **expo-clipboard**: For copying question text
- **expo-device**: For device information and analytics

### Development Tools
- **ESLint + Prettier**: Code quality and formatting
- **Jest**: Testing framework
- **TypeScript ESLint**: Enhanced TypeScript support

## 🔧 Configuration Updates

### app.json
- Added `expo-apple-authentication` plugin
- Added `react-native-reanimated/plugin` for animations

### metro.config.js
- Added gesture handler alias for proper resolution

## 🎯 What's Ready for Testing

### ✅ Working Features
1. **Authentication**: Google/Apple sign-in
2. **Navigation**: Tab-based navigation with glass effects
3. **Design System**: HeroUI + iOS glass components
4. **Home Screen**: Welcome screen with user info

### 🚧 Ready to Implement
1. **Question Cards**: Swipeable cards with gesture support
2. **Deck Selection**: Interactive deck browsing
3. **State Management**: Zustand stores for user interactions

## 📱 Testing Checklist

Before fine-tuning UI, verify these work:

- [ ] App launches without crashes
- [ ] Authentication flow works (Google/Apple)
- [ ] Navigation between tabs is smooth
- [ ] Glass effects render properly
- [ ] Haptic feedback works on device
- [ ] Gradients display correctly

## 🐛 Common Issues & Fixes

### Metro Bundle Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset node modules
rm -rf node_modules package-lock.json
npm install
```

### iOS Build Issues
```bash
# Clean iOS build
npx expo run:ios --clear

# Update iOS pods (if using bare workflow)
cd ios && pod install && cd ..
```

### Gesture Handler Issues
```bash
# Ensure proper installation
npx expo install react-native-gesture-handler
```

## 🎨 UI Fine-Tuning Ready

Once the development build is working, you can focus on:

1. **Question Card Design**: Perfect the swipe animations
2. **Deck Visual Polish**: Enhance deck selection UI
3. **Color Refinements**: Adjust gradients and glass effects
4. **Typography**: Fine-tune text sizing and spacing
5. **Micro-interactions**: Polish haptic feedback timing

## 📊 Performance Monitoring

Monitor these metrics during testing:
- App launch time (target: < 2 seconds)
- Navigation smoothness (60fps)
- Memory usage
- Battery impact

---

**Next Steps**: Run `npm install` and then `npm run ios` to start testing!
