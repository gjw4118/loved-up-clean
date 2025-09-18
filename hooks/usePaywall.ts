// Paywall Hook
// Uses RevenueCat's offerings to present paywall options

import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useCallback, useState } from 'react';
import Purchases from 'react-native-purchases';

export type PaywallTrigger = 'premium_button' | 'deck_completion' | 'spice_deck';

export const usePaywall = () => {
  const [isPresenting, setIsPresenting] = useState(false);
  const { isPremium, refetch } = usePremiumStatus();

  const presentPaywall = useCallback(async (paywallTrigger: PaywallTrigger = 'premium_button') => {
    // Don't show paywall if user is already premium
    if (isPremium) {
      return;
    }
    
    try {
      setIsPresenting(true);
      
      // Get offerings from RevenueCat
      const offerings = await Purchases.getOfferings();
      
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        // For React Native, RevenueCat doesn't have a built-in paywall UI component
        // Instead, we present the packages directly for purchase
        // The paywall UI is typically handled by the native platform (iOS/Android)
        
        // Find the best package to present (prefer monthly, then annual)
        const monthlyPackage = offerings.current.availablePackages.find(pkg => pkg.packageType === 'MONTHLY');
        const annualPackage = offerings.current.availablePackages.find(pkg => pkg.packageType === 'ANNUAL');
        const packageToPresent = monthlyPackage || annualPackage || offerings.current.availablePackages[0];
        
        if (packageToPresent) {
          const { customerInfo } = await Purchases.purchasePackage(packageToPresent);
          
          // Check if purchase was successful
          const subscriptionName = process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME || 'pro';
          const hasPro = !!customerInfo.entitlements.active[subscriptionName];
          
          if (hasPro) {
            await refetch();
          }
        }
      } else {
        console.warn('No offerings available for paywall');
      }
      
    } catch (error) {
      console.error('Error presenting paywall:', error);
      
      // Handle user cancellation gracefully
      if (error.code === 'PURCHASES_ERROR_USER_CANCELLED') {
        console.log('User cancelled paywall presentation');
      }
    } finally {
      setIsPresenting(false);
    }
  }, [isPremium, refetch]);

  const presentPaywallForOffering = useCallback(async (offeringIdentifier?: string) => {
    if (isPremium) {
      return;
    }
    
    try {
      setIsPresenting(true);
      
      // Get offerings
      const offerings = await Purchases.getOfferings();
      
      // Use specific offering or current offering
      const offering = offeringIdentifier 
        ? offerings.all[offeringIdentifier] 
        : offerings.current;
      
      if (offering && offering.availablePackages.length > 0) {
        // Present the first package from the offering
        const packageToPresent = offering.availablePackages[0];
        
        const { customerInfo } = await Purchases.purchasePackage(packageToPresent);
        
        // Check if purchase was successful
        const subscriptionName = process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME || 'pro';
        const hasPro = !!customerInfo.entitlements.active[subscriptionName];
        
        if (hasPro) {
          await refetch();
        }
      }
      
    } catch (error) {
      console.error('Error presenting paywall for offering:', error);
      
      if (error.code === 'PURCHASES_ERROR_USER_CANCELLED') {
        console.log('User cancelled paywall presentation');
      }
    } finally {
      setIsPresenting(false);
    }
  }, [isPremium, refetch]);

  return {
    isPresenting,
    presentPaywall,
    presentPaywallForOffering,
    isPremium
  };
};
