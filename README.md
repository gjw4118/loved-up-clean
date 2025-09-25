# 💕 Loved Up - Question Cards App

A beautiful React Native app built with Expo for meaningful conversations and deeper connections.

## 🚀 Quick Start

```bash
npm install
npx expo start
```

## 📁 Project Structure

This project follows [Expo App Folder Structure Best Practices](https://expo.dev/blog/expo-app-folder-structure-best-practices) with a `/src` folder for clean separation of app code from configuration files.

```
/
├── src/                   # All app source code
│   ├── app/              # Expo Router pages (file-based routing)
│   │   ├── (tabs)/       # Tab navigation screens
│   │   ├── questions/    # Question browsing screens
│   │   └── _layout.tsx   # Root layout
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Basic UI primitives (buttons, cards, etc.)
│   │   ├── auth/        # Authentication components
│   │   ├── cards/       # Question card components
│   │   ├── onboarding/  # Onboarding flow components
│   │   ├── settings/    # Settings components
│   │   ├── forms/       # Form components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── lib/             # Core business logic & utilities
│   │   ├── auth/       # Authentication logic
│   │   ├── database/   # Supabase database connections
│   │   ├── storage/    # Storage utilities (Zustand)
│   │   └── utils.ts    # General utilities
│   ├── hooks/          # Custom React hooks
│   │   ├── questions/  # Question-related hooks
│   │   └── [feature]/  # Feature-specific hooks
│   ├── stores/         # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # App constants & configuration
│   └── api/            # API routes & functions
├── assets/             # Static assets (images, fonts)
├── scripts/            # Build & deployment scripts
├── docs/               # Documentation files
├── supabase/           # Database migrations & config
└── [config files]      # Root-level config files only
```

## 🎨 Design System

- **Theme**: Clean black/white aesthetic with glass morphism
- **Fonts**: Snell Roundhand cursive for questions
- **Colors**: Minimal palette with accent colors per deck
- **Components**: Glass cards with backdrop blur effects

## 🃏 Question Decks

1. **🧡 Friends** - Fun social questions for friends
2. **🏠 Family** - Connection and reconnection questions
3. **💕 Dating** - Early dating and relationship questions
4. **🌱 Growing** - Work, career, and personal growth
5. **🔥 Spice** - Premium intimate couples questions

## 🛠️ Tech Stack

- **Framework**: Expo + React Native
- **Routing**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind CSS)
- **UI Components**: HeroUI Native + Custom glass components
- **State**: Zustand
- **Database**: Supabase
- **Authentication**: Supabase Auth + Apple Sign-In
- **Animations**: React Native Reanimated
- **Fonts**: Expo Fonts

## 📱 Features

- Beautiful swipeable question cards
- Glass morphism design
- Dark/light mode support
- Premium Spice deck
- Smooth animations
- Haptic feedback
- Offline support

## 🚀 Development

See [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) for detailed setup instructions.

## 📚 Documentation

All documentation is organized in the `docs/` folder:
- [Development Guide](docs/DEVELOPMENT_GUIDE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Setup Instructions](docs/SETUP.md)
- [Folder Structure Rules](.folder-structure-rules.md)

## 🎯 Folder Structure Rules

See [.folder-structure-rules.md](.folder-structure-rules.md) for detailed guidelines on maintaining a clean project structure.
