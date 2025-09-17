// Question Seeding Script for Connect App (JavaScript version)
// Seeds the database with sample questions

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Load Supabase credentials from environment
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Question decks data
const QUESTION_DECKS = [
  {
    name: 'Friends & Social',
    description: 'Questions to deepen friendships and create memorable moments with your social circle',
    category: 'friends',
    icon: '👥',
    color: '#FF6B35',
    gradient: ['#FF6B35', '#F7931E'],
    estimatedQuestions: 75,
  },
  {
    name: 'Family Bonds',
    description: 'Meaningful questions to strengthen family relationships across all generations',
    category: 'family',
    icon: '🏠',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#44A08D'],
    estimatedQuestions: 80,
  },
  {
    name: 'Love & Romance',
    description: 'Intimate questions for couples to explore deeper connection and understanding',
    category: 'romantic',
    icon: '💕',
    color: '#E74C3C',
    gradient: ['#E74C3C', '#C0392B'],
    estimatedQuestions: 70,
  },
  {
    name: 'Work & Growth',
    description: 'Professional questions for team building, networking, and career conversations',
    category: 'professional',
    icon: '💼',
    color: '#3498DB',
    gradient: ['#3498DB', '#2980B9'],
    estimatedQuestions: 65,
  },
];

// Sample questions for each deck
const SAMPLE_QUESTIONS = {
  friends: [
    "What's the most adventurous thing you've ever done with a friend?",
    "If you could have dinner with any three people, living or dead, who would they be?",
    "What's a skill you'd love to learn together with a friend?",
    "What's the best piece of advice a friend has ever given you?",
    "If we could travel anywhere in the world together, where would you want to go?",
    "What's something you've always wanted to try but haven't yet?",
    "What's your favorite way to spend a weekend with friends?",
    "If you could relive one day with a friend, which would it be?",
    "What's the funniest thing that's ever happened to you with a friend?",
    "What's something you're grateful for in our friendship?",
  ],
  family: [
    "What's your favorite family tradition and why?",
    "What's something you learned from your parents that you want to pass on?",
    "What's your earliest happy memory with family?",
    "If you could ask any family member one question, what would it be?",
    "What's something you're grateful for that our family taught you?",
    "What's a family story you love to hear over and over?",
    "What's something unique about our family that you cherish?",
    "If you could plan the perfect family day, what would it include?",
    "What's a family recipe or tradition you want to continue?",
    "What's something you hope future generations of our family will know?",
  ],
  romantic: [
    "What made you realize you were falling in love with me?",
    "What's your favorite memory of us together?",
    "How do you like to be comforted when you're feeling down?",
    "What's something new you'd like us to try together?",
    "What does your ideal future look like with me in it?",
    "What's something I do that makes you feel most loved?",
    "What's a dream or goal we could work toward together?",
    "What's your favorite thing about our relationship?",
    "What's something you've learned about yourself through our relationship?",
    "What's a small gesture that always makes your day better?",
  ],
  professional: [
    "What's the most valuable lesson you've learned in your career?",
    "What motivates you most in your work?",
    "If you could change one thing about your industry, what would it be?",
    "What's a professional goal you're working toward?",
    "What's the best feedback you've ever received from a colleague?",
    "What's a skill you'd like to develop further?",
    "What's the most challenging project you've worked on?",
    "What's something you wish you'd known when you started your career?",
    "What's your ideal work environment like?",
    "What's a professional achievement you're most proud of?",
  ],
};

// Helper function to assign difficulty levels
function getDifficultyLevel(index, total) {
  const ratio = index / total;
  if (ratio < 0.3) return 'easy';
  if (ratio < 0.7) return 'medium';
  return 'hard';
}

// Helper function to generate tags
function generateTags(category, questionText) {
  const baseTags = [category];
  const lowerText = questionText.toLowerCase();
  
  if (lowerText.includes('memory') || lowerText.includes('remember')) {
    baseTags.push('memory');
  }
  if (lowerText.includes('future') || lowerText.includes('goal')) {
    baseTags.push('future');
  }
  if (lowerText.includes('favorite') || lowerText.includes('best')) {
    baseTags.push('preferences');
  }
  if (lowerText.includes('advice') || lowerText.includes('learn')) {
    baseTags.push('wisdom');
  }
  if (lowerText.includes('together') || lowerText.includes('with')) {
    baseTags.push('shared');
  }

  return baseTags;
}

// Seed question decks
async function seedDecks() {
  console.log('🎯 Seeding question decks...');
  
  const decksToSeed = QUESTION_DECKS.map(deck => ({
    name: deck.name,
    description: deck.description,
    category: deck.category,
    icon: deck.icon,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('question_decks')
    .insert(decksToSeed);

  if (error) {
    console.error('❌ Error seeding decks:', error);
    throw error;
  }

  console.log(`✅ Successfully seeded ${decksToSeed.length} question decks`);
}

// Seed questions for each deck
async function seedQuestions() {
  console.log('❓ Seeding questions...');
  
  // First, get the actual deck IDs from the database
  const { data: decks, error: decksError } = await supabase
    .from('question_decks')
    .select('id, category')
    .eq('is_active', true);

  if (decksError) {
    console.error('❌ Error fetching decks:', decksError);
    throw decksError;
  }

  const questionsToSeed = [];

  // Generate questions for each deck category
  Object.entries(SAMPLE_QUESTIONS).forEach(([category, questions]) => {
    const deck = decks.find(d => d.category === category);
    if (!deck) return;

    questions.forEach((questionText, index) => {
      questionsToSeed.push({
        deck_id: deck.id,
        text: questionText,
        difficulty_level: getDifficultyLevel(index, questions.length),
        tags: generateTags(category, questionText),
        is_active: true,
      });
    });
  });

  // Insert questions in batches
  const batchSize = 10;
  for (let i = 0; i < questionsToSeed.length; i += batchSize) {
    const batch = questionsToSeed.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('questions')
      .insert(batch);

    if (error) {
      console.error(`❌ Error seeding questions batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    console.log(`✅ Seeded batch ${i / batchSize + 1}/${Math.ceil(questionsToSeed.length / batchSize)}`);
  }

  console.log(`✅ Successfully seeded ${questionsToSeed.length} questions`);
}

// Verify seeding results
async function verifySeeding() {
  console.log('🔍 Verifying seeding results...');
  
  // Check decks
  const { data: decks, error: decksError } = await supabase
    .from('question_decks')
    .select('id, name, question_count')
    .eq('is_active', true);

  if (decksError) {
    console.error('❌ Error verifying decks:', decksError);
    return;
  }

  console.log('📊 Deck Summary:');
  decks?.forEach(deck => {
    console.log(`  - ${deck.name}: ${deck.question_count || 0} questions`);
  });

  // Check total questions
  const { count, error: countError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (countError) {
    console.error('❌ Error counting questions:', countError);
    return;
  }

  console.log(`📈 Total active questions: ${count}`);
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if we have valid Supabase credentials
    if (!SUPABASE_URL || SUPABASE_URL === 'your-supabase-url') {
      console.error('❌ Please set your SUPABASE_URL in environment variables');
      process.exit(1);
    }
    
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
      console.error('❌ Please set your SUPABASE_ANON_KEY in environment variables');
      process.exit(1);
    }
    
    await seedDecks();
    await seedQuestions();
    await verifySeeding();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    throw error;
  }
}

// Run seeding
seedDatabase()
  .then(() => {
    console.log('✅ Seeding script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  });
