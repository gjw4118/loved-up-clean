# Question Sharing Feature - Setup Guide

## Overview

The question sharing feature allows users to share questions one-on-one via native share sheets. Recipients receive deep links that open the app directly to answer the question.

## Features Implemented

✅ **Long Press to Share** - Long press on any question card to trigger native share sheet
✅ **Deep Linking** - URLs like `godeeperapp://question/{threadId}` open directly in app
✅ **Us Tab** - New middle tab showing all shared conversations
✅ **Thread Detail** - View questions and responses, with response input for recipients
✅ **Database Schema** - Tables for threads and responses with RLS policies
✅ **Real-time Updates** - React Query integration for live data

## How It Works

### 1. Sharing a Question (Sender)

1. User browses questions in any deck
2. Long press on a card (500ms) triggers haptic feedback
3. Action sheet appears with "Share Question" option
4. Native share sheet opens with pre-filled message
5. Thread created in database with status='pending'
6. Recipient receives link via chosen channel (Messages, WhatsApp, etc.)

### 2. Receiving a Question (Recipient)

1. Recipient taps link: `godeeperapp://question/{threadId}`
2. App opens (or prompts to install if not present)
3. If not authenticated, saved for post-login redirect
4. Thread screen shows question with response input
5. Recipient types response (max 1000 chars)
6. Response saved, thread status updates to 'answered'
7. Sender sees response in "Us" tab

### 3. Viewing Conversations (Us Tab)

- Middle tab shows all threads (sent and received)
- Status badges: "Waiting" (sent, pending), "New" (received, pending), "Answered"
- Tap to view full thread details
- Pull to refresh

## Database Schema

### `question_threads`
- `id` - UUID primary key
- `question_id` - Reference to questions table
- `sender_id` - User who shared the question
- `recipient_id` - User who received (set when they respond)
- `recipient_contact` - Email/phone (optional, for future contact matching)
- `status` - 'pending' or 'answered'
- `created_at`, `updated_at`

### `question_responses`
- `id` - UUID primary key  
- `thread_id` - Reference to thread
- `responder_id` - User who responded
- `response_text` - Text response (max 1000 chars)
- `created_at`

### RLS Policies
- Users can only view threads where they are sender or recipient
- Only senders can create threads
- Only recipients can create responses

## Universal Links Setup (Required for Production)

For Universal Links to work (https://godeeper.app/question/...), you need to:

### 1. Create Apple App Site Association File

Create `/.well-known/apple-app-site-association` on your domain:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.lovedup.app",
        "paths": [
          "/question/*"
        ]
      }
    ]
  }
}
```

Replace `TEAM_ID` with your Apple Team ID.

### 2. Host the File

- Upload to `https://godeeper.app/.well-known/apple-app-site-association`
- **Important**: Must be served with `Content-Type: application/json`
- No file extension
- Must be accessible via HTTPS

### 3. Android Setup

Create `/assetlinks.json` on your domain:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.lovedup.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

Get your SHA256 fingerprint:
```bash
keytool -list -v -keystore your-key.keystore
```

### 4. Verify Setup

**iOS:**
```bash
# Test Universal Links
curl -v https://godeeper.app/.well-known/apple-app-site-association
```

**Android:**
```bash
# Test App Links  
curl -v https://godeeper.app/.well-known/assetlinks.json
```

## Testing Locally

### Without Universal Links (Current Setup)

Deep links work immediately with custom scheme:
```
godeeperapp://question/123e4567-e89b-12d3-a456-426614174000
```

Test in simulator:
```bash
# iOS
xcrun simctl openurl booted "godeeperapp://question/YOUR_THREAD_ID"

# Android
adb shell am start -W -a android.intent.action.VIEW -d "godeeperapp://question/YOUR_THREAD_ID"
```

### With Universal Links (After Setup)

Web URLs will also work:
```
https://godeeper.app/question/123e4567-e89b-12d3-a456-426614174000
```

## Migration

Run the migration to create tables:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually via Supabase dashboard
# SQL Editor > New Query > Paste migration file content
```

## Key Files

**Migration:**
- `supabase/migrations/20251019000000_add_question_sharing.sql`

**Types:**
- `src/types/sharing.ts`
- `src/types/database.ts` (updated)

**Hooks:**
- `src/hooks/useShareQuestion.ts`
- `src/hooks/useSharedQuestions.ts`
- `src/hooks/useQuestionThread.ts`

**Screens:**
- `src/app/(tabs)/us.tsx`
- `src/app/threads/[threadId].tsx`

**Components:**
- `src/components/cards/QuestionCardStack.tsx` (updated with long press)

**Utils:**
- `src/utils/sharing/generateShareLink.ts`
- `src/utils/sharing/parseShareLink.ts`
- `src/lib/linking/deepLinkHandler.ts`

**Config:**
- `app.json` (updated with deep link config)

## Next Steps / Future Enhancements

- [ ] Push notifications when question received/answered
- [ ] Support for media responses (voice/video)
- [ ] Group question sharing (multiple recipients)
- [ ] Question templates for common scenarios
- [ ] Analytics dashboard for shared questions
- [ ] In-app contacts integration
- [ ] Reminder notifications for unanswered questions

## Troubleshooting

**Deep links not working:**
- Verify URL scheme in app.json
- Check that app is installed and authorized
- Test with terminal commands first

**Universal Links not working:**
- Verify AASA file is accessible
- Check Content-Type header
- Ensure HTTPS (not HTTP)
- Try clearing iOS app cache

**Threads not appearing in Us tab:**
- Check RLS policies in Supabase
- Verify user authentication
- Check network requests in React Query DevTools

**Can't submit response:**
- Verify user is recipient (not sender)
- Check thread status is 'pending'
- Verify text length is under 1000 chars
- Check Supabase permissions

## Support

For issues or questions, check:
- Expo Linking docs: https://docs.expo.dev/guides/linking/
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- React Query: https://tanstack.com/query/latest

