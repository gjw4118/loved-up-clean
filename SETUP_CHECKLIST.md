# GoDeeper Setup Checklist
## Final Steps to Make App Fully Functional

---

## ✅ Completed
- [x] RevenueCat SDK installed
- [x] Premium features code integrated
- [x] Coach feature implemented
- [x] All code committed to main branch
- [x] Database migrations created
- [x] Edge functions created
- [x] Navigation restructured (Decks | Us | Coach | More)
- [x] Question sharing implemented
- [x] Native rebuild completed

---

## 🔧 To Do

### 1. RevenueCat Setup
**What:** Configure in-app purchases and subscriptions
**Priority:** High (required for premium features)

**Steps:**
1. Create account at https://app.revenuecat.com
2. Add iOS app with your Bundle ID
3. Create products:
   - `godeeper_premium_monthly` - $9.99/month
   - `godeeper_premium_annual` - $79.99/year (save 33%)
   - `godeeper_premium_lifetime` - $199.99 one-time (optional)
4. Create "premium" entitlement and attach products
5. Create "default" offering with all products
6. Get iOS API key (starts with `appl_`)
7. Add to `.env.local`:
   ```
   EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_your_key_here
   ```
8. Create matching products in App Store Connect
9. Test with sandbox account

**Full guide:** `PREMIUM_FEATURES_SETUP.md`

---

### 2. OpenAI API Key
**What:** Required for AI Coach (Speech-to-Text & GPT-4)
**Priority:** High (Coach won't work without it)

**Steps:**
1. Get key from https://platform.openai.com/api-keys
2. Add to Supabase secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-your-key-here
   ```
3. Or add via Supabase Dashboard → Project Settings → Edge Functions → Secrets

**Cost:** ~$0.01-0.05 per voice session (Whisper STT + GPT-4)

---

### 3. ElevenLabs API Key (Optional)
**What:** Premium text-to-speech voices
**Priority:** Low (falls back to OpenAI TTS if not set)

**Steps:**
1. Get key from https://elevenlabs.io/app/settings/api-keys
2. Add to Supabase secrets:
   ```bash
   supabase secrets set ELEVENLABS_API_KEY=your-key-here
   ```

**Cost:** ~$0.30 per 1000 characters (premium voices)

---

### 4. Deploy Supabase Edge Functions
**What:** Backend AI processing for Coach
**Priority:** High (Coach won't work without these)

**Steps:**
```bash
cd supabase

# Deploy all coach functions
supabase functions deploy coach-ai
supabase functions deploy speech-to-text
supabase functions deploy text-to-speech
```

**Verify:** Check Supabase Dashboard → Edge Functions → should see 3 functions deployed

---

### 5. Apply Coach Database Migration
**What:** Create coach_sessions and coach_topics tables
**Priority:** Medium (Coach will error without these)

**Option A - Via Dashboard:**
1. Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20251018110458_add_coach_tables.sql`
3. Run it

**Option B - Via CLI:**
```bash
supabase db push
```

---

### 6. Create Audio Storage Bucket
**What:** Store recorded audio files
**Priority:** Medium (Coach can work without it but better with)

**Steps:**
1. Supabase Dashboard → Storage → Create bucket
2. Name: `audio`
3. Make it public
4. Done!

---

### 7. Update Environment Variables
**What:** Make sure all keys are in place
**Priority:** High

**Check `.env.local` has:**
```bash
# Supabase (already set)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# RevenueCat (TO ADD)
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_your_key_here

# Premium entitlement name
EXPO_PUBLIC_PREMIUM_ENTITLEMENT=premium

# Development flags (remove in production)
EXPO_PUBLIC_DEV_MODE=true
EXPO_PUBLIC_BYPASS_PREMIUM=true  # ⚠️ REMOVE IN PRODUCTION
```

---

### 8. Remove Development Bypasses (Before Production)
**What:** Disable dev-only features
**Priority:** Critical before release

**In `.env.local`:**
```bash
# Change these:
EXPO_PUBLIC_DEV_MODE=false
EXPO_PUBLIC_BYPASS_PREMIUM=false  # Force real premium checks
```

---

## 🧪 Testing Checklist

Before releasing to users:

### Premium Features
- [ ] Open Coach → see "PREMIUM" badge
- [ ] Tap start → see paywall (if not premium)
- [ ] Purchase subscription → immediate access
- [ ] Close app, reopen → still premium
- [ ] Try "Restore Purchases" → works

### Coach Feature
- [ ] Grant microphone permission
- [ ] Record voice → see waveform
- [ ] Stop recording → AI responds with voice
- [ ] Suggested questions → tap one → starts session
- [ ] End session → returns to start screen
- [ ] Multiple back-and-forth exchanges → works

### Question Sharing
- [ ] Long press on question → share menu opens
- [ ] Send to someone → they receive link
- [ ] Tap link → opens app to question
- [ ] Respond to shared question → sender sees it
- [ ] "Us" screen → shows all threads

### General
- [ ] All 4 tabs work (Decks, Us, Coach, More)
- [ ] Dark mode toggle works
- [ ] Navigation flows smoothly
- [ ] No crashes or errors

---

## 📱 Production Deployment

When everything works:

1. **Update version** in `app.json`:
   ```json
   "version": "1.1.0",
   "ios": {
     "buildNumber": "2"
   }
   ```

2. **Remove dev bypasses** (see step 8 above)

3. **Build for TestFlight:**
   ```bash
   eas build --profile production --platform ios
   ```

4. **Submit to App Store** when ready

---

## 💰 Premium Feature Summary

| Feature | Free | Premium |
|---------|------|---------|
| Standard questions | ✅ | ✅ |
| All main decks | ✅ | ✅ |
| Question sharing | ✅ | ✅ |
| **Spice questions** | ❌ | ✅ |
| **Deeper levels** | ❌ | ✅ |
| **AI Coach** | ❌ | ✅ |

---

## 📞 Support

**RevenueCat Issues:** https://docs.revenuecat.com  
**Supabase Issues:** https://supabase.com/docs  
**OpenAI Issues:** https://platform.openai.com/docs

---

## ⏱️ Estimated Time to Complete

- RevenueCat setup: **30-45 minutes**
- OpenAI API key: **5 minutes**
- Deploy Edge Functions: **5 minutes**
- Database migration: **2 minutes**
- Storage bucket: **2 minutes**
- Testing: **30 minutes**

**Total: ~1.5-2 hours** to fully functional premium app! 🚀

---

**Current Status:** All code complete ✅  
**Next Step:** RevenueCat setup (#1)  
**When Ready:** See `PREMIUM_FEATURES_SETUP.md` for detailed RevenueCat guide

