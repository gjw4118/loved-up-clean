// Hardcoded questions for development
// This allows us to test the UI without database dependencies

export interface HardcodedQuestion {
  id: string;
  text: string;
  depth_level: 'standard' | 'deeper';
  tags: string[];
  deck_id: string;
  completion_rate: number;
  skip_rate: number;
  created_at: string;
  updated_at: string;
}

export interface HardcodedDeck {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  question_count: number;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

// Hardcoded decks
export const HARDCODED_DECKS: HardcodedDeck[] = [
  {
    id: 'family-deck',
    name: 'Family',
    description: 'Reconnection with family',
    category: 'family',
    icon: '🏠',
    question_count: 5,
    popularity_score: 0.85,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'dating-deck',
    name: 'Dating',
    description: 'Connection for early dating',
    category: 'dating',
    icon: '💕',
    question_count: 5,
    popularity_score: 0.92,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lovers-deck',
    name: 'Lovers',
    description: 'Connection with a partner',
    category: 'lovers',
    icon: '❤️',
    question_count: 5,
    popularity_score: 0.88,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'work-deck',
    name: 'Work',
    description: 'Professional colleague conversations',
    category: 'work',
    icon: '💼',
    question_count: 5,
    popularity_score: 0.78,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'friends-deck',
    name: 'Friends',
    description: 'Interesting friendship conversations',
    category: 'friends',
    icon: '🍷',
    question_count: 5,
    popularity_score: 0.82,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'growth-deck',
    name: 'Growth',
    description: 'Growth mindset and business',
    category: 'growth',
    icon: '🌱',
    question_count: 5,
    popularity_score: 0.76,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'spice-deck',
    name: 'Spice',
    description: 'Intimacy and physical connection',
    category: 'spice',
    icon: '🔥',
    question_count: 5,
    popularity_score: 0.94,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Hardcoded questions
export const HARDCODED_QUESTIONS: HardcodedQuestion[] = [
  // Friends questions
  {
    id: 'friends-q1',
    text: "What's your favorite memory of us together?",
    depth_level: 'standard',
    tags: ['memory', 'friendship'],
    deck_id: 'friends-deck',
    completion_rate: 0.85,
    skip_rate: 0.15,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'friends-q2',
    text: 'If you could change one thing about our friendship, what would it be?',
    depth_level: 'deeper',
    tags: ['growth', 'honesty'],
    deck_id: 'friends-deck',
    completion_rate: 0.72,
    skip_rate: 0.28,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'friends-q3',
    text: 'What do you think is my biggest strength?',
    depth_level: 'standard',
    tags: ['strengths', 'support'],
    deck_id: 'friends-deck',
    completion_rate: 0.90,
    skip_rate: 0.10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'friends-q4',
    text: 'What adventure would you most want to go on together?',
    depth_level: 'standard',
    tags: ['adventure', 'future'],
    deck_id: 'friends-deck',
    completion_rate: 0.88,
    skip_rate: 0.12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'friends-q5',
    text: 'What have I taught you that you value most?',
    depth_level: 'deeper',
    tags: ['learning', 'impact'],
    deck_id: 'friends-deck',
    completion_rate: 0.75,
    skip_rate: 0.25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },

  // Lovers questions
  {
    id: 'lovers-q1',
    text: 'What makes you feel most loved by me?',
    depth_level: 'standard',
    tags: ['love', 'connection'],
    deck_id: 'lovers-deck',
    completion_rate: 0.92,
    skip_rate: 0.08,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lovers-q2',
    text: 'If we could go anywhere in the world together, where would you choose?',
    depth_level: 'standard',
    tags: ['travel', 'dreams'],
    deck_id: 'lovers-deck',
    completion_rate: 0.89,
    skip_rate: 0.11,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lovers-q3',
    text: 'What small thing do I do that makes you smile?',
    depth_level: 'standard',
    tags: ['appreciation', 'joy'],
    deck_id: 'lovers-deck',
    completion_rate: 0.94,
    skip_rate: 0.06,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lovers-q4',
    text: 'What do you think is our biggest strength as a couple?',
    depth_level: 'deeper',
    tags: ['strengths', 'relationship'],
    deck_id: 'lovers-deck',
    completion_rate: 0.78,
    skip_rate: 0.22,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'lovers-q5',
    text: 'What would you like to experience together that we haven\'t tried yet?',
    depth_level: 'deeper',
    tags: ['growth', 'adventure'],
    deck_id: 'lovers-deck',
    completion_rate: 0.81,
    skip_rate: 0.19,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },

  // Family questions
  {
    id: 'family-q1',
    text: 'What family tradition do you cherish most?',
    depth_level: 'standard',
    tags: ['traditions', 'heritage'],
    deck_id: 'family-deck',
    completion_rate: 0.87,
    skip_rate: 0.13,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'family-q2',
    text: 'What advice would you give to a younger family member?',
    depth_level: 'deeper',
    tags: ['wisdom', 'guidance'],
    deck_id: 'family-deck',
    completion_rate: 0.76,
    skip_rate: 0.24,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'family-q3',
    text: 'What family memory always makes you laugh?',
    depth_level: 'standard',
    tags: ['memory', 'joy'],
    deck_id: 'family-deck',
    completion_rate: 0.91,
    skip_rate: 0.09,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'family-q4',
    text: 'How has our family shaped who you are today?',
    depth_level: 'deeper',
    tags: ['identity', 'growth'],
    deck_id: 'family-deck',
    completion_rate: 0.68,
    skip_rate: 0.32,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'family-q5',
    text: 'What do you hope future generations will remember about our family?',
    depth_level: 'deeper',
    tags: ['legacy', 'future'],
    deck_id: 'family-deck',
    completion_rate: 0.73,
    skip_rate: 0.27,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },

  // Work questions
  {
    id: 'work-q1',
    text: 'What work accomplishment are you most proud of?',
    depth_level: 'standard',
    tags: ['achievement', 'pride'],
    deck_id: 'work-deck',
    completion_rate: 0.86,
    skip_rate: 0.14,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'work-q2',
    text: 'What professional skill would you most like to develop?',
    depth_level: 'deeper',
    tags: ['growth', 'skills'],
    deck_id: 'work-deck',
    completion_rate: 0.79,
    skip_rate: 0.21,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'work-q3',
    text: 'What motivates you most in your career?',
    depth_level: 'standard',
    tags: ['motivation', 'purpose'],
    deck_id: 'work-deck',
    completion_rate: 0.82,
    skip_rate: 0.18,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'work-q4',
    text: 'What workplace challenge has taught you the most?',
    depth_level: 'deeper',
    tags: ['learning', 'resilience'],
    deck_id: 'work-deck',
    completion_rate: 0.71,
    skip_rate: 0.29,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'work-q5',
    text: 'How do you maintain work-life balance?',
    depth_level: 'standard',
    tags: ['balance', 'wellbeing'],
    deck_id: 'work-deck',
    completion_rate: 0.77,
    skip_rate: 0.23,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Helper functions
export const getHardcodedDeck = (deckId: string): HardcodedDeck | undefined => {
  return HARDCODED_DECKS.find(deck => deck.id === deckId);
};

export const getHardcodedQuestions = (deckId: string, depthLevel?: 'standard' | 'deeper'): HardcodedQuestion[] => {
  const questions = HARDCODED_QUESTIONS.filter(question => question.deck_id === deckId);
  if (depthLevel) {
    return questions.filter(question => question.depth_level === depthLevel);
  }
  return questions;
};
