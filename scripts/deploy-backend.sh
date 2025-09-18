#!/bin/bash

# Deploy AI Question Generation API to Vercel
# This script helps you deploy the backend functions

echo "🚀 Deploying AI Question Generation API to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Deploy the project
echo "📦 Deploying to Vercel..."
vercel --prod

# Set environment variables
echo "🔧 Setting up environment variables..."
echo "Please add your OpenAI API key:"
vercel env add OPENAI_API_KEY

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your app to use the new API endpoint"
echo "2. Test AI question generation"
echo "3. Monitor usage in Vercel dashboard"
echo ""
echo "🔗 Your API endpoint: https://your-project.vercel.app/api/generate-questions"
