import { Button, TextField } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useIconColors } from '@/hooks/useIconColors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Mot de passe requis (8 caractères minimum)'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface EmailLoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EmailLoginForm({ onSuccess, onCancel }: EmailLoginFormProps) {
  const { signIn } = useAuth();
  const iconColors = useIconColors();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await signIn(data.email, data.password);
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Login error:', error.message);
      Alert.alert('Erreur de connexion', error.message || 'Une erreur est survenue');
    }
  }

  return (
    <View style={{ gap: 12 }}>
      {/* Email Input */}
      <View>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              size="lg"
              variant="bordered"
              className="text-foreground"
            />
          )}
        />
        {errors.email && (
          <Text className="mt-1 px-2 text-sm text-destructive">{errors.email.message}</Text>
        )}
      </View>

      {/* Password Input */}
      <View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Mot de passe"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              size="lg"
              variant="bordered"
              className="text-foreground"
            />
          )}
        />
        {errors.password && (
          <Text className="mt-1 px-2 text-sm text-destructive">{errors.password.message}</Text>
        )}
      </View>

      {/* Footer Actions */}
      <View className="flex-row items-center justify-between" style={{ marginTop: 8 }}>
        {onCancel && (
          <TouchableOpacity onPress={onCancel}>
            <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
              ← Retour
            </Text>
          </TouchableOpacity>
        )}

        <Link href="/resetPassword" asChild>
          <TouchableOpacity>
            <Text className="text-primary" style={{ fontSize: 14 }}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Submit Button */}
      <Button
        className="w-full mt-2"
        size="lg"
        color="primary"
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Se connecter
      </Button>
    </View>
  );
}
