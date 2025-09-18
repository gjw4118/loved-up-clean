# 🚀 Backend Setup Guide

## Overview
Your app now has a complete backend setup with:
- ✅ **Supabase** for database, auth, and real-time features
- ✅ **AI Question Generation** with OpenAI and Vercel Edge Functions
- ✅ **Development Mode** with premium bypass
- ✅ **Adaptive Question System** based on user behavior

## 🔧 Environment Setup

### 1. Create Environment File
Copy `env.template` to `.env.local` and fill in your values:

```bash
cp env.template .env.local
```

### 2. Required Environment Variables

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API Key for AI question generation
OPENAI_API_KEY=sk-your-openai-api-key-here

# Development flags (set to true for development)
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_BYPASS_PREMIUM=true

# RevenueCat (optional for development)
EXPO_PUBLIC_RC_API_KEY=your-revenuecat-key
EXPO_PUBLIC_RC_SUBSCRIPTION_NAME=pro
```

## 🗄️ Database Setup

### 1. Supabase Project Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → API to get your URL and anon key

### 2. Apply Database Schema
Run the migration in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase/migrations/20250917092945_create_connect_app_tables.sql
```

### 3. Seed Initial Data
```bash
npm run seed
```

This will populate your database with:
- 4 question decks (Friends, Family, Romantic, Professional)
- 40+ sample questions
- Proper categorization and difficulty levels

## 🤖 AI Question Generation Setup

### 1. OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Add it to your `.env.local` file

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy the API functions
vercel --prod
```

### 3. Set Environment Variables in Vercel
```bash
vercel env add OPENAI_API_KEY
# Enter your OpenAI API key when prompted
```

## 🔄 Migration from Hardcoded to Database

The app has been updated to use Supabase instead of hardcoded questions:

### What Changed:
- ✅ Question screen now fetches from Supabase
- ✅ Premium limits bypassed in development mode
- ✅ Loading states and error handling added
- ✅ AI question generation system ready

### Features Available:
1. **Real-time Data**: Questions loaded from Supabase database
2. **AI Generation**: Generate new questions using OpenAI
3. **Adaptive Questions**: Questions adapt based on user behavior
4. **Development Mode**: Premium limits bypassed for testing

## 🎯 Next Steps

### 1. Test the Setup
```bash
# Start your app
npm start

# Test question loading
# Navigate to any deck and verify questions load from Supabase
```

### 2. Generate AI Questions
The AI generation system is ready to use:

```typescript
import { useGenerateQuestions } from '@/hooks/useAIGeneration';

const { mutate: generateQuestions } = useGenerateQuestions();

// Generate 5 new questions for friends category
generateQuestions({
  category: 'friends',
  count: 5,
  difficulty: 'medium'
});
```

### 3. Implement Adaptive Questions
The adaptive system analyzes user behavior:

```typescript
import { useGenerateAdaptiveQuestions } from '@/hooks/useAIGeneration';

const { generateAdaptiveQuestions } = useGenerateAdaptiveQuestions();

// Generate questions based on user's interaction history
await generateAdaptiveQuestions('friends', userInteractions, 5);
```

## 🔍 Verification Checklist

- [ ] Supabase project created and configured
- [ ] Database schema applied
- [ ] Initial data seeded (`npm run seed`)
- [ ] Environment variables set in `.env.local`
- [ ] OpenAI API key configured
- [ ] Vercel deployment completed
- [ ] App loads questions from Supabase (not hardcoded)
- [ ] Premium limits bypassed in development
- [ ] AI question generation working

## 🚨 Troubleshooting

### Questions Not Loading
1. Check Supabase URL and anon key in `.env.local`
2. Verify database schema is applied
3. Run `npm run seed` to populate data
4. Check Supabase logs for errors

### AI Generation Not Working
1. Verify OpenAI API key is set
2. Check Vercel deployment logs
3. Ensure API endpoint is accessible
4. Check OpenAI API usage limits

### Premium Limits Still Active
1. Set `EXPO_PUBLIC_DEV_MODE=true` in `.env.local`
2. Set `EXPO_PUBLIC_BYPASS_PREMIUM=true` in `.env.local`
3. Restart your development server

## 📈 Scaling Considerations

### For Production:
1. **Remove development flags** from environment variables
2. **Set up proper RevenueCat** configuration
3. **Implement rate limiting** for AI generation
4. **Add question moderation** for AI-generated content
5. **Set up monitoring** for API usage and costs

### Performance Optimizations:
1. **Cache generated questions** in Supabase
2. **Implement pagination** for large question sets
3. **Use CDN** for static assets
4. **Optimize database queries** with proper indexing

## 🎉 You're All Set!

Your app now has:
- ✅ Real backend with Supabase
- ✅ AI-powered question generation
- ✅ Adaptive question system
- ✅ Development-friendly configuration
- ✅ Scalable architecture

The foundation is ready for you to build amazing features like:
- Custom question decks
- User-generated content
- Advanced analytics
- Social features
- And much more!
