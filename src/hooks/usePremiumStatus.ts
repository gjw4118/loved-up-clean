// Simple Premium Status Hook - Development Mode Only
// Replaces RevenueCat integration with simple environment-based checks

import { useState, useEffect } from 'react';

export interface PremiumStatus {
  isPremium: boolean;
  loading: boolean;
  error: string | null;
  customerInfo: any | null;
  refetch: () => void;
}

export const usePremiumStatus = (): PremiumStatus => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Development mode: bypass premium limits
  const isDevMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true';
  const bypassPremium = process.env.EXPO_PUBLIC_BYPASS_PREMIUM === 'true';

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Development mode: bypass premium checks
    if (isDevMode && bypassPremium) {
      console.log('🔧 Development mode: Bypassing premium limits');
      setIsPremium(true);
      setLoading(false);
      return;
    }

    // Default to free tier
    setIsPremium(false);
    setLoading(false);
  }, [isDevMode, bypassPremium]);

  const refetch = () => {
    // Simple refetch - just re-run the effect
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  return {
    isPremium,
    loading,
    error,
    customerInfo: null,
    refetch,
  };
};