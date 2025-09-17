// Question Deck Constants
// Based on PRD: 4 distinct question deck categories

import { DeckCategory } from '@/types/questions';

export const QUESTION_DECKS = [
  {
    id: 'friends-deck',
    name: 'Friends & Social',
    description: 'Questions to deepen friendships and create memorable moments with your social circle',
    category: DeckCategory.FRIENDS,
    icon: '👥',
    color: '#FF6B35', // Warm orange
    gradient: ['#FF6B35', '#F7931E'],
    estimatedQuestions: 75,
  },
  {
    id: 'family-deck',
    name: 'Family Bonds',
    description: 'Meaningful questions to strengthen family relationships across all generations',
    category: DeckCategory.FAMILY,
    icon: '🏠',
    color: '#4ECDC4', // Teal
    gradient: ['#4ECDC4', '#44A08D'],
    estimatedQuestions: 80,
  },
  {
    id: 'romantic-deck',
    name: 'Love & Romance',
    description: 'Intimate questions for couples to explore deeper connection and understanding',
    category: DeckCategory.ROMANTIC,
    icon: '💕',
    color: '#E74C3C', // Red
    gradient: ['#E74C3C', '#C0392B'],
    estimatedQuestions: 70,
  },
  {
    id: 'professional-deck',
    name: 'Work & Growth',
    description: 'Professional questions for team building, networking, and career conversations',
    category: DeckCategory.PROFESSIONAL,
    icon: '💼',
    color: '#3498DB', // Blue
    gradient: ['#3498DB', '#2980B9'],
    estimatedQuestions: 65,
  },
] as const;

export const DECK_CATEGORIES = {
  [DeckCategory.FRIENDS]: {
    name: 'Friends & Social',
    description: 'Build stronger friendships',
    icon: '👥',
    color: '#FF6B35',
  },
  [DeckCategory.FAMILY]: {
    name: 'Family Bonds',
    description: 'Connect with family',
    icon: '🏠',
    color: '#4ECDC4',
  },
  [DeckCategory.ROMANTIC]: {
    name: 'Love & Romance',
    description: 'Deepen romantic connections',
    icon: '💕',
    color: '#E74C3C',
  },
  [DeckCategory.PROFESSIONAL]: {
    name: 'Work & Growth',
    description: 'Professional relationships',
    icon: '💼',
    color: '#3498DB',
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
  [DeckCategory.ROMANTIC]: [
    "What made you realize you were falling in love with me?",
    "What's your favorite memory of us together?",
    "How do you like to be comforted when you're feeling down?",
    "What's something new you'd like us to try together?",
    "What does your ideal future look like with me in it?",
  ],
  [DeckCategory.PROFESSIONAL]: [
    "What's the most valuable lesson you've learned in your career?",
    "What motivates you most in your work?",
    "If you could change one thing about your industry, what would it be?",
    "What's a professional goal you're working toward?",
    "What's the best feedback you've ever received from a colleague?",
  ],
} as const;

// Deck configuration
export const DECK_CONFIG = {
  MIN_QUESTIONS_PER_DECK: 50,
  MAX_QUESTIONS_PER_SESSION: 20,
  DEFAULT_QUESTIONS_PER_PAGE: 10,
  CACHE_DURATION_HOURS: 24,
} as const;
