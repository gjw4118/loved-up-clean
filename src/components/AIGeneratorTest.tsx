// AI Question Generator Test Component
// This component demonstrates how to use the AI question generation system

import { GlassButton } from '@/components/ui';
import { useGenerateQuestions } from '@/hooks/useAIGeneration';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface AIGeneratorTestProps {
  category: 'friends' | 'family' | 'romantic' | 'professional';
}

export default function AIGeneratorTest({ category }: AIGeneratorTestProps) {
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const { mutate: generateQuestions, isPending } = useGenerateQuestions();

  const handleGenerateQuestions = () => {
    generateQuestions(
      {
        category,
        count: 3,
        difficulty: 'medium',
      },
      {
        onSuccess: (questions) => {
          const questionTexts = questions.map(q => q.text);
          setGeneratedQuestions(questionTexts);
          Alert.alert('Success!', `Generated ${questions.length} new questions for ${category} category.`);
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        AI Question Generator Test
      </Text>
      
      <Text style={{ marginBottom: 16 }}>
        Category: {category}
      </Text>

      <GlassButton
        onPress={handleGenerateQuestions}
        disabled={isPending}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {isPending ? 'Generating...' : 'Generate AI Questions'}
        </Text>
      </GlassButton>

      {generatedQuestions.length > 0 && (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            Generated Questions:
          </Text>
          {generatedQuestions.map((question, index) => (
            <View key={index} style={{ marginBottom: 8, padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
              <Text style={{ color: 'white' }}>
                {index + 1}. {question}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
