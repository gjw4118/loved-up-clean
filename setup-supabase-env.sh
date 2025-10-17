#!/bin/bash
# Script to automatically fetch and configure Supabase environment variables

echo "🔧 Setting up Supabase environment..."

# Link to project
echo "📡 Linking to Supabase project..."
supabase link --project-ref gvmnpnlslzyaargmyskp

# Get project details
echo "🔑 Fetching project credentials..."
PROJECT_URL=$(supabase status | grep "API URL" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

# Update .env.local
echo "📝 Updating .env.local..."
cat > .env.local << ENVEOF
# Environment Configuration
# Supabase Configuration (Cloud)
# Project: loved-up-connect
# Auto-generated on $(date)

EXPO_PUBLIC_SUPABASE_URL=${PROJECT_URL}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}

# Development flags
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_BYPASS_PREMIUM=true
EXPO_PUBLIC_BYPASS_AUTH=true
ENVEOF

echo "✅ Environment configured!"
echo ""
echo "Your Supabase URL: ${PROJECT_URL}"
echo "Anon Key: ${ANON_KEY:0:20}..."
