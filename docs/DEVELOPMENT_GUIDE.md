# Connect App - Development Guide

## 🎯 Project Overview

**Connect** is a beautiful iOS-native question cards app designed to facilitate meaningful connections through curated questions. Built with Expo Router v6, Supabase, and a hybrid HeroUI + iOS 26 glass design system.

## 📋 Development Standards

### Code Quality
- **ESLint**: Strict TypeScript and React Native rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled with proper typing
- **Testing**: Jest + React Native Testing Library (to be implemented)

### Git Workflow
- **Branch Naming**: `feature/description`, `fix/description`, `chore/description`
- **Commit Messages**: Follow conventional commits format
- **PR Requirements**: All checks must pass, code review required

### Component Standards
- Use functional components with hooks
- Prefer TypeScript interfaces over types for props
- Follow the established design system patterns
- Include proper accessibility labels
- Document complex components with JSDoc

## 🎨 Design System

### Architecture
Our design system combines **HeroUI Native** as the foundation with custom **iOS 26 glass components** for authentic native feel.

#### Primary Components (HeroUI Native)
```typescript
import { Button, Card, Avatar, Badge } from 'heroui-native';
```

#### iOS 26 Glass Components (Custom)
```typescript
import { GlassCard, GlassButton, GlassTabBar } from '@/components/ui';
```

#### Native iOS Modules
```typescript
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
```

### Color Palette
Based on question deck categories:
- **Friends & Social**: `#FF6B35` → `#F7931E` (Warm Orange)
- **Family Bonds**: `#4ECDC4` → `#44A08D` (Teal)
- **Love & Romance**: `#E74C3C` → `#C0392B` (Red)
- **Work & Growth**: `#3498DB` → `#2980B9` (Blue)

### Typography Scale
- **Display**: 32px, bold
- **Heading 1**: 28px, bold
- **Heading 2**: 24px, semibold
- **Heading 3**: 20px, semibold
- **Body Large**: 18px, regular
- **Body**: 16px, regular
- **Body Small**: 14px, regular
- **Caption**: 12px, regular

### Spacing System
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

## 🏗️ Architecture

### Project Structure
```
/app                 # Expo Router pages
/components          # Reusable components
  /ui               # Design system components
  /auth             # Authentication components
  /cards            # Question card components
  /decks            # Deck-related components
/constants          # App constants and configuration
/hooks              # Custom React hooks
/lib                # Core libraries (auth, database, storage)
/types              # TypeScript type definitions
/utils              # Utility functions
```

### State Management
- **Authentication**: React Context (`AuthContext`)
- **Local State**: React hooks (`useState`, `useReducer`)
- **Server State**: TanStack Query (React Query)
- **Persistent Storage**: Zustand + MMKV

### Database Schema
Comprehensive PostgreSQL schema with:
- Question decks and questions
- User profiles and interactions
- Session tracking and analytics
- Sharing functionality
- Row Level Security (RLS) policies

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or physical device
- Supabase account

### Installation
```bash
npm install
npx expo install
```

### Development
```bash
npm run ios          # Start iOS simulator
npm run start        # Start development server
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

### Environment Setup
Create `.env.local`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📱 Features Implementation Status

### ✅ Completed
- [x] Project setup with Expo Router v6
- [x] Design system foundation (HeroUI + Glass components)
- [x] Database schema design
- [x] Authentication system (Google/Apple)
- [x] Basic navigation structure
- [x] TypeScript configuration

### 🚧 In Progress
- [ ] Question browsing functionality
- [ ] Deck selection and management
- [ ] User interaction tracking

### 📋 Planned
- [ ] Question sharing (iMessage, in-app)
- [ ] Onboarding flow integration
- [ ] Analytics and insights
- [ ] Offline support
- [ ] Performance optimizations

## 🧪 Testing Strategy

### Unit Tests
- Component rendering and props
- Hook behavior and state changes
- Utility function logic
- Database query functions

### Integration Tests
- Authentication flow
- Question browsing flow
- Sharing functionality
- Navigation between screens

### E2E Tests
- Complete user journeys
- Cross-platform compatibility
- Performance benchmarks

## 📊 Performance Requirements

Based on PRD specifications:
- **App Launch**: < 2 seconds
- **Question Loading**: < 500ms
- **Animations**: 60fps smooth
- **Memory**: Minimal footprint
- **Offline**: Question viewing capability

## 🔧 Development Tools

### Required Extensions (VS Code)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

### Recommended Tools
- React Native Debugger
- Flipper (for debugging)
- Expo Dev Tools
- Supabase Studio

## 📝 Code Examples

### Creating a New Screen
```typescript
// app/(tabs)/new-screen.tsx
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { GlassCard } from '@/components/ui';
import { Text } from '@/components/ui/text';

export default function NewScreen() {
  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      <ScrollView className="flex-1 px-4 pt-6">
        <GlassCard intensity={25} tint="light">
          <Text className="text-xl font-bold">New Screen</Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Creating a Custom Hook
```typescript
// hooks/useQuestions.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/database/supabase';
import { Question } from '@/types/questions';

export function useQuestions(deckId: string) {
  return useQuery({
    queryKey: ['questions', deckId],
    queryFn: async (): Promise<Question[]> => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('deck_id', deckId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });
}
```

## 🎯 Next Steps

1. **Set up development tools** (ESLint, Prettier, testing)
2. **Implement core question browsing** functionality
3. **Complete deck management** features
4. **Add sharing capabilities**
5. **Integrate onboarding flow**
6. **Performance optimization**
7. **Analytics implementation**

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Team**: Connect Development Team
