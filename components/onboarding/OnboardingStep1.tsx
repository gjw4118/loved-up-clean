import { TextField } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useIconColors } from '@/hooks/useIconColors';
import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import { View } from 'react-native';

interface OnboardingStep1Props {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export function OnboardingStep1({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: OnboardingStep1Props) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <>
      <Text className="mb-3 text-2xl font-bold text-foreground">
        {t('onboarding.step1.title')}
      </Text>
      <Text className="mb-6 text-base leading-6 text-muted-foreground">
        {t('onboarding.step1.subtitle')}
      </Text>

      <View className="gap-4">
        <View>
          <Text className="mb-2 text-sm font-semibold text-foreground">
            {t('onboarding.step1.firstName')}
          </Text>
          <TextField
            placeholder={t('onboarding.step1.firstNamePlaceholder')}
            value={firstName}
            onChangeText={onFirstNameChange}
            autoCapitalize="words"
            autoComplete="given-name"
            size="lg"
            variant="bordered"
            className="text-foreground"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-semibold text-foreground">
            {t('onboarding.step1.lastName')}
          </Text>
          <TextField
            placeholder={t('onboarding.step1.lastNamePlaceholder')}
            value={lastName}
            onChangeText={onLastNameChange}
            autoCapitalize="words"
            autoComplete="family-name"
            size="lg"
            variant="bordered"
            className="text-foreground"
          />
        </View>
      </View>
    </>
  );
} 