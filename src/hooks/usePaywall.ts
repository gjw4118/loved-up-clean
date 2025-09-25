// Simple Paywall Hook - Development Mode Only
// Replaces RevenueCat integration with simple mock paywall

import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export type PaywallTrigger = 'premium_button' | 'deck_completion' | 'spice_deck';

export const usePaywall = () => {
  const [isPresenting, setIsPresenting] = useState(false);
  const { isPremium, refetch } = usePremiumStatus();

  const presentPaywall = useCallback(async (paywallTrigger: PaywallTrigger = 'premium_button') => {
    // Don't show paywall if user is already premium
    if (isPremium) {
      Alert.alert('Already Premium', 'You already have premium access!');
      return;
    }

    try {
      setIsPresenting(true);

      // Show mock paywall alert
      Alert.alert(
        'Upgrade to Premium',
        'This is a development mode paywall. In production, this would show the actual paywall with pricing options.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => console.log('User cancelled paywall')
          },
          {
            text: 'Upgrade',
            onPress: async () => {
              console.log('User selected upgrade - simulating purchase...');

              // Simulate successful purchase
              setTimeout(() => {
                refetch(); // Refresh premium status
                Alert.alert('Success!', 'Premium access granted! 🎉');
              }, 1000);
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error presenting paywall:', error);
    } finally {
      setIsPresenting(false);
    }
  }, [isPremium, refetch]);

  const presentPaywallForOffering = useCallback(async (offeringIdentifier?: string) => {
    // Same as presentPaywall for now - simplified version
    return presentPaywall('premium_button');
  }, [presentPaywall]);

  return {
    isPresenting,
    presentPaywall,
    presentPaywallForOffering,
    isPremium
  };
};
