// Question Deck Constants
// Based on PRD: 4 distinct question deck categories

import { DeckCategory } from '@/types/questions';

export const QUESTION_DECKS = [
  {
    id: 'friends-deck',
    name: 'Friends',
    description: 'Fun social questions for friends - create memorable moments and deepen friendships',
    category: DeckCategory.FRIENDS,
    icon: 'F',
    color: '#FF6B35', // Warm orange
    gradient: ['#FF6B35', '#F7931E'],
    estimatedQuestions: 75,
  },
  {
    id: 'family-deck',
    name: 'Family',
    description: 'Connection and reconnection questions for family members who do not connect',
    category: DeckCategory.FAMILY,
    icon: '🏠',
    color: '#4ECDC4', // Teal
    gradient: ['#4ECDC4', '#44A08D'],
    estimatedQuestions: 80,
  },
  {
    id: 'dating-deck',
    name: 'Dating',
    description: 'Questions for people who are starting to date, perfect for early dates',
    category: DeckCategory.DATING,
    icon: '💕',
    color: '#E74C3C', // Red
    gradient: ['#E74C3C', '#C0392B'],
    estimatedQuestions: 70,
  },
  {
    id: 'growing-deck',
    name: 'Growing',
    description: 'Questions about work, aspirations, career, goals, and personal growth',
    category: DeckCategory.GROWING,
    icon: '🌱',
    color: '#3498DB', // Blue
    gradient: ['#3498DB', '#2980B9'],
    estimatedQuestions: 65,
  },
  {
    id: 'spice-deck',
    name: 'Spice',
    description: 'Premium intimate questions for couples to deepen connection and rekindle passion',
    category: DeckCategory.SPICE,
    icon: '🔥',
    color: '#FF1493', // Deep pink
    gradient: ['#FF1493', '#DC143C'],
    estimatedQuestions: 50,
    isPremium: true,
  },
] as const;

export const DECK_CATEGORIES = {
  [DeckCategory.FRIENDS]: {
    name: 'Friends',
    description: 'Fun social questions for friends',
    icon: 'F',
    color: '#FF6B35',
  },
  [DeckCategory.FAMILY]: {
    name: 'Family',
    description: 'Connection and reconnection with family',
    icon: '🏠',
    color: '#4ECDC4',
  },
  [DeckCategory.DATING]: {
    name: 'Dating',
    description: 'Questions for early dating',
    icon: '💕',
    color: '#E74C3C',
  },
  [DeckCategory.GROWING]: {
    name: 'Growing',
    description: 'Work, aspirations, career, goals',
    icon: '🌱',
    color: '#3498DB',
  },
  [DeckCategory.SPICE]: {
    name: 'Spice',
    description: 'Premium intimate couples questions',
    icon: '🔥',
    color: '#FF1493',
  },
} as const;

// Sample questions for each deck (for initial development)
export const SAMPLE_QUESTIONS = {
  [DeckCategory.FRIENDS]: [
    "What's the most adventurous thing you've ever done with a friend?",
    "If you could have dinner with any three people, living or dead, who would they be?",
    "What's a skill you'd love to learn together with a friend?",
    "What's the best piece of advice a friend has ever given you?",
    "If we could travel anywhere in the world together, where would you want to go?",
  ],
  [DeckCategory.FAMILY]: [
    "What's your favorite family tradition and why?",
    "What's something you learned from your parents that you want to pass on?",
    "What's your earliest happy memory with family?",
    "If you could ask any family member one question, what would it be?",
    "What's something you're grateful for that our family taught you?",
  ],
  [DeckCategory.DATING]: [
    "What's something that made you smile today?",
    "If you could travel anywhere for a first date, where would it be?",
    "What's your idea of a perfect weekend?",
    "What's something you're passionate about that you could talk about for hours?",
    "What's the best piece of advice someone has given you?",
  ],
  [DeckCategory.GROWING]: [
    "What's the most valuable lesson you've learned in your career?",
    "What motivates you most in your work?",
    "If you could change one thing about your industry, what would it be?",
    "What's a professional goal you're working toward?",
    "What's the best feedback you've ever received from a colleague?",
  ],
  [DeckCategory.SPICE]: [
    "What's something intimate you've always wanted to try but haven't shared?",
    "How do you like to be touched when you're feeling stressed?",
    "What's your favorite memory of us being intimate together?",
    "If we could have a perfect romantic evening, what would it look like?",
    "What's something new you'd love to explore together in our relationship?",
  ],
} as const;

// Deck configuration
export const DECK_CONFIG = {
  MIN_QUESTIONS_PER_DECK: 50,
  MAX_QUESTIONS_PER_SESSION: 20,
  DEFAULT_QUESTIONS_PER_PAGE: 10,
  CACHE_DURATION_HOURS: 24,
} as const;
