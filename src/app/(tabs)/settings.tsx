// You Screen - Clean iOS-style profile and settings

import { Chip, LinearGradient, StatusBar } from '@/components/ui';
import { useFocusMode } from '@/hooks/useFocusMode';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/lib/auth/AuthContext';
import { deleteAccount } from '@/lib/auth/supabase-auth';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function YouScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { signOut, user, profile } = useAuth();
  const { preferences, resetPreferences } = useFocusMode();
  const { isEnabled: pushEnabled, isLoading: pushLoading, togglePushNotifications, openSettings } = useNotifications();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const getInitial = () => {
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await signOut();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              const { error } = await deleteAccount();
              if (error) throw error;
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace('/auth');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const SettingsCard = ({ children }: { children: React.ReactNode }) => (
    <BlurView 
      intensity={isDark ? 30 : 20}
      tint={isDark ? 'dark' : 'light'}
      style={styles.card}
    >
      <LinearGradient
        colors={isDark 
          ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] 
          : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.05)']
        }
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardContent}>
        {children}
      </View>
    </BlurView>
  );

  const SettingsRow = ({ 
    label, 
    onPress,
    renderRight,
    isLast = false,
    isDanger = false
  }: { 
    label: string; 
    onPress?: () => void;
    renderRight?: () => React.ReactNode;
    isLast?: boolean;
    isDanger?: boolean;
  }) => {
    const content = (
      <View>
        <View style={styles.row}>
          <Text style={[
            styles.rowLabel, 
            isDark && styles.rowLabelDark,
            isDanger && styles.dangerLabel
          ]}>
            {label}
          </Text>
          {renderRight && renderRight()}
        </View>
        {!isLast && <View style={[styles.divider, isDark && styles.dividerDark]} />}
      </View>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress}>
          {content}
        </Pressable>
      );
    }

    return content;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <LinearGradient
        colors={isDark 
          ? ['#000000', '#0a0a0a', '#1a0a1f'] 
          : ['#fafafa', '#ffffff', '#f5f3ff']
        }
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Card */}
          <SettingsCard>
            <View style={styles.profileCardContent}>
              {/* Avatar with Gradient */}
              <View style={styles.avatarWrapper}>
                <LinearGradient
                  colors={['#f97316', '#ec4899', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>{getInitial()}</Text>
                </LinearGradient>
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <View style={styles.userTextContainer}>
                  <Text style={[styles.name, isDark && styles.nameDark]}>
                    {profile?.display_name || profile?.first_name || user?.email?.split('@')[0] || 'User'}
                  </Text>
                  <Text style={[styles.email, isDark && styles.emailDark]}>
                    {user?.email}
                  </Text>
                </View>

                {/* Premium Badge */}
                {profile?.is_premium && (
                  <View style={styles.premiumBadge}>
                    <Chip
                      variant="flat"
                      color="secondary"
                      size="sm"
                    >
                      Premium
                    </Chip>
                  </View>
                )}
              </View>
            </View>
          </SettingsCard>

          <View style={styles.spacer} />

          {/* Preferences Card */}
          <SettingsCard>
            <SettingsRow
              label="Focus Reminders"
              renderRight={() => (
                <Switch
                  value={!preferences.dontShowAgain}
                  onValueChange={async (value) => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (value && preferences.dontShowAgain) {
                      await resetPreferences();
                      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                  }}
                  trackColor={{ false: '#767577', true: '#a855f7' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#3e3e3e"
                />
              )}
            />
            
            <SettingsRow
              label="Dark Mode"
              renderRight={() => (
                <Switch
                  value={isDark}
                  onValueChange={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    toggleTheme();
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                  trackColor={{ false: '#767577', true: '#a855f7' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#3e3e3e"
                />
              )}
            />

            <SettingsRow
              label="Push Notifications"
              renderRight={() => (
                <Switch
                  value={pushEnabled}
                  disabled={pushLoading}
                  onValueChange={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    try {
                      const success = await togglePushNotifications();
                      if (success) {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      } else {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        Alert.alert(
                          'Error',
                          'Failed to update notification settings. Please try again.',
                          [{ text: 'OK' }]
                        );
                      }
                    } catch (error) {
                      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                      
                      if (errorMessage.includes('Permissions blocked') || errorMessage.includes('device settings')) {
                        Alert.alert(
                          'Permission Required',
                          'Push notifications are disabled in your device settings. Please enable them in Settings > Notifications to receive notifications.',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { 
                              text: 'Open Settings', 
                              onPress: openSettings
                            }
                          ]
                        );
                      } else {
                        Alert.alert(
                          'Error',
                          errorMessage,
                          [{ text: 'OK' }]
                        );
                      }
                    }
                  }}
                  trackColor={{ false: '#767577', true: '#a855f7' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#3e3e3e"
                />
              )}
              isLast
            />
          </SettingsCard>

          <View style={styles.spacer} />

          {/* Legal Card */}
          <SettingsCard>
            <SettingsRow
              label="Privacy Policy"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              renderRight={() => (
                <Text style={[styles.chevron, isDark && styles.chevronDark]}>›</Text>
              )}
            />
            
            <SettingsRow
              label="Terms of Service"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              renderRight={() => (
                <Text style={[styles.chevron, isDark && styles.chevronDark]}>›</Text>
              )}
              isLast
            />
          </SettingsCard>

          <View style={styles.spacer} />

          {/* Account Actions Card */}
          <SettingsCard>
            <SettingsRow
              label={isSigningOut ? 'Signing Out...' : 'Sign Out'}
              onPress={isSigningOut || isDeleting ? undefined : handleSignOut}
              renderRight={() => (
                isSigningOut ? (
                  <ActivityIndicator size="small" color={isDark ? '#fff' : '#999'} />
                ) : (
                  <Text style={[styles.chevron, isDark && styles.chevronDark]}>›</Text>
                )
              )}
            />
            
            <SettingsRow
              label={isDeleting ? 'Deleting...' : 'Delete Account'}
              onPress={isDeleting || isSigningOut ? undefined : handleDeleteAccount}
              renderRight={() => (
                isDeleting ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <Text style={[styles.chevron, styles.dangerChevron]}>›</Text>
                )
              )}
              isDanger
              isLast
            />
          </SettingsCard>

          {/* Footer Text */}
          <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
            Deleting your account will permanently remove all your data and cannot be undone.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: {
    flexShrink: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  nameDark: {
    color: '#ffffff',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
  },
  emailDark: {
    color: '#9ca3af',
  },
  premiumBadge: {
    flexShrink: 0,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  rowLabelDark: {
    color: '#ffffff',
  },
  dangerLabel: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 4,
  },
  dividerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
    color: '#9ca3af',
  },
  chevronDark: {
    color: '#6b7280',
  },
  dangerChevron: {
    color: '#ef4444',
  },
  spacer: {
    height: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  footerTextDark: {
    color: '#9ca3af',
  },
});
