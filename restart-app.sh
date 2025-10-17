#!/bin/bash
echo "🔄 Restarting Expo with fresh environment..."

# Kill any existing Expo processes
pkill -f "expo start" 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true

# Clear Metro bundler cache and restart
echo "🧹 Clearing cache..."
npx expo start --clear --dev-client

