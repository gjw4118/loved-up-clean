# Final Setup Steps - Almost Done! 🚀

## ✅ **What's Already Done**

1. ✅ **Edge Functions Deployed** - All 3 functions live on Supabase:
   - `coach-ai` - GPT-4 coaching logic
   - `speech-to-text` - Whisper transcription
   - `text-to-speech` - ElevenLabs/OpenAI voice synthesis

2. ✅ **Coach Tables Migration** - SQL file ready in `supabase/migrations/20251018110458_add_coach_tables.sql`

3. ✅ **Environment Template** - Updated with all required keys

---

## 🔧 **3 Quick Steps to Finish**

### Step 1: Set Supabase Secrets (5 minutes)

You have the keys in your `.env.local` file. Now add them to Supabase:

**Option A - Via Dashboard (Easiest):**
1. Go to: https://supabase.com/dashboard/project/rikiuncwcwzmkbboaplj/settings/functions
2. Click "Add secret"
3. Add these two secrets:
   ```
   Name: OPENAI_API_KEY
   Value: [your key from .env.local]
   
   Name: ELEVENLABS_API_KEY  
   Value: [your key from .env.local]
   ```

**Option B - Via CLI:**
```bash
# Get your keys from .env.local, then:
supabase secrets set OPENAI_API_KEY=sk-your-openai-key
supabase secrets set ELEVENLABS_API_KEY=your-elevenlabs-key
```

---

### Step 2: Apply Coach Tables Migration (2 minutes)

**Via Supabase Dashboard (Recommended):**
1. Go to: https://supabase.com/dashboard/project/rikiuncwcwzmkbboaplj/editor
2. Click "SQL Editor" in left sidebar
3. Click "New query"
4. Copy the entire contents of: `supabase/migrations/20251018110458_add_coach_tables.sql`
5. Paste and click "Run"
6. Should see: "Success. No rows returned"

**What this creates:**
- `coach_sessions` table (stores voice sessions)
- `coach_topics` table (tracks conversation topics)
- Row Level Security policies
- Indexes for performance

---

### Step 3: RevenueCat Setup (30-45 minutes)

**You're doing this part!** Full guide in `PREMIUM_FEATURES_SETUP.md`

**Quick checklist:**
- [ ] Create RevenueCat account
- [ ] Add iOS app with Bundle ID
- [ ] Create products (monthly/annual/lifetime)
- [ ] Create "premium" entitlement
- [ ] Create "default" offering
- [ ] Get iOS API key
- [ ] Add to `.env.local`: `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_...`
- [ ] Create matching products in App Store Connect
- [ ] Test with sandbox account

---

## 🧪 **Testing the Coach**

After completing Steps 1-2 above:

1. **Restart your Expo dev server** (to pick up new functions)
   ```bash
   # Kill the current server (Ctrl+C) then:
   npx expo start --clear
   ```

2. **Test the Coach:**
   - Open app → Go to Coach tab
   - Tap "Start Voice Session"
   - Grant microphone permission
   - Speak something like: "How can I improve communication with my partner?"
   - Should hear AI response back!

3. **Check for errors:**
   - If it fails, check Supabase Dashboard → Functions → Logs
   - Look for any errors related to missing API keys

---

## 🎯 **Current Status**

| Feature | Status |
|---------|--------|
| Edge Functions | ✅ Deployed |
| Database Schema | ⚠️ Needs Step 2 |
| API Keys | ⚠️ Needs Step 1 |
| RevenueCat | ⏳ Your Step 3 |

---

## 📱 **After Everything Works**

1. **Remove dev bypass** in `.env.local`:
   ```bash
   EXPO_PUBLIC_BYPASS_PREMIUM=false
   ```

2. **Test premium flow:**
   - Coach should show paywall
   - Purchase should unlock access
   - Restore purchases should work

3. **Build for TestFlight:**
   ```bash
   eas build --profile production --platform ios
   ```

---

## 🆘 **Troubleshooting**

**Coach says "Failed to process":**
- Check Supabase secrets are set (Step 1)
- Check Function logs for errors

**"Table doesn't exist" error:**
- Run Step 2 migration

**Premium always shows paywall:**
- Check RevenueCat API key in `.env.local`
- Verify purchases in RevenueCat dashboard

**Voice doesn't play:**
- Check ELEVENLABS_API_KEY is set
- Check phone volume is up
- Check speaker mode toggle (top right when active)

---

## 🎉 **You're Almost There!**

Just 3 quick steps and the Coach will be fully functional!

**Time estimate:**
- Step 1 (Secrets): 5 minutes ⏱️
- Step 2 (Migration): 2 minutes ⏱️
- Step 3 (RevenueCat): 30-45 minutes ⏱️

**Total: ~40-50 minutes to fully functional premium app!** 🚀

