// Updated Question Seeding Script for Connect App
// Seeds the database with new deck structure: Friends, Lovers, Family, Work, Spice (Premium)

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

// Updated Question decks data - matching current schema
const QUESTION_DECKS = [
  {
    name: 'Friends',
    description: 'Questions to deepen friendships and create memorable moments',
    category: 'friends',
    icon: '👥',
    question_count: 25,
  },
  {
    name: 'Lovers',
    description: 'Intimate questions for couples to explore deeper connection',
    category: 'romantic', // Using existing 'romantic' category
    icon: '💕',
    question_count: 25,
  },
  {
    name: 'Family',
    description: 'Meaningful questions to strengthen family relationships',
    category: 'family',
    icon: '🏠',
    question_count: 25,
  },
  {
    name: 'Work',
    description: 'Professional questions for team building and career conversations',
    category: 'professional',
    icon: '💼',
    question_count: 25,
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
    "What's a secret talent you have that most people don't know about?",
    "What's the most spontaneous thing you've ever done?",
    "If you could be famous for one thing, what would it be?",
    "What's something you wish you could tell your younger self?",
    "What's your idea of the perfect day off?",
    "What's a book, movie, or song that changed your perspective?",
    "What's something you're proud of but don't often talk about?",
    "If you could master any skill instantly, what would it be?",
    "What's the most important lesson you've learned in life?",
    "What's something that always makes you laugh?",
    "If you could live anywhere in the world, where would it be?",
    "What's a habit you're trying to break or start?",
    "What's something you find beautiful that others might not?",
    "If you could have any superpower, what would it be?",
    "What's something you're looking forward to in the future?",
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
    "What's your love language and how can I better express it?",
    "What's something about me that surprised you when we first met?",
    "What's a tradition you'd like us to start together?",
    "What's something you're grateful for in our relationship?",
    "How do you like to be surprised?",
    "What's a challenge we've overcome together that made us stronger?",
    "What's something you want to learn about me that you don't know yet?",
    "What's your favorite way to spend quality time together?",
    "What's something you're proud of me for?",
    "What's a place you'd love to travel to with me?",
    "What's something that always makes you think of me?",
    "What's a quality you admire most about me?",
    "What's something you'd like to do together that we haven't tried?",
    "What's a habit of mine that you find endearing?",
    "What's something you're excited to experience together in the future?",
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
    "What's a family member you look up to most and why?",
    "What's a family vacation memory that stands out?",
    "What's something you wish you could tell a family member who's no longer here?",
    "What's a family trait you're proud to have inherited?",
    "What's something you've learned about family from watching others?",
    "What's a family tradition you'd like to start?",
    "What's something you appreciate about each family member?",
    "What's a family challenge that brought you closer together?",
    "What's something you want future family members to know about our family?",
    "What's a family value that's most important to you?",
    "What's a family memory that always makes you smile?",
    "What's something you've learned about love from your family?",
    "What's a family tradition that means the most to you?",
    "What's something you're grateful for about our family dynamic?",
    "What's a family goal or dream you'd like to work toward together?",
  ],
  work: [
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
    "What's something you've learned about leadership?",
    "What's a work challenge that taught you the most?",
    "What's something you appreciate about your current team?",
    "What's a professional skill you'd like to master?",
    "What's something you've learned about work-life balance?",
    "What's a mentor or colleague who's influenced your career?",
    "What's something you'd like to change about workplace culture?",
    "What's a professional mistake that taught you something valuable?",
    "What's something you're excited about in your field?",
    "What's a professional goal you're setting for next year?",
    "What's something you've learned about teamwork?",
    "What's a professional skill that's become more important recently?",
    "What's something you'd like to teach others in your field?",
    "What's a professional challenge you're currently facing?",
    "What's something you're grateful for in your career journey?",
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
    "What's something you've learned about leadership?",
    "What's a work challenge that taught you the most?",
    "What's something you appreciate about your current team?",
    "What's a professional skill you'd like to master?",
    "What's something you've learned about work-life balance?",
    "What's a mentor or colleague who's influenced your career?",
    "What's something you'd like to change about workplace culture?",
    "What's a professional mistake that taught you something valuable?",
    "What's something you're excited about in your field?",
    "What's a professional goal you're setting for next year?",
    "What's something you've learned about teamwork?",
    "What's a professional skill that's become more important recently?",
    "What's something you'd like to teach others in your field?",
    "What's a professional challenge you're currently facing?",
    "What's something you're grateful for in your career journey?",
  ],
  spice: [
    "What's something new you'd like to explore together intimately?",
    "What's your favorite way to show affection when we're alone?",
    "What's something that makes you feel most desired?",
    "What's a fantasy you've never shared before?",
    "What's your ideal way to spend an intimate evening together?",
    "What's something you'd like me to do more often?",
    "What's a memory of us together that still makes you smile?",
    "What's something you find most attractive about me?",
    "What's a way you'd like to surprise me romantically?",
    "What's something you've always wanted to try but haven't yet?",
    "What's your favorite way to be touched?",
    "What's something that turns you on that might surprise me?",
    "What's a romantic gesture that means the most to you?",
    "What's something you'd like to learn about each other's desires?",
    "What's your favorite memory of our first time together?",
    "What's something you find sexy that you haven't told me?",
    "What's a way you'd like to feel more connected physically?",
    "What's something you'd like to explore about intimacy together?",
    "What's a romantic surprise you've been thinking about?",
    "What's something about our physical connection that you love most?",
    "What's a way you'd like to feel more desired by me?",
    "What's something you'd like to try that we haven't discussed?",
    "What's your favorite way to build anticipation together?",
    "What's something about intimacy that you'd like to understand better?",
    "What's a way you'd like to feel more adventurous together?",
    "What's something you find most exciting about our physical relationship?",
    "What's a way you'd like to feel more confident in our intimacy?",
    "What's something you'd like to discover about each other's bodies?",
    "What's a romantic fantasy you'd like to make reality?",
    "What's something about our intimate connection that you're grateful for?",
    "What's a way you'd like to feel more playful together?",
    "What's something you'd like to explore about pleasure together?",
    "What's a romantic gesture that would make you feel most loved?",
    "What's something you'd like to try that would surprise me?",
    "What's a way you'd like to feel more connected emotionally and physically?",
    "What's something you find most arousing about our relationship?",
    "What's a romantic experience you'd like to create together?",
    "What's something about intimacy that you'd like to learn more about?",
    "What's a way you'd like to feel more adventurous in our relationship?",
    "What's something you'd like to explore about desire together?",
    "What's a romantic memory you'd like to recreate?",
    "What's something you'd like to try that would bring us closer?",
    "What's a way you'd like to feel more desired and wanted?",
    "What's something about our physical connection that excites you most?",
    "What's a romantic fantasy you'd like to share with me?",
    "What's something you'd like to discover about pleasure together?",
    "What's a way you'd like to feel more confident in expressing desires?",
    "What's something about intimacy that you'd like to explore deeper?",
    "What's a romantic experience you'd like to plan together?",
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
  if (category === 'spice' && (lowerText.includes('intimate') || lowerText.includes('desire'))) {
    baseTags.push('intimacy');
  }

  return baseTags;
}

// Seed question decks
async function seedDecks() {
  console.log('🎯 Seeding updated question decks...');
  
  const decksToSeed = QUESTION_DECKS.map(deck => ({
    name: deck.name,
    description: deck.description,
    category: deck.category,
    icon: deck.icon,
    question_count: deck.question_count,
  }));

  // Clear existing decks
  const { error: deleteError } = await supabase
    .from('question_decks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

  if (deleteError) {
    console.error('Error clearing existing decks:', deleteError);
  } else {
    console.log('✅ Cleared existing decks');
  }

  // Insert new decks
  const { data: insertedDecks, error: insertError } = await supabase
    .from('question_decks')
    .insert(decksToSeed)
    .select();

  if (insertError) {
    console.error('Error inserting decks:', insertError);
    return;
  }

  console.log(`✅ Successfully seeded ${insertedDecks.length} question decks`);
  return insertedDecks;
}

// Seed questions for each deck
async function seedQuestions(decks) {
  console.log('📝 Seeding questions...');
  
  let totalQuestions = 0;
  
  for (const deck of decks) {
    const questions = SAMPLE_QUESTIONS[deck.category] || [];
    console.log(`   Seeding ${questions.length} questions for ${deck.name}...`);
    
    const questionsToSeed = questions.map((questionText, index) => ({
      deck_id: deck.id,
      text: questionText,
      difficulty_level: getDifficultyLevel(index, questions.length),
      tags: generateTags(deck.category, questionText),
    }));

    // Clear existing questions for this deck
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('deck_id', deck.id);

    if (deleteError) {
      console.error(`Error clearing questions for ${deck.name}:`, deleteError);
      continue;
    }

    // Insert questions for this deck
    const { error: insertError } = await supabase
      .from('questions')
      .insert(questionsToSeed);

    if (insertError) {
      console.error(`Error inserting questions for ${deck.name}:`, insertError);
      continue;
    }

    totalQuestions += questions.length;
    console.log(`   ✅ Seeded ${questions.length} questions for ${deck.name}`);
  }

  console.log(`✅ Successfully seeded ${totalQuestions} total questions`);
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Seed decks first
    const decks = await seedDecks();
    if (!decks || decks.length === 0) {
      console.error('❌ No decks were seeded. Aborting.');
      return;
    }

    // Seed questions for each deck
    await seedQuestions(decks);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${decks.length} question decks`);
    
    // Count questions per deck
    for (const deck of decks) {
      const questions = SAMPLE_QUESTIONS[deck.category] || [];
      console.log(`   • ${deck.name}: ${questions.length} questions (${deck.free_questions} free, ${deck.is_premium ? 'Premium' : 'Standard'})`);
    }
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

// Run the seeding
seedDatabase();
