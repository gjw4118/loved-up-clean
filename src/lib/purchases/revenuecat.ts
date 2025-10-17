// RevenueCat SDK Configuration
// Handles in-app purchases and subscriptions

import { ENV } from '@/config/env';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';

// Product IDs for premium subscriptions
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly',
  PREMIUM_LIFETIME: 'premium_lifetime',
} as const;

// Entitlement IDs (configured in RevenueCat dashboard)
export const ENTITLEMENTS = {
  PREMIUM: 'premium',
} as const;

let isConfigured = false;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts, after user authentication
 */
export async function initializeRevenueCat(userId?: string): Promise<void> {
  try {
    // Don't initialize if no API key is set (future feature not enabled yet)
    if (!ENV.REVENUECAT_API_KEY || ENV.REVENUECAT_API_KEY === 'your-revenuecat-api-key') {
      console.log('RevenueCat: Not configured (feature not enabled yet)');
      return;
    }

    if (isConfigured) {
      console.log('RevenueCat: Already configured');
      return;
    }

    // Configure debug logging in development
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    // Configure RevenueCat with API key
    await Purchases.configure({
      apiKey: ENV.REVENUECAT_API_KEY,
      appUserID: userId, // Optional: link purchases to your user ID
    });

    isConfigured = true;
    console.log('RevenueCat: Successfully configured');

    // If user ID is provided, identify the user
    if (userId) {
      await identifyUser(userId);
    }
  } catch (error) {
    console.error('RevenueCat: Failed to initialize:', error);
    throw error;
  }
}

/**
 * Identify/login user with RevenueCat
 * Links purchases to your user's account
 */
export async function identifyUser(userId: string): Promise<void> {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('RevenueCat: User identified', customerInfo.originalAppUserId);
    return;
  } catch (error) {
    console.error('RevenueCat: Failed to identify user:', error);
    throw error;
  }
}

/**
 * Logout user from RevenueCat
 * Call this when user signs out
 */
export async function logoutRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
    console.log('RevenueCat: User logged out');
  } catch (error) {
    console.error('RevenueCat: Failed to logout:', error);
    throw error;
  }
}

/**
 * Get current customer info and entitlements
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('RevenueCat: Failed to get customer info:', error);
    throw error;
  }
}

/**
 * Check if user has premium access
 */
export async function isPremiumUser(): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();
    const hasPremium = customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM] !== undefined;
    return hasPremium;
  } catch (error) {
    console.error('RevenueCat: Failed to check premium status:', error);
    return false;
  }
}

/**
 * Get available offerings/packages
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      return offerings.current;
    }
    console.warn('RevenueCat: No current offering available');
    return null;
  } catch (error) {
    console.error('RevenueCat: Failed to get offerings:', error);
    throw error;
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(
  packageToPurchase: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; productIdentifier: string }> {
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage(packageToPurchase);
    console.log('RevenueCat: Purchase successful', productIdentifier);
    return { customerInfo, productIdentifier };
  } catch (error: any) {
    // User cancelled purchase
    if (error.userCancelled) {
      console.log('RevenueCat: Purchase cancelled by user');
      throw new Error('Purchase cancelled');
    }
    console.error('RevenueCat: Purchase failed:', error);
    throw error;
  }
}

/**
 * Restore previous purchases
 * Required by Apple for apps with purchases
 */
export async function restorePurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('RevenueCat: Purchases restored');
    return customerInfo;
  } catch (error) {
    console.error('RevenueCat: Failed to restore purchases:', error);
    throw error;
  }
}

/**
 * Sync purchases with RevenueCat
 * Useful after App Store purchase or subscription changes
 */
export async function syncPurchases(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.syncPurchases();
    console.log('RevenueCat: Purchases synced');
    return customerInfo;
  } catch (error) {
    console.error('RevenueCat: Failed to sync purchases:', error);
    throw error;
  }
}

/**
 * Get product information
 */
export async function getProducts(productIds: string[]): Promise<any[]> {
  try {
    const products = await Purchases.getProducts(productIds);
    return products;
  } catch (error) {
    console.error('RevenueCat: Failed to get products:', error);
    throw error;
  }
}

// Export types for convenience
export type { CustomerInfo, PurchasesOffering, PurchasesPackage };

