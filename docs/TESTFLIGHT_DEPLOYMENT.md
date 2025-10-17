# GoDeeper - TestFlight & App Store Deployment Guide

Complete guide for deploying GoDeeper to TestFlight and submitting to the App Store.

## Prerequisites

✅ **Completed Requirements:**
- Apple Developer Account (Individual or Organization - $99/year)
- App Store Connect app created
- Supabase project configured and running
- User profiles migration applied
- Question data seeded (250+ questions)
- Legal documents hosted (Privacy Policy, Terms of Service)

## Step 1: Prepare App Store Connect

### 1.1 Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** GoDeeper
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.godeeper.app`
   - **SKU:** `godeeper-ios-2025`
   - **User Access:** Full Access

### 1.2 App Information

**Category:**
- Primary: Lifestyle
- Secondary: Social Networking

**Age Rating:** 17+
- Reasons: Infrequent/Mild Sexual Content or Nudity (Spice deck)

**App Privacy**:
- Privacy Policy URL: `https://YOUR_USERNAME.github.io/godeeper-legal/privacy-policy.html`
- User Privacy Choices URL: (same as above)

### 1.3 Configure App Information

**Subtitle:** "Meaningful Conversations"

**Description:**
```
GoDeeper helps you create meaningful connections through thoughtfully curated question decks. Whether you're with friends, family, or on a date, our questions spark conversations that matter.

🧡 FRIENDS - Fun social questions to deepen friendships
🏠 FAMILY - Connection questions for family bonds
💕 DATING - Questions for early relationships
🌱 GROWING - Career and personal growth conversations
🔥 SPICE - Intimate questions for couples (Premium)

FEATURES:
• 250+ carefully crafted questions
• 5 unique conversation decks
• Track your progress through each deck
• Beautiful, intuitive interface
• Save your favorite questions
• Share questions with friends

Perfect for:
- First dates and getting to know someone
- Family gatherings and reunions
- Friend hangouts and road trips
- Team building and networking
- Couples looking to deepen connection

Start meaningful conversations today with GoDeeper.
```

**Keywords:** (100 characters max)
```
questions,conversation,dating,relationships,connection,friends,family,intimacy,couples,social
```

**Promotional Text:** (170 characters max)
```
Transform ordinary moments into meaningful connections. 250+ thoughtful questions across 5 decks. Perfect for dates, friends, and family. Download free today!
```

## Step 2: Prepare Your Environment

### 2.1 Set Up EAS Secrets

```bash
# Required secrets for production builds
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"

# Optional (for future features)
eas secret:create --name EXPO_PUBLIC_REVENUECAT_API_KEY --value "your-rc-key"
```

### 2.2 Update eas.json

Update the submit section with your Apple account details:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

Find these values:
- **appleId**: Your Apple ID email
- **ascAppId**: From App Store Connect > App Information > Apple ID
- **appleTeamId**: From [Apple Developer Membership](https://developer.apple.com/account)

## Step 3: Database Setup

### 3.1 Apply Migrations

```bash
# Ensure all migrations are applied to production Supabase
# Check supabase/migrations/ folder
```

### 3.2 Seed Question Data

```bash
# Run the expanded seed script
npm run seed:expanded
```

Verify:
- ✅ 4-5 decks created
- ✅ 250+ questions loaded
- ✅ Questions distributed across decks

## Step 4: Host Legal Documents

### 4.1 Create GitHub Pages Site

1. Create a new repo: `godeeper-legal`
2. Copy files from `docs/legal/` to repo root
3. Enable GitHub Pages in repo settings
4. Verify URLs work:
   - Privacy Policy
   - Terms of Service

### 4.2 Update App with URLs

Update in:
- `src/components/auth/AuthScreen.tsx`
- `src/app/(tabs)/settings.tsx`

Replace `YOUR_USERNAME` with your GitHub username.

## Step 5: Test Locally

### 5.1 iOS Simulator Testing

```bash
npm run ios
```

Test all flows:
- ✅ Welcome screen → Auth → Home
- ✅ Sign in with Apple
- ✅ Browse decks
- ✅ View questions (may be limited without full data)
- ✅ Settings → Profile → Sign out
- ✅ Settings → Delete account (test in dev only!)

### 5.2 Device Testing (Optional)

```bash
# Build development client
eas build --profile development --platform ios

# Install on device via TestFlight or direct install
```

## Step 6: Create Preview Build (TestFlight)

### 6.1 Build for Preview

```bash
# Create preview build (internal distribution)
eas build --profile preview --platform ios
```

This will:
- Build with Release configuration
- Use preview environment variables
- Create IPA file for TestFlight
- Take ~15-30 minutes

### 6.2 Monitor Build

```bash
# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

## Step 7: Submit to TestFlight

### 7.1 Automatic Submission

```bash
# Submit the build to TestFlight (if auto-submit configured)
eas submit --platform ios --profile preview
```

Or manually:
1. Download IPA from EAS builds
2. Use [Transporter app](https://apps.apple.com/app/transporter/id1450874784)
3. Upload IPA to App Store Connect

### 7.2 Configure TestFlight

In App Store Connect > TestFlight:

**Test Information:**
- Beta App Description: (Same as app description)
- Feedback Email: your-email@example.com
- What to Test:
  ```
  Welcome to GoDeeper beta!

  Please test:
  1. Sign in with Apple
  2. Browse through different question decks
  3. Swipe/tap through questions
  4. Check if progress saves correctly
  5. Test Sign Out and Delete Account in Settings
  
  Focus areas:
  - Does navigation feel smooth?
  - Are questions loading properly?
  - Any crashes or bugs?
  
  Thank you for testing!
  ```

**Internal Testing:**
- Add internal testers (yourself, team members)
- They'll receive email invite
- Can start testing immediately after processing (~10 minutes)

**External Testing (Optional):**
- Add up to 10,000 external testers
- Requires App Review (1-2 days)
- Great for beta testing with real users

## Step 8: Internal Testing Phase

### 8.1 Test Checklist

Share this with testers:

**Authentication:**
- [ ] Sign in with Apple works
- [ ] Profile information displays correctly
- [ ] Sign out works

**Core Features:**
- [ ] All 5 decks visible on home screen
- [ ] Can open any deck
- [ ] Questions display correctly
- [ ] Swipe gestures work (if implemented)
- [ ] Progress tracking works
- [ ] Can favorite questions

**Settings:**
- [ ] Profile displays user info
- [ ] Privacy Policy link opens correctly
- [ ] Terms of Service link opens correctly
- [ ] Delete account shows confirmation
- [ ] Delete account works (careful!)

**Performance:**
- [ ] App launches in < 3 seconds
- [ ] No crashes during normal use
- [ ] Smooth animations
- [ ] Questions load quickly

### 8.2 Collect Feedback

Use TestFlight's built-in feedback or:
- Google Forms
- Slack channel
- Discord server
- Email

## Step 9: Fix Issues & Iterate

### 9.1 Common Issues to Address

**If questions don't load:**
- Check Supabase connection
- Verify RLS policies
- Check question seed script ran successfully

**If authentication fails:**
- Verify Apple Sign-In configuration
- Check Supabase auth settings
- Ensure user_profiles table exists

**If app crashes:**
- Check EAS build logs
- Review crash analytics in App Store Connect
- Test specific flows that cause crashes

### 9.2 Deploy Updates to TestFlight

```bash
# Build new version
eas build --profile preview --platform ios --auto-submit

# Version numbers auto-increment
```

Updates appear in TestFlight within 10-15 minutes (no review needed).

## Step 10: Production Release

### 10.1 Final Pre-Launch Checklist

- [ ] All TestFlight feedback addressed
- [ ] Core user flows tested and working
- [ ] No critical bugs
- [ ] Legal documents hosted and accessible
- [ ] Privacy manifest included
- [ ] App Store screenshots prepared
- [ ] App icons verified (all sizes)
- [ ] Age rating confirmed (17+)
- [ ] Pricing set (Free)

### 10.2 Prepare App Store Screenshots

Required sizes (iOS):
- **6.7" (iPhone 14 Pro Max):** 1290 x 2796 px
- **6.5" (iPhone 11 Pro Max):** 1284 x 2778 px
- **5.5" (iPhone 8 Plus):** 1242 x 2208 px

Minimum 3 screenshots, maximum 10.

**Screenshot Ideas:**
1. Welcome/onboarding screen with deck carousel
2. Deck selection screen
3. Question card (Friends deck)
4. Question card (Dating deck)
5. Settings/Profile screen

Tools:
- [Screely](https://www.screely.com/) - Add device frames
- [Mockuphone](https://mockuphone.com/) - Device mockups
- Figma - Design custom screenshots

### 10.3 Create Production Build

```bash
# Create production build
eas build --profile production --platform ios --auto-submit
```

### 10.4 Submit for App Review

In App Store Connect:

1. Go to your app → "App Store" tab
2. Click "+" to add new version
3. Enter version number: 1.0.0
4. Fill in "What's New in This Version":
   ```
   Welcome to GoDeeper!

   🎉 Initial release with:
   • 250+ thoughtfully curated questions
   • 5 unique conversation decks
   • Beautiful, intuitive interface
   • Progress tracking
   • Sign in with Apple

   Start meaningful conversations today!
   ```

5. **App Review Information:**
   - Contact Email: your-email@example.com
   - Contact Phone: +1-XXX-XXX-XXXX
   - Demo Account: Not needed (Apple Sign-In)
   - Notes:
     ```
     Thank you for reviewing GoDeeper!

     The app uses Apple Sign-In for authentication.
     All features are accessible after signing in.
     
     The Spice deck contains mature content (17+) but is clearly labeled.
     
     Privacy Policy: [URL]
     Terms of Service: [URL]
     ```

6. **Export Compliance:**
   - Uses encryption: NO (or YES if using HTTPS, but exempt)

7. Click "Submit for Review"

### 10.5 App Review Timeline

- **Review time:** 1-3 days typically
- **Approval:** App goes live automatically or manually
- **Rejection:** Address issues and resubmit

Common rejection reasons:
- Missing privacy policy
- Missing account deletion
- Inappropriate content not labeled
- Crashes or broken features
- Misleading screenshots

## Step 11: Post-Launch

### 11.1 Monitor Metrics

In App Store Connect → Analytics:
- App Units (downloads)
- Crashes
- Usage (sessions, retention)
- Ratings & Reviews

### 11.2 Respond to Reviews

- Respond to negative reviews professionally
- Thank positive reviews
- Address bugs reported in reviews

### 11.3 Plan Updates

**Version 1.1 (Future):**
- More questions per deck
- AI-generated questions (if enabled)
- Premium features (RevenueCat)
- Custom question creation
- Social features

## Quick Reference Commands

```bash
# Build for TestFlight (preview)
eas build --profile preview --platform ios --auto-submit

# Build for Production (App Store)
eas build --profile production --platform ios --auto-submit

# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Update app version
# Edit app.json → version: "1.0.1"
# Then rebuild

# Manage secrets
eas secret:list
eas secret:create --name KEY --value "value"
eas secret:delete --name KEY
```

## Troubleshooting

### Build Fails

```bash
# Check build logs
eas build:view [build-id]

# Common fixes:
# - Clear npm cache: npm cache clean --force
# - Update dependencies: npm update
# - Check eas.json configuration
```

### TestFlight Not Appearing

- Wait 10-15 minutes after upload
- Check email for processing notification
- Verify bundle ID matches
- Check App Store Connect for errors

### Review Rejection

1. Read rejection reason carefully
2. Address specific issues mentioned
3. Test thoroughly
4. Resubmit with explanation in Resolution Center

## Support Resources

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Need Help?

- Expo Forums: https://forums.expo.dev
- Expo Discord: https://chat.expo.dev
- Stack Overflow: Tag `expo` and `react-native`

---

**Good luck with your launch! 🚀**

