// RevenueCat Integration for GoDeeper
// Handles subscription management and premium feature access

import { Platform } from 'react-native';
import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesOfferings,
} from 'react-native-purchases';

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';
const PREMIUM_ENTITLEMENT = process.env.EXPO_PUBLIC_PREMIUM_ENTITLEMENT || 'premium';

// Development bypass flag
const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const BYPASS_PREMIUM = process.env.EXPO_PUBLIC_BYPASS_PREMIUM === 'true';

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export const initializeRevenueCat = async (userId?: string): Promise<void> => {
  // Skip if already initialized
  if (isInitialized) {
    console.log('🔒 RevenueCat already initialized');
    return;
  }

  // Development mode bypass
  if (DEV_MODE && BYPASS_PREMIUM) {
    console.log('🔧 Development mode: Bypassing RevenueCat initialization');
    isInitialized = true;
    return;
  }

  try {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    if (!apiKey) {
      console.warn('⚠️ RevenueCat API key not configured - premium features will not work');
      return;
    }

    console.log('🔒 Initializing RevenueCat with key:', apiKey.substring(0, 10) + '...');

    // Configure SDK
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    
    await Purchases.configure({
      apiKey,
      appUserID: userId, // Optional: set user ID for tracking
    });

    isInitialized = true;
    console.log('✅ RevenueCat initialized successfully');

    // Log current customer info
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('💳 Customer info loaded:', {
      entitlements: Object.keys(customerInfo.entitlements.active),
      originalAppUserId: customerInfo.originalAppUserId,
    });
  } catch (error) {
    console.error('❌ RevenueCat initialization error:', error);
    // Don't throw - just log and continue without premium features
    isInitialized = false;
  }
};

/**
 * Check if user has premium access
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  // Development mode bypass
  if (DEV_MODE && BYPASS_PREMIUM) {
    console.log('🔧 Development mode: Granting premium access');
    return true;
  }

  if (!isInitialized) {
    console.warn('⚠️ RevenueCat not initialized');
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
    
    console.log('💎 Premium status:', isPremium);
    return isPremium;
  } catch (error) {
    console.error('❌ Error checking premium status:', error);
    return false;
  }
};

/**
 * Get available offerings (subscription packages)
 */
export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  if (!isInitialized) {
    console.warn('⚠️ RevenueCat not initialized');
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    console.log('📦 Offerings loaded:', {
      current: offerings.current?.identifier,
      packages: offerings.current?.availablePackages.map(p => ({
        identifier: p.identifier,
        product: p.product.identifier,
        price: p.product.priceString,
      })),
    });
    return offerings;
  } catch (error) {
    console.error('❌ Error fetching offerings:', error);
    return null;
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  packageToPurchase: any
): Promise<{ customerInfo: CustomerInfo; success: boolean }> => {
  if (!isInitialized) {
    throw new Error('RevenueCat not initialized');
  }

  try {
    console.log('💳 Attempting purchase:', packageToPurchase.identifier);
    
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
    
    console.log('✅ Purchase successful:', {
      isPremium,
      lookingFor: PREMIUM_ENTITLEMENT,
      activeEntitlements: Object.keys(customerInfo.entitlements.active),
      allEntitlements: Object.keys(customerInfo.entitlements.all),
    });

    if (!isPremium && Object.keys(customerInfo.entitlements.active).length === 0) {
      console.warn('⚠️ No entitlements found! Check RevenueCat Dashboard:');
      console.warn('1. Go to: https://app.revenuecat.com/entitlements');
      console.warn('2. Create or verify "premium" entitlement exists');
      console.warn('3. Link product "deeper_premium" to "premium" entitlement');
      console.warn('4. Make sure entitlement is marked as "Current"');
    }

    return { customerInfo, success: isPremium };
  } catch (error: any) {
    // User cancelled
    if (error.userCancelled) {
      console.log('ℹ️ User cancelled purchase');
      throw new Error('USER_CANCELLED');
    }

    console.error('❌ Purchase error:', error);
    throw error;
  }
};

/**
 * Restore purchases (for users who reinstalled or switched devices)
 */
export const restorePurchases = async (): Promise<CustomerInfo> => {
  if (!isInitialized) {
    throw new Error('RevenueCat not initialized');
  }

  try {
    console.log('🔄 Restoring purchases...');
    const customerInfo = await Purchases.restorePurchases();
    
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
    console.log('✅ Purchases restored:', {
      isPremium,
      entitlements: Object.keys(customerInfo.entitlements.active),
    });

    return customerInfo;
  } catch (error) {
    console.error('❌ Error restoring purchases:', error);
    throw error;
  }
};

/**
 * Get customer info (current subscription status)
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  // Development mode bypass
  if (DEV_MODE && BYPASS_PREMIUM) {
    return null; // Return null but premium will be granted via dev flag
  }

  if (!isInitialized) {
    console.warn('⚠️ RevenueCat not initialized');
    return null;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('❌ Error getting customer info:', error);
    return null;
  }
};

/**
 * Identify user (call after authentication)
 */
export const identifyUser = async (userId: string): Promise<void> => {
  // Development mode bypass
  if (DEV_MODE && BYPASS_PREMIUM) {
    console.log('🔧 Development mode: Skipping user identification');
    return;
  }

  if (!isInitialized) {
    console.warn('⚠️ RevenueCat not initialized - skipping user identification');
    return;
  }

  try {
    await Purchases.logIn(userId);
    console.log('✅ User identified:', userId);
  } catch (error) {
    console.error('❌ Error identifying user:', error);
    // Don't throw - just log and continue
  }
};

/**
 * Log out user
 */
export const logoutUser = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    await Purchases.logOut();
    console.log('✅ User logged out from RevenueCat');
  } catch (error) {
    console.error('❌ Error logging out:', error);
  }
};
