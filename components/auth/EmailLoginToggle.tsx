import { Button } from '@/components/ui';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { useIconColors } from '../../hooks/useIconColors';

export function EmailLoginToggle() {
  const iconColors = useIconColors();
  
  return (
    <Link href="/sign-in" asChild>
      <Button
        className="w-full"
        size="lg"
        variant="bordered"
        color="default"
        startContent={<Feather name="mail" size={20} color={iconColors.secondary} />}
      >
        Continuer avec Email
      </Button>
    </Link>
  );
}
