// AI SDK Client Configuration
// Handles AI-powered question generation using OpenAI

import { ENV } from '@/config/env';
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

// Check if AI features are enabled
export const isAIEnabled = (): boolean => {
  return ENV.ENABLE_AI_FEATURES && !!ENV.OPENAI_API_KEY;
};

/**
 * Generate a single question using AI
 * @param context - Context for question generation (deck type, difficulty, etc.)
 */
export async function generateQuestion(context: {
  deckCategory: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  previousQuestions?: string[];
}): Promise<string> {
  if (!isAIEnabled()) {
    throw new Error('AI features are not enabled');
  }

  const { deckCategory, difficulty = 'medium', topic, previousQuestions = [] } = context;

  // Build prompt based on deck category
  const prompts: Record<string, string> = {
    friends: 'Generate a thoughtful, fun question that helps friends deepen their connection and create memorable moments.',
    family: 'Generate a meaningful question that helps family members connect, understand each other better, and strengthen their bonds.',
    romantic: 'Generate an intimate, thoughtful question for couples or people dating to explore deeper connection and understanding.',
    professional: 'Generate an insightful question about work, career, aspirations, or professional growth that fosters meaningful workplace conversations.',
  };

  const basePrompt = prompts[deckCategory] || prompts.friends;

  let systemPrompt = `You are a relationship expert and conversation facilitator. ${basePrompt}

Guidelines:
- Keep questions concise (under 100 characters if possible)
- Make them thought-provoking but not too heavy
- Ensure questions are inclusive and respectful
- Avoid questions that might make people uncomfortable
- Focus on positive, growth-oriented topics
- Difficulty level: ${difficulty}
${topic ? `- Topic focus: ${topic}` : ''}

Return ONLY the question text, without quotes or additional formatting.`;

  if (previousQuestions.length > 0) {
    systemPrompt += `\n\nAvoid repeating themes from these previous questions:\n${previousQuestions.slice(0, 5).join('\n')}`;
  }

  try {
    const { text } = await generateText({
      model: openai(ENV.AI_MODEL),
      prompt: systemPrompt,
      temperature: 0.8, // Higher temperature for more creative questions
      maxTokens: 100,
    });

    return text.trim();
  } catch (error) {
    console.error('AI question generation failed:', error);
    throw new Error('Failed to generate question with AI');
  }
}

/**
 * Generate multiple questions in one batch
 * @param count - Number of questions to generate
 * @param context - Context for question generation
 */
export async function generateMultipleQuestions(
  count: number,
  context: {
    deckCategory: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    topic?: string;
  }
): Promise<string[]> {
  if (!isAIEnabled()) {
    throw new Error('AI features are not enabled');
  }

  const { deckCategory, difficulty = 'medium', topic } = context;

  const prompts: Record<string, string> = {
    friends: 'Generate thoughtful, fun questions that help friends deepen their connection and create memorable moments.',
    family: 'Generate meaningful questions that help family members connect, understand each other better, and strengthen their bonds.',
    romantic: 'Generate intimate, thoughtful questions for couples or people dating to explore deeper connection and understanding.',
    professional: 'Generate insightful questions about work, career, aspirations, or professional growth that foster meaningful workplace conversations.',
  };

  const basePrompt = prompts[deckCategory] || prompts.friends;

  const systemPrompt = `You are a relationship expert and conversation facilitator. ${basePrompt}

Generate exactly ${count} unique questions.

Guidelines:
- Keep questions concise (under 100 characters if possible)
- Make them thought-provoking but not too heavy
- Ensure questions are inclusive and respectful
- Avoid questions that might make people uncomfortable
- Focus on positive, growth-oriented topics
- Difficulty level: ${difficulty}
${topic ? `- Topic focus: ${topic}` : ''}
- Each question should be unique and explore different aspects

Format: Return one question per line, numbered 1-${count}.`;

  try {
    const { text } = await generateText({
      model: openai(ENV.AI_MODEL),
      prompt: systemPrompt,
      temperature: 0.9, // Higher temperature for diversity
      maxTokens: 500,
    });

    // Parse the numbered questions
    const questions = text
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((q) => q.length > 10); // Filter out invalid questions

    return questions.slice(0, count);
  } catch (error) {
    console.error('AI multiple questions generation failed:', error);
    throw new Error('Failed to generate questions with AI');
  }
}

/**
 * Stream AI-generated question (for real-time generation UI)
 * @param context - Context for question generation
 */
export async function streamQuestion(context: {
  deckCategory: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
}) {
  if (!isAIEnabled()) {
    throw new Error('AI features are not enabled');
  }

  const { deckCategory, difficulty = 'medium', topic } = context;

  const prompts: Record<string, string> = {
    friends: 'Generate a thoughtful, fun question that helps friends deepen their connection and create memorable moments.',
    family: 'Generate a meaningful question that helps family members connect, understand each other better, and strengthen their bonds.',
    romantic: 'Generate an intimate, thoughtful question for couples or people dating to explore deeper connection and understanding.',
    professional: 'Generate an insightful question about work, career, aspirations, or professional growth that fosters meaningful workplace conversations.',
  };

  const basePrompt = prompts[deckCategory] || prompts.friends;

  const systemPrompt = `You are a relationship expert and conversation facilitator. ${basePrompt}

Guidelines:
- Keep questions concise (under 100 characters if possible)
- Make them thought-provoking but not too heavy
- Ensure questions are inclusive and respectful
- Difficulty level: ${difficulty}
${topic ? `- Topic focus: ${topic}` : ''}

Return ONLY the question text, without quotes or additional formatting.`;

  try {
    const result = await streamText({
      model: openai(ENV.AI_MODEL),
      prompt: systemPrompt,
      temperature: 0.8,
      maxTokens: 100,
    });

    return result.textStream;
  } catch (error) {
    console.error('AI streaming failed:', error);
    throw new Error('Failed to stream question with AI');
  }
}

/**
 * Get AI suggestions for improving a question
 */
export async function improveQuestion(originalQuestion: string, context: string): Promise<string> {
  if (!isAIEnabled()) {
    throw new Error('AI features are not enabled');
  }

  const systemPrompt = `You are an expert at crafting meaningful conversation questions. 

Improve this question while maintaining its core intent:
"${originalQuestion}"

Context: ${context}

Make it:
- More engaging and thought-provoking
- Clearer and more concise
- More inclusive and respectful

Return ONLY the improved question, without explanation.`;

  try {
    const { text } = await generateText({
      model: openai(ENV.AI_MODEL),
      prompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 100,
    });

    return text.trim();
  } catch (error) {
    console.error('AI question improvement failed:', error);
    throw new Error('Failed to improve question with AI');
  }
}

