# Supabase Apple Sign-In Configuration Guide

Complete step-by-step guide to configure Apple Sign-In with Supabase for your iOS app.

## Prerequisites

- Active Apple Developer Account ($99/year)
- Supabase project created
- Xcode installed (for testing)
- Physical iOS device with iOS 13+ (Apple Sign-In requires real device)

---

## Step 1: Apple Developer Portal Setup

### 1.1 Enable Sign in with Apple Capability

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** from the sidebar
4. Find and select your **App ID** (e.g., `com.godeeper.app`)
5. Scroll down to **Sign in with Apple** capability
6. Check the box to enable it
7. Click **Save**

### 1.2 Create a Services ID

1. In Apple Developer Portal, go to **Identifiers**
2. Click the **+** button (top left)
3. Select **Services IDs** and click **Continue**
4. Fill in the form:
   - **Description**: `GoDeeper Sign In` (user-facing name)
   - **Identifier**: `com.godeeper.app.signin` (must be unique, can't be same as App ID)
5. Check **Sign in with Apple**
6. Click **Continue**, then **Register**

### 1.3 Configure Services ID

1. Click on the Services ID you just created
2. Check **Sign in with Apple**
3. Click **Configure** button next to it
4. In the configuration modal:
   - **Primary App ID**: Select your main App ID (`com.godeeper.app`)
   - **Domains and Subdomains**: Add your Supabase project domain
     ```
     <your-project-ref>.supabase.co
     ```
     Replace `<your-project-ref>` with your actual Supabase project reference ID
   - **Return URLs**: Add the Supabase callback URL
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
5. Click **Save**, then **Continue**, then **Save** again

### 1.4 Create a Private Key

1. In Apple Developer Portal, go to **Keys**
2. Click the **+** button (top left)
3. Fill in:
   - **Key Name**: `GoDeeper Sign In Key`
4. Check **Sign in with Apple**
5. Click **Configure** next to it
6. Select your **Primary App ID** (`com.godeeper.app`)
7. Click **Save**
8. Click **Continue**, then **Register**
9. **Download the key file** (`.p8` file) - **you can only download this once!**
10. Note down:
    - **Key ID** (displayed on the download page, e.g., `ABC123XYZ4`)
    - **Team ID** (in top right of Apple Developer Portal, e.g., `DEF456GHI7`)

**Important**: Store the `.p8` file securely. You cannot download it again.

---

## Step 2: Supabase Dashboard Configuration

### 2.1 Find Your Supabase Project Reference

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **General**
4. Find **Reference ID** under Project Settings
   - Example: `abcdefghijklmnopqrst`

### 2.2 Configure Apple Provider

1. In Supabase Dashboard, navigate to **Authentication** (left sidebar)
2. Click on **Providers** tab
3. Find **Apple** in the list and click to expand
4. Toggle **Enable Sign in with Apple** to ON
5. Fill in the required fields:

   **Services ID (Client ID)**
   ```
   com.godeeper.app.signin
   ```
   (The Services ID you created in Step 1.2)

   **Team ID**
   ```
   DEF456GHI7
   ```
   (Your Apple Developer Team ID from Step 1.4)

   **Key ID**
   ```
   ABC123XYZ4
   ```
   (The Key ID from Step 1.4)

   **Secret Key (Private Key)**
   - Open the `.p8` file you downloaded in Step 1.4 with a text editor
   - Copy the ENTIRE contents including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
   - Paste it into this field

6. **Redirect URL** should be automatically filled:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

7. Click **Save**

### 2.3 Verify Configuration

Supabase will validate your credentials. If there's an error:
- Double-check all IDs match exactly
- Ensure the `.p8` key content is complete
- Verify the Services ID matches what you created in Apple Developer Portal
- Confirm the return URL in Apple Developer Portal matches Supabase

---

## Step 3: App Configuration

### 3.1 Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these in **Supabase Dashboard** > **Settings** > **API**.

### 3.2 App Capabilities (Xcode)

1. Open your iOS project in Xcode (via `npx expo run:ios`)
2. Select your app target
3. Go to **Signing & Capabilities** tab
4. Click **+ Capability**
5. Add **Sign in with Apple**
6. Ensure your **Bundle Identifier** matches your App ID (`com.godeeper.app`)

### 3.3 Associated Domains (Optional but Recommended)

To enable seamless authentication:

1. In Xcode, under **Signing & Capabilities**
2. Click **+ Capability** and add **Associated Domains**
3. Add:
   ```
   webcredentials:<your-project-ref>.supabase.co
   ```

---

## Step 4: Testing

### 4.1 Pre-Testing Checklist

- [ ] Physical iOS device connected (iOS 13+)
- [ ] Device is signed in to an Apple ID
- [ ] App is built with development profile
- [ ] Supabase configuration saved
- [ ] Environment variables set correctly

### 4.2 Test Sign-In Flow

1. Build and run the app on your physical device:
   ```bash
   npx expo run:ios --device
   ```

2. Navigate to the authentication screen
3. Tap the **Continue with Apple** button
4. Complete Apple authentication:
   - Face ID / Touch ID / Passcode
   - Choose to share or hide email
   - Choose to share or hide name
5. App should navigate to the main screen after successful sign-in

### 4.3 Verify in Supabase

1. Go to **Supabase Dashboard** > **Authentication** > **Users**
2. You should see a new user with:
   - **Provider**: Apple
   - **Email**: User's Apple ID email (or private relay email)
   - **Created At**: Recent timestamp

3. Check **Table Editor** > **user_profiles**
4. Verify the user profile was created with Apple data

### 4.4 Test User Profile

In your app, the `signInWithApple` function automatically creates a user profile with:
- `user_id`: Supabase auth user ID
- `email`: User's email from Apple
- `first_name`: Given name (if shared)
- `last_name`: Family name (if shared)
- `display_name`: Full name (if available)

---

## Troubleshooting

### Common Issues

#### 1. "Invalid Client" Error

**Solution**: 
- Verify Services ID matches exactly in both Apple Portal and Supabase
- Check that return URLs match exactly
- Ensure domain is added to Apple Services ID configuration

#### 2. "Invalid Key" Error

**Solution**:
- Re-download the `.p8` key (if possible) or create a new one
- Ensure entire key content is copied including header/footer lines
- Verify Key ID matches the key you're using

#### 3. "User Creation Failed"

**Solution**:
- Check Supabase logs: **Supabase Dashboard** > **Logs** > **Auth Logs**
- Verify `user_profiles` table exists and has correct schema
- Check RLS policies allow user creation

#### 4. "Sign In Not Available"

**Solution**:
- Must test on physical iOS device (not simulator)
- Device must be running iOS 13 or later
- Device must be signed in to an Apple ID

#### 5. "Redirect URL Mismatch"

**Solution**:
- Ensure Apple Services ID return URL exactly matches: `https://<project-ref>.supabase.co/auth/v1/callback`
- No trailing slashes
- Use `https://` not `http://`

### Debug Mode

Enable debug logging in your app:

```typescript
// In src/lib/auth/supabase-auth.ts
console.log('Apple credential:', credential);
console.log('Supabase response:', data);
console.log('Error:', error);
```

View logs:
- **Xcode Console**: Shows real-time app logs
- **Supabase Dashboard** > **Logs** > **Auth Logs**: Shows authentication attempts
- **Supabase Dashboard** > **Logs** > **Database Logs**: Shows database operations

---

## Production Checklist

Before releasing to App Store:

- [ ] Test on multiple iOS devices (iPhone, iPad)
- [ ] Test with different Apple ID accounts
- [ ] Test email sharing (shared vs. hidden)
- [ ] Test name sharing (shared vs. hidden)
- [ ] Verify user profile creation works consistently
- [ ] Test sign-out and re-sign-in flow
- [ ] Verify privacy policy and terms links work
- [ ] Check that Supabase is on a paid plan (for production usage)
- [ ] Enable Apple Sign-In in your production App ID
- [ ] Update Services ID with production domains if needed
- [ ] Test with TestFlight before public release

---

## Security Best Practices

1. **Never commit `.p8` file** to version control
2. **Store Team ID and Key ID** in secure vault (1Password, etc.)
3. **Rotate keys periodically** (Apple recommends annually)
4. **Enable RLS policies** on Supabase tables
5. **Validate user data** server-side before saving
6. **Use HTTPS** for all API calls
7. **Implement rate limiting** on authentication endpoints
8. **Monitor auth logs** for suspicious activity

---

## Additional Resources

- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Apple Human Interface Guidelines - Sign in with Apple](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)

---

## Support

If you encounter issues:

1. Check Supabase Auth Logs for detailed error messages
2. Review Apple Developer Portal configuration
3. Test with a fresh Apple ID
4. Check [Supabase Discord](https://discord.supabase.com)
5. Review [Expo Forums](https://forums.expo.dev)

---

**Last Updated**: October 2025
**App Version**: 1.0.0
**Minimum iOS**: 13.0

