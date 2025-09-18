# Supabase Authentication & RevenueCat Setup Guide

## Overview
This app now uses Apple Sign-In only with Supabase authentication and RevenueCat for premium subscriptions.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# RevenueCat Configuration
EXPO_PUBLIC_RC_API_KEY=your_revenuecat_api_key_here
EXPO_PUBLIC_RC_SUBSCRIPTION_NAME=pro
```

## Supabase Setup

1. **Create a Supabase project** at https://supabase.com
2. **Enable Apple Sign-In** in Authentication > Providers
3. **Configure Apple Sign-In**:
   - Add your Apple Service ID
   - Configure the redirect URL
   - Add your Apple Team ID and Key ID

## RevenueCat Setup

1. **Create a RevenueCat account** at https://app.revenuecat.com
2. **Create a new project** and add your iOS app
3. **Configure products**:
   - Create a "pro" entitlement
   - Add monthly and annual subscription products
   - Configure the products in App Store Connect
4. **Get your API key** from Project Settings > API Keys

## Apple Developer Setup

1. **Enable Sign In with Apple** capability in your app
2. **Create a Service ID** for Sign In with Apple
3. **Configure the Service ID** with your app's bundle identifier
4. **Add the Service ID** to your Supabase project's Apple provider settings

## Features Implemented

### Authentication
- ✅ Apple Sign-In only (Google Sign-In removed)
- ✅ HeroUI Pro authentication screen design
- ✅ Supabase integration for user management
- ✅ Automatic profile creation with Apple data

### Premium Features
- ✅ RevenueCat SDK integration
- ✅ HeroUI Pro paywall modal design
- ✅ Premium upgrade triggers:
  - Premium button on main screen
  - Deck completion (after 5 free questions)
  - Spice deck access
- ✅ Premium status synchronization with Supabase
- ✅ Automatic premium status updates

### Paywall Triggers
1. **Premium Button**: Main screen upgrade button
2. **Deck Completion**: After completing 5 free questions
3. **Spice Deck Access**: When trying to access premium-only deck

## Testing

1. **Test Apple Sign-In**: Ensure it works on physical device (not simulator)
2. **Test RevenueCat**: Use sandbox environment for testing purchases
3. **Test Premium Flow**: Verify premium status updates correctly after purchase

## Notes

- Apple Sign-In requires a physical device for testing
- RevenueCat sandbox purchases don't charge real money
- Premium status is automatically synced between RevenueCat and Supabase
- The app gracefully handles missing environment variables
