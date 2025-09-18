import { supabase } from '@/lib/database/supabase';
import {
    PremiumStatus,
    RevenueCatCustomer,
    RevenueCatCustomerInfo
} from '@/types/revenuecat';
import { useCallback, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';

export const usePremiumStatus = (): PremiumStatus => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(!!process.env.EXPO_PUBLIC_RC_API_KEY);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<RevenueCatCustomerInfo | null>(null);

  // Function to synchronize with Supabase
  const syncWithSupabase = useCallback(async (customerInfo: RevenueCatCustomerInfo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscriptionName = process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME || 'pro';
      const hasPro = !!customerInfo.entitlements.active[subscriptionName];
      const latestExpiration = customerInfo.latestExpirationDate;

      // Update users table
      await supabase
        .from('users')
        .update({ 
          is_premium: hasPro,
          revenuecat_id: customerInfo.originalAppUserId 
        })
        .eq('id', user.id);

      // Upsert into revenuecat_customers
      const revenueCatData: Partial<RevenueCatCustomer> = {
        id: customerInfo.originalAppUserId,
        latest_expiration: latestExpiration,
        original_app_user_id: customerInfo.originalAppUserId,
        entitlements: customerInfo.entitlements.active,
        subscriptions: customerInfo.subscriptionsByProductIdentifier,
        all_purchased_products: customerInfo.allPurchasedProductIdentifiers,
      };

      await supabase
        .from('revenuecat_customers')
        .upsert(revenueCatData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      console.log('✅ RevenueCat data synchronized with Supabase');
    } catch (err) {
      console.error('❌ Error synchronizing with Supabase:', err);
      setError(err instanceof Error ? err.message : 'Synchronization error');
    }
  }, []);

  // Function to check premium status
  const checkPremiumStatus = useCallback(async () => {
    try {
      setError(null);

      // Check if RevenueCat is configured
      if (!process.env.EXPO_PUBLIC_RC_API_KEY) {
        console.log('⚠️ RevenueCat not configured, defaulting to free tier');
        setIsPremium(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      const customerInfo = await Purchases.getCustomerInfo();
      const customerInfoTyped = customerInfo as unknown as RevenueCatCustomerInfo;
      
      setCustomerInfo(customerInfoTyped);
      
      // Check if user has "Pro" entitlement
      const subscriptionName = process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME || 'pro';
      const hasPro = !!customerInfoTyped.entitlements.active[subscriptionName];
      setIsPremium(hasPro);

      // Synchronize with Supabase
      await syncWithSupabase(customerInfoTyped);

      console.log('✅ Premium status updated:', { 
        isPremium: hasPro,
        entitlements: Object.keys(customerInfoTyped.entitlements.active) 
      });

    } catch (err) {
      console.error('❌ Error checking premium status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, [syncWithSupabase]);

  // Function to manually refetch
  const refetch = useCallback(async () => {
    await checkPremiumStatus();
  }, [checkPremiumStatus]);

  // Initialization and change listeners
  useEffect(() => {
    checkPremiumStatus();

    // Listen to customerInfo changes (only if RevenueCat is configured)
    if (process.env.EXPO_PUBLIC_RC_API_KEY) {
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        console.log('🔄 CustomerInfo updated via listener');
        const customerInfoTyped = customerInfo as unknown as RevenueCatCustomerInfo;
        
        setCustomerInfo(customerInfoTyped);
        const subscriptionName = process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME || 'pro';
        const hasPro = !!customerInfoTyped.entitlements.active[subscriptionName];
        setIsPremium(hasPro);
        
        // Synchronize with Supabase
        syncWithSupabase(customerInfoTyped);
      });
    }

    // RevenueCat automatically handles listener cleanup
  }, [checkPremiumStatus, syncWithSupabase]);

  return {
    isPremium,
    loading,
    error,
    customerInfo,
    refetch,
  };
}; 