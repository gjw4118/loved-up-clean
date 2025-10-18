# Premium Features Setup Guide
## GoDeeper App - RevenueCat Integration

## Overview

This guide covers setting up premium features with RevenueCat for:
1. ✨ Spice questions (intimate content)
2. 🎯 Deeper question levels access
3. 🎙️ Coach functionality (AI relationship coaching)

---

## Phase 1: RevenueCat Setup (Do First)

### 1.1 Create RevenueCat Account
1. Go to https://app.revenuecat.com/signup
2. Create a new project called "GoDeeper"
3. Note your API keys (you'll need these)

### 1.2 Configure iOS App in RevenueCat
1. In RevenueCat Dashboard → Apps → Add App
2. Choose iOS
3. Enter your Bundle ID: `com.yourcompany.godeeper` (from app.json)
4. Add your App Store Connect App-Specific Shared Secret
   - Get this from App Store Connect → Your App → App Information

### 1.3 Create Products in RevenueCat
Go to RevenueCat → Products and create:

**Product 1: Monthly Subscription**
- Product ID: `godeeper_premium_monthly`
- Display Name: "Premium Monthly"
- Price: $9.99/month
- Description: "Full access to Spice questions, deeper levels, and AI coach"

**Product 2: Annual Subscription** (Recommended)
- Product ID: `godeeper_premium_annual`
- Display Name: "Premium Annual"
- Price: $79.99/year (save 33%)
- Description: "Full access + save 33% vs monthly"

**Product 3: Lifetime** (Optional)
- Product ID: `godeeper_premium_lifetime`
- Display Name: "Premium Lifetime"
- Price: $199.99 one-time
- Description: "Unlock everything forever"

### 1.4 Create Entitlements
1. RevenueCat → Entitlements → Create Entitlement
2. Name: `premium`
3. Attach all three products to this entitlement

### 1.5 Create Offering
1. RevenueCat → Offerings → Create Offering
2. Identifier: `default`
3. Add all products
4. Set annual as "default" (recommended to users)

### 1.6 Set Up App Store Connect Products
For each product in RevenueCat, create matching products in App Store Connect:
1. App Store Connect → Your App → In-App Purchases
2. Click "+" to create subscription
3. Match the Product ID exactly (e.g., `godeeper_premium_monthly`)
4. Set pricing and billing period
5. Add localizations and descriptions
6. Submit for review

---

## Phase 2: Environment Configuration

### 2.1 Get Your API Keys
From RevenueCat Dashboard → Settings → API Keys:
- **Public API Key** (iOS) - starts with `appl_`
- Copy this key

### 2.2 Add to .env.local
```bash
# RevenueCat Configuration
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_your_key_here
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_your_key_here  # For future Android support

# Premium Feature IDs
EXPO_PUBLIC_PREMIUM_ENTITLEMENT=premium
```

---

## Phase 3: Code Implementation (Already Set Up)

### 3.1 Files Created
✅ `src/lib/purchases/revenuecat.ts` - RevenueCat initialization
✅ `src/hooks/usePremiumStatus.ts` - Premium status hook
✅ `src/hooks/usePaywall.ts` - Paywall presentation hook
✅ `src/components/ui/Paywall.tsx` - Paywall UI component

### 3.2 Premium Feature Gates

**Spice Questions (Already Implemented)**
- File: `src/app/(tabs)/index.tsx`
- Gate: Checks `deck.isPremium` and shows paywall if not premium

**Deeper Questions (To Implement)**
- File: `src/components/cards/QuestionCardStack.tsx`
- Add toggle for "Deeper" questions
- Gate: Check premium status before showing deeper questions

**Coach Feature (To Implement)**
- File: `src/app/(tabs)/coach.tsx`
- Gate: Check premium before allowing session start

---

## Phase 4: Testing

### 4.1 Sandbox Testing
1. Create sandbox tester in App Store Connect
2. Sign out of App Store on device
3. Test purchases with sandbox account
4. Verify RevenueCat receives events

### 4.2 Test Scenarios
- ✅ Free user tries to access Spice → sees paywall
- ✅ Free user tries deeper questions → sees paywall
- ✅ Free user tries Coach → sees paywall
- ✅ User purchases → immediate access to all features
- ✅ Subscription expires → features lock again

---

## Phase 5: Production Checklist

Before launching:
- [ ] All products created in App Store Connect
- [ ] Products submitted for review (can take 24-48 hours)
- [ ] RevenueCat webhook configured (optional, for analytics)
- [ ] Privacy policy updated to mention subscriptions
- [ ] Terms of service include subscription terms
- [ ] Tested with sandbox accounts
- [ ] Restore purchases functionality works
- [ ] Premium status persists across app restarts

---

## Current Status

### ✅ Completed
- RevenueCat SDK installed (`react-native-purchases`)
- Environment variables structured
- Premium status hook created
- Paywall hook created
- Spice deck already gated

### 🔧 To Do
1. Add RevenueCat API keys to `.env.local`
2. Initialize RevenueCat in app root
3. Gate deeper questions toggle
4. Gate Coach feature
5. Create paywall UI component
6. Test with sandbox

---

## Premium Feature Matrix

| Feature | Free | Premium |
|---------|------|---------|
| Standard questions | ✅ | ✅ |
| Dating/Lovers/Family/Friends/Work/Growth decks | ✅ | ✅ |
| Spice questions | ❌ | ✅ |
| Deeper question levels | ❌ | ✅ |
| Coach (AI relationship coaching) | ❌ | ✅ |
| Question sharing | ✅ | ✅ |
| Profile customization | ✅ | ✅ |
| Resources (More tab) | ✅ | ✅ |

---

## Revenue Optimization Tips

### Pricing Strategy
- **Free tier**: Generous (all standard decks, sharing, resources)
- **Premium tier**: Clear value (intimate content + AI coach)
- **Trial**: Offer 7-day free trial on annual plan (increases conversions)

### Paywall Best Practices
1. Show value prop clearly ("Unlock deeper intimacy + AI coach")
2. Display annual savings prominently ("Save 33%")
3. Add testimonials or benefits list
4. Make free trial obvious if offered
5. "Restore Purchases" button for existing subscribers

### Conversion Optimization
- Show paywall after user shows interest (tries to open Spice)
- Don't show paywall immediately on app open
- Allow free features to demonstrate value first
- Use soft gates (preview locked content)

---

## Support & Troubleshooting

### Common Issues

**"No offerings found"**
- Ensure products are created in RevenueCat
- Check offering is set to "current"
- Wait 5-10 minutes after creating products

**"Unable to connect to iTunes Store"**
- Check sandbox account is signed in
- Ensure products are in App Store Connect
- Wait for products to sync (can take hours)

**Premium status not updating**
- Check RevenueCat initialization
- Verify API key is correct
- Check device has internet connection

### Testing Without Real Purchases
For development, we have a `EXPO_PUBLIC_BYPASS_PREMIUM=true` flag in `.env.local` that grants premium access without payment. Remove this in production!

---

## Next Steps

1. **Create RevenueCat account** and configure products
2. **Add API keys** to `.env.local`
3. **Implement premium gates** (I'll code this)
4. **Design paywall UI** (I'll create this)
5. **Test with sandbox**
6. **Deploy to TestFlight** with premium features
7. **Submit for App Store review**

Ready to proceed with implementation?

