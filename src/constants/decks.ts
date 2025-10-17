// Question Deck Constants
// Based on PRD: 4 distinct question deck categories

import { DeckCategory } from '@/types/questions';

export const QUESTION_DECKS = [
  {
    id: 'family-deck',
    name: 'Family',
    description: 'Reconnection with family - meaningful questions to bridge gaps and strengthen bonds',
    category: DeckCategory.FAMILY,
    icon: '🏠',
    color: '#4ECDC4', // Teal
    gradient: ['#4ECDC4', '#44A08D'],
    estimatedQuestions: 50,
  },
  {
    id: 'dating-deck',
    name: 'Dating',
    description: 'Connection for early dating - perfect for first dates, getting to know each other',
    category: DeckCategory.DATING,
    icon: '💕',
    color: '#FF69B4', // Hot pink
    gradient: ['#FF69B4', '#FF1493'],
    estimatedQuestions: 50,
  },
  {
    id: 'lovers-deck',
    name: 'Lovers',
    description: 'Connection with a partner - building a life, reconnection, purpose, and communication',
    category: DeckCategory.LOVERS,
    icon: '❤️',
    color: '#E74C3C', // Red
    gradient: ['#E74C3C', '#C0392B'],
    estimatedQuestions: 50,
  },
  {
    id: 'work-deck',
    name: 'Work',
    description: 'Safe but interesting questions for colleagues - build friendships while staying professional',
    category: DeckCategory.WORK,
    icon: '💼',
    color: '#5B7C99', // Professional blue
    gradient: ['#5B7C99', '#34495E'],
    estimatedQuestions: 50,
  },
  {
    id: 'friends-deck',
    name: 'Friends',
    description: 'Make friendship conversations more interesting - perfect for dinner and wine',
    category: DeckCategory.FRIENDS,
    icon: '🍷',
    color: '#FF6B35', // Warm orange
    gradient: ['#FF6B35', '#F7931E'],
    estimatedQuestions: 50,
  },
  {
    id: 'growth-deck',
    name: 'Growth',
    description: 'Growth mindset and business discussions - explore professional life and aspirations',
    category: DeckCategory.GROWTH,
    icon: '🌱',
    color: '#27AE60', // Green
    gradient: ['#27AE60', '#229954'],
    estimatedQuestions: 50,
  },
  {
    id: 'spice-deck',
    name: 'Spice',
    description: 'Intimacy and physical connection - improve your connection with your lover',
    category: DeckCategory.SPICE,
    icon: '🔥',
    color: '#FF1493', // Deep pink
    gradient: ['#FF1493', '#DC143C'],
    estimatedQuestions: 50,
    isPremium: true,
  },
] as const;

export const DECK_CATEGORIES = {
  [DeckCategory.FAMILY]: {
    name: 'Family',
    description: 'Reconnection with family',
    icon: '🏠',
    color: '#4ECDC4',
  },
  [DeckCategory.DATING]: {
    name: 'Dating',
    description: 'Connection for early dating',
    icon: '💕',
    color: '#FF69B4',
  },
  [DeckCategory.LOVERS]: {
    name: 'Lovers',
    description: 'Connection with a partner',
    icon: '❤️',
    color: '#E74C3C',
  },
  [DeckCategory.WORK]: {
    name: 'Work',
    description: 'Professional colleague conversations',
    icon: '💼',
    color: '#5B7C99',
  },
  [DeckCategory.FRIENDS]: {
    name: 'Friends',
    description: 'Interesting friendship conversations',
    icon: '🍷',
    color: '#FF6B35',
  },
  [DeckCategory.GROWTH]: {
    name: 'Growth',
    description: 'Growth mindset and business',
    icon: '🌱',
    color: '#27AE60',
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
    "What qualities do you value most in a relationship?",
  ],
  [DeckCategory.LOVERS]: [
    "What makes you feel most loved by me?",
    "What's a dream we could build together?",
    "How can we better support each other's goals?",
    "What does a fulfilling life together look like to you?",
    "What's one way we could improve our communication?",
  ],
  [DeckCategory.WORK]: [
    "What's the most interesting project you've worked on recently?",
    "If you could change one thing about work culture, what would it be?",
    "What do you do to unwind after a challenging day?",
    "What's a skill you'd love to learn?",
    "What motivates you in your career?",
  ],
  [DeckCategory.FRIENDS]: [
    "What's the most adventurous thing you've ever done?",
    "If you could have dinner with any three people, living or dead, who would they be?",
    "What's a skill you'd love to learn together?",
    "What's the best piece of advice a friend has ever given you?",
    "If we could travel anywhere together, where would you want to go?",
  ],
  [DeckCategory.GROWTH]: [
    "What's the most valuable lesson you've learned in your career?",
    "What does success mean to you?",
    "If you could change one thing about your industry, what would it be?",
    "What's a professional goal you're working toward?",
    "Where do you see yourself in five years?",
  ],
  [DeckCategory.SPICE]: [
    "What makes you feel most desired?",
    "How do you like to be touched when you're feeling stressed?",
    "What's your favorite memory of us being intimate together?",
    "If we could have a perfect romantic evening, what would it look like?",
    "What's something new you'd love to explore together?",
  ],
} as const;

// Deck configuration
export const DECK_CONFIG = {
  MIN_QUESTIONS_PER_DECK: 50,
  MAX_QUESTIONS_PER_SESSION: 20,
  DEFAULT_QUESTIONS_PER_PAGE: 10,
  CACHE_DURATION_HOURS: 24,
} as const;
