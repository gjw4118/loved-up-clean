// Paywall Hook with RevenueCat Integration

import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { getOfferings, purchasePackage, restorePurchases } from '@/lib/purchases/revenuecat';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export type PaywallTrigger = 
  | 'premium_button' 
  | 'deck_completion' 
  | 'spice_deck' 
  | 'coach_feature'
  | 'deeper_questions';

interface UsePaywallReturn {
  isPresenting: boolean;
  isPurchasing: boolean;
  presentPaywall: (trigger?: PaywallTrigger) => Promise<void>;
  purchaseProduct: (packageIdentifier: string) => Promise<boolean>;
  restore: () => Promise<boolean>;
  isPremium: boolean;
}

// Development mode bypass flag
const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const BYPASS_PREMIUM = process.env.EXPO_PUBLIC_BYPASS_PREMIUM === 'true';

export const usePaywall = (): UsePaywallReturn => {
  const [isPresenting, setIsPresenting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { isPremium, refetch } = usePremiumStatus();

  const presentPaywall = useCallback(async (trigger: PaywallTrigger = 'premium_button') => {
    // Don't show paywall if user is already premium
    if (isPremium) {
      console.log('ℹ️ User already has premium access');
      return;
    }

    // Development mode: show simple alert
    if (DEV_MODE && BYPASS_PREMIUM) {
      Alert.alert(
        'Premium Feature',
        'This is a premium feature. In production, this would show the paywall with pricing options.\n\nDevelopment mode: Premium access granted automatically.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsPresenting(true);
      console.log('💳 Presenting paywall for trigger:', trigger);

      // Get available offerings
      const offerings = await getOfferings();
      
      if (!offerings || !offerings.current) {
        throw new Error('No offerings available');
      }

      const packages = offerings.current.availablePackages;
      
      if (packages.length === 0) {
        throw new Error('No packages available');
      }

      // For now, show a simple alert with package options
      // TODO: Create a proper paywall UI component
      const packageNames = packages.map((pkg, index) => 
        `${index + 1}. ${pkg.product.title} - ${pkg.product.priceString}`
      ).join('\n');

      Alert.alert(
        'Upgrade to Premium',
        `Unlock all premium features:\n\n✨ Spice questions\n🎯 Deeper question levels\n🎙️ AI relationship coach\n\n${packageNames}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Restore Purchases',
            onPress: async () => {
              const restored = await restore();
              if (restored) {
                Alert.alert('Success!', 'Your purchases have been restored! 🎉');
              } else {
                Alert.alert('No Purchases', 'No previous purchases found.');
              }
            },
          },
          {
            text: 'Subscribe',
            onPress: async () => {
              // Default to first package (usually monthly)
              await purchaseProduct(packages[0].identifier);
            },
          },
        ]
      );

    } catch (error: any) {
      console.error('❌ Error presenting paywall:', error);
      Alert.alert(
        'Error',
        'Unable to load subscription options. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsPresenting(false);
    }
  }, [isPremium]);

  const purchaseProduct = useCallback(async (packageIdentifier: string): Promise<boolean> => {
    setIsPurchasing(true);

    try {
      console.log('💳 Attempting purchase:', packageIdentifier);

      // Get offerings to find the package
      const offerings = await getOfferings();
      if (!offerings || !offerings.current) {
        throw new Error('No offerings available');
      }

      const packageToPurchase = offerings.current.availablePackages.find(
        pkg => pkg.identifier === packageIdentifier
      );

      if (!packageToPurchase) {
        throw new Error('Package not found');
      }

      // Make the purchase
      const { success } = await purchasePackage(packageToPurchase);

      if (success) {
        console.log('✅ Purchase successful!');
        refetch(); // Refresh premium status
        Alert.alert(
          'Welcome to Premium! 🎉',
          'You now have full access to all premium features.',
          [{ text: 'Get Started!' }]
        );
        return true;
      }

      return false;
    } catch (error: any) {
      if (error.message === 'USER_CANCELLED') {
        console.log('ℹ️ User cancelled purchase');
        return false;
      }

      console.error('❌ Purchase error:', error);
      Alert.alert(
        'Purchase Failed',
        'Something went wrong. Please try again or contact support if the problem persists.',
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [refetch]);

  const restore = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Restoring purchases...');
      const customerInfo = await restorePurchases();
      
      const hasPremium = customerInfo.entitlements.active['premium'] !== undefined;
      
      if (hasPremium) {
        refetch(); // Refresh premium status
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }, [refetch]);

  return {
    isPresenting,
    isPurchasing,
    presentPaywall,
    purchaseProduct,
    restore,
    isPremium,
  };
};
