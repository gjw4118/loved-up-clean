// Focus Mode Hook
// Manages Do Not Disturb prompts and user preferences for staying present

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const FOCUS_MODE_STORAGE_KEY = '@loved_up_focus_mode';

interface FocusModePreferences {
  dontShowAgain: boolean;
  lastPromptDate: string | null;
  timesPrompted: number;
}

const DEFAULT_PREFERENCES: FocusModePreferences = {
  dontShowAgain: false,
  lastPromptDate: null,
  timesPrompted: 0,
};

export const useFocusMode = () => {
  const [preferences, setPreferences] = useState<FocusModePreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  // Load preferences from storage
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(FOCUS_MODE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
        
        // Determine if we should show the prompt
        const shouldShow = determineShouldShowPrompt(parsed);
        setShouldShowPrompt(shouldShow);
      } else {
        // First time - show the prompt
        setShouldShowPrompt(true);
      }
    } catch (error) {
      console.error('Error loading focus mode preferences:', error);
      setShouldShowPrompt(true); // Show on error to be safe
    } finally {
      setIsLoading(false);
    }
  };

  const determineShouldShowPrompt = (prefs: FocusModePreferences): boolean => {
    // Don't show if user opted out
    if (prefs.dontShowAgain) {
      return false;
    }

    // Show every 5 sessions for the first 3 times, then every 10 sessions
    const threshold = prefs.timesPrompted < 3 ? 5 : 10;
    
    // Check if enough time has passed since last prompt (1 day)
    if (prefs.lastPromptDate) {
      const lastPrompt = new Date(prefs.lastPromptDate);
      const now = new Date();
      const daysSinceLastPrompt = (now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastPrompt < 1) {
        return false;
      }
    }

    return prefs.timesPrompted % threshold === 0;
  };

  const markPromptShown = async () => {
    try {
      const updated: FocusModePreferences = {
        ...preferences,
        lastPromptDate: new Date().toISOString(),
        timesPrompted: preferences.timesPrompted + 1,
      };
      
      await AsyncStorage.setItem(FOCUS_MODE_STORAGE_KEY, JSON.stringify(updated));
      setPreferences(updated);
      setShouldShowPrompt(false);
    } catch (error) {
      console.error('Error saving focus mode prompt:', error);
    }
  };

  const setDontShowAgain = async () => {
    try {
      const updated: FocusModePreferences = {
        ...preferences,
        dontShowAgain: true,
        lastPromptDate: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(FOCUS_MODE_STORAGE_KEY, JSON.stringify(updated));
      setPreferences(updated);
      setShouldShowPrompt(false);
    } catch (error) {
      console.error('Error saving focus mode preference:', error);
    }
  };

  const resetPreferences = async () => {
    try {
      await AsyncStorage.removeItem(FOCUS_MODE_STORAGE_KEY);
      setPreferences(DEFAULT_PREFERENCES);
      setShouldShowPrompt(true);
    } catch (error) {
      console.error('Error resetting focus mode preferences:', error);
    }
  };

  return {
    shouldShowPrompt,
    isLoading,
    preferences,
    markPromptShown,
    setDontShowAgain,
    resetPreferences,
  };
};

