// Connect App - Home Screen
// Stunning glass design with iOS 26 liquid glass effects

import { Avatar, Button, Card, Chip, GlassButton, GlassCard, LinearGradient, StatusBar } from '@/components/ui';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/lib/auth/AuthContext';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const colorScheme = useColorScheme();

  const handleQuickStart = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/decks');
  };

  const handleFeaturedDeck = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/questions/[deckId]',
      params: { deckId: 'friends', deckName: 'Friends & Social' }
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      
      {/* iOS 26 Dynamic Gradient Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        className="absolute inset-0"
      />
      
      {/* Subtle Glass Overlay */}
      <View className="absolute inset-0 bg-white/5" />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Welcome Header with Glass Effect */}
        <GlassCard 
          intensity={30} 
          tint="dark" 
          className="mb-8 p-6"
          radius="2xl"
        >
          <View className="items-center">
            <Text className="text-6xl mb-4">💬</Text>
            <Text className="text-3xl font-bold text-white mb-2">
              Welcome to Connect
            </Text>
            <Text className="text-lg text-white/80 text-center">
              {profile?.display_name || user?.email || 'Ready to connect?'}
            </Text>
          </View>
        </GlassCard>

        {/* Quick Stats with Glass Cards */}
        <View className="gap-4 mb-8">
          <GlassCard intensity={25} tint="dark" className="p-5" radius="xl">
            <Pressable 
              onPress={handleQuickStart}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-3xl font-bold text-white">0</Text>
                  <Text className="text-white/70 text-sm">Questions Completed</Text>
                </View>
                <View className="bg-orange-500/20 rounded-full p-3">
                  <Text className="text-3xl">🎯</Text>
                </View>
              </View>
            </Pressable>
          </GlassCard>

          <GlassCard intensity={25} tint="dark" className="p-5" radius="xl">
            <Pressable 
              onPress={handleQuickStart}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-3xl font-bold text-white">4</Text>
                  <Text className="text-white/70 text-sm">Available Decks</Text>
                </View>
                <View className="bg-blue-500/20 rounded-full p-3">
                  <Text className="text-3xl">📚</Text>
                </View>
              </View>
            </Pressable>
          </GlassCard>
        </View>

        {/* Featured Deck with Enhanced Glass */}
        <GlassCard 
          intensity={35} 
          tint="dark" 
          className="mb-6 p-6" 
          radius="2xl"
          isInteractive={true}
        >
          <Pressable 
            onPress={handleFeaturedDeck}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl">🌟</Text>
              <View className="bg-orange-500/20 rounded-full px-3 py-1">
                <Text className="text-orange-400 text-sm font-medium">Featured</Text>
              </View>
            </View>
            
            <Text className="text-xl font-bold text-white mb-2">
              Friends & Social
            </Text>
            <Text className="text-white/80 leading-6 mb-4">
              Questions to deepen friendships and create memorable moments with your social circle
            </Text>
            
            <View className="flex-row items-center">
              <Text className="text-orange-400 font-medium">Start Now</Text>
              <Text className="text-orange-400 ml-2">→</Text>
            </View>
          </Pressable>
        </GlassCard>

        {/* Quick Actions - Mix of Glass and HeroUI Components */}
        <View className="gap-3 mb-8">
          <GlassButton
            onPress={handleQuickStart}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <Text className="text-white font-semibold text-lg">
              Browse All Decks
            </Text>
          </GlassButton>
          
          <GlassButton
            onPress={() => router.push('/(tabs)/favorites')}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <Text className="text-white font-medium">
              View Favorites
            </Text>
          </GlassButton>
        </View>

        {/* HeroUI Components Demo */}
        <GlassCard 
          intensity={20} 
          tint="dark" 
          className="mb-6 p-6"
          radius="xl"
        >
          <Text className="text-xl font-bold text-white mb-4">
            🎨 HeroUI Components (Theme Test)
          </Text>
          
          {/* Theme Debug Info */}
          <View className="mb-4 p-2 bg-white/10 rounded">
            <Text className="text-white text-sm">
              Color Scheme: {colorScheme}
            </Text>
            <Text className="text-white text-sm">
              HeroUI Theme: {colorScheme === 'dark' ? 'dark' : 'light'}
            </Text>
          </View>
          
          <View className="space-y-4">
            {/* HeroUI Buttons */}
            <View className="flex-row gap-3">
              <Button 
                size="sm" 
                color="primary"
                onPress={() => console.log('HeroUI Primary')}
              >
                Primary
              </Button>
              <Button 
                size="sm" 
                variant="bordered"
                color="secondary"
                onPress={() => console.log('HeroUI Secondary')}
              >
                Secondary
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                color="success"
                onPress={() => console.log('HeroUI Ghost')}
              >
                Ghost
              </Button>
            </View>
            
            {/* HeroUI Chips */}
            <View className="flex-row gap-2 flex-wrap">
              <Chip size="sm" color="primary">Friends</Chip>
              <Chip size="sm" color="secondary">Family</Chip>
              <Chip size="sm" color="success">Romantic</Chip>
              <Chip size="sm" color="warning">Professional</Chip>
            </View>
            
            {/* HeroUI Avatar */}
            <View className="flex-row items-center gap-3">
              <Avatar 
                size="md"
                name="User"
                src="https://i.pravatar.cc/150?u=user"
              />
              <View>
                <Text className="text-white font-medium">HeroUI Avatar</Text>
                <Text className="text-white/60 text-sm">Beautiful and consistent</Text>
              </View>
            </View>
            
            {/* HeroUI Card Test */}
            <Card className="p-4">
              <Card.Header>
                <Text className="text-foreground font-bold">HeroUI Card Test</Text>
              </Card.Header>
              <Card.Body>
                <Text className="text-foreground">
                  This is a test of the HeroUI Card component. If you can see this text, the theme is working correctly.
                </Text>
              </Card.Body>
            </Card>
          </View>
        </GlassCard>

        {/* Bottom spacing for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
