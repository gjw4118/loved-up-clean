// Hook for sharing questions
import { useState } from 'react';
import { ActionSheetIOS, Platform, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createQuestionThread, trackQuestionShare } from '@/lib/database/supabase';
import { generateShareMessage } from '@/utils/sharing/generateShareLink';
import { useAuth } from '@/lib/auth/AuthContext';

export const useShareQuestion = () => {
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const shareQuestion = async (questionId: string, questionText: string) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      setIsSharing(true);

      // Trigger haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Show action sheet
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Share Question', 'Cancel'],
            cancelButtonIndex: 1,
          },
          async (buttonIndex) => {
            if (buttonIndex === 0) {
              await performShare(questionId, questionText, user.id);
            }
            setIsSharing(false);
          }
        );
      } else {
        // Android fallback - directly show share sheet
        await performShare(questionId, questionText, user.id);
        setIsSharing(false);
      }
    } catch (error) {
      console.error('Error sharing question:', error);
      setIsSharing(false);
    }
  };

  const performShare = async (
    questionId: string,
    questionText: string,
    userId: string
  ) => {
    try {
      // Create thread in database
      const threadId = await createQuestionThread(questionId, userId);

      // Generate share message
      const message = generateShareMessage(questionText, threadId);

      // Track share analytics
      await trackQuestionShare(questionId, 'link');

      // Show native share sheet
      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Question shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('❌ Share dismissed');
      }
    } catch (error) {
      console.error('Error performing share:', error);
      throw error;
    }
  };

  return {
    shareQuestion,
    isSharing,
  };
};

