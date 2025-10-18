// Premium Status Hook with RevenueCat Integration

import { useState, useEffect, useCallback } from 'react';
import { checkPremiumStatus, getCustomerInfo } from '@/lib/purchases/revenuecat';
import type { CustomerInfo } from 'react-native-purchases';

export interface PremiumStatus {
  isPremium: boolean;
  loading: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  refetch: () => void;
}

// Development mode bypass flag
const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
const BYPASS_PREMIUM = process.env.EXPO_PUBLIC_BYPASS_PREMIUM === 'true';

export const usePremiumStatus = (): PremiumStatus => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const fetchPremiumStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Development mode: bypass premium checks
      if (DEV_MODE && BYPASS_PREMIUM) {
        console.log('🔧 Development mode: Bypassing premium limits');
        setIsPremium(true);
        setLoading(false);
        return;
      }

      // Check RevenueCat for premium status
      const premium = await checkPremiumStatus();
      setIsPremium(premium);

      // Get customer info for subscription details
      const info = await getCustomerInfo();
      setCustomerInfo(info);

      console.log('💎 Premium status updated:', { isPremium: premium });
    } catch (err: any) {
      console.error('❌ Error fetching premium status:', err);
      setError(err.message || 'Failed to check premium status');
      setIsPremium(false); // Default to free tier on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  const refetch = useCallback(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  return {
    isPremium,
    loading,
    error,
    customerInfo,
    refetch,
  };
};