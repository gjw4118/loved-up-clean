// Expanded Question Seeding Script for GoDeeper App
// Seeds the database with 250+ questions across 5 decks

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

// Question decks data - matching app constants
const QUESTION_DECKS = [
  {
    name: 'Friends',
    description: 'Fun social questions for friends - create memorable moments and deepen friendships',
    category: 'friends',
    icon: 'F',
  },
  {
    name: 'Family',
    description: 'Connection and reconnection questions for family members who do not connect',
    category: 'family',
    icon: '🏠',
  },
  {
    name: 'Dating',
    description: 'Questions for people who are starting to date, perfect for early dates',
    category: 'romantic', // Maps to Dating deck
    icon: '💕',
  },
  {
    name: 'Growing',
    description: 'Questions about work, aspirations, career, goals, and personal growth',
    category: 'professional', // Maps to Growing deck
    icon: '🌱',
  },
  {
    name: 'Spice',
    description: 'Premium intimate questions for couples to deepen connection and rekindle passion',
    category: 'romantic', // Will create separate category later
    icon: '🔥',
  },
];

// Expanded questions for each deck (50+ per category)
const EXPANDED_QUESTIONS = {
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
    "What childhood game or activity do you wish we could do again?",
    "What's your go-to karaoke song and why?",
    "If you could master any musical instrument instantly, which would you choose?",
    "What's a random skill or talent you have that most people don't know about?",
    "What's the best concert or live event you've ever attended?",
    "If you could throw a themed party, what would the theme be?",
    "What's your favorite board game or card game?",
    "What's something that always makes you laugh, no matter what?",
    "If you could have any superpower for 24 hours, what would you do?",
    "What's the best prank you've ever pulled or had pulled on you?",
    "What's your comfort food when you're having a bad day?",
    "If you could live in any fictional universe, which would it be?",
    "What's a movie you can watch over and over without getting tired of it?",
    "What's your favorite holiday and how do you like to celebrate it?",
    "If you could instantly become an expert in something, what would it be?",
    "What's the most spontaneous thing you've ever done?",
    "What's your ideal way to spend a lazy Sunday?",
    "If you could have coffee with any historical figure, who would it be?",
    "What's something you're currently learning or trying to improve?",
    "What's the best gift you've ever received from a friend?",
    "If you could create a new holiday, what would it celebrate?",
    "What's your favorite way to get energized when you're feeling down?",
    "What's a tradition you want to start with your friends?",
    "If you could witness any historical event, what would it be?",
    "What's the most memorable trip you've ever taken?",
    "What's something you believed as a kid that you later found out wasn't true?",
    "If you could have dinner with your past self, what age would you choose?",
    "What's your favorite season and what do you love about it?",
    "What's a skill from the past (like calligraphy or horseback riding) you wish was still common?",
    "If you could swap lives with someone for a week, who would it be?",
    "What's the best advice you'd give to your younger self?",
    "What's your favorite way to celebrate a friend's success?",
    "If you could have any animal as a pet (real or mythical), what would you choose?",
    "What's something you're looking forward to in the next year?",
    "What's the most interesting thing you've learned recently?",
    "If you could time travel, would you go to the past or future?",
    "What's a fear you've overcome or are working to overcome?",
    "What's your favorite way to unwind after a stressful day?",
    "If you could live anywhere in the world for a year, where would you go?",
    "What's something about yourself that has changed the most over the years?",
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
    "What's a lesson you learned from a grandparent or older relative?",
    "What's your favorite family gathering or celebration?",
    "If you could preserve one family memory forever, which would it be?",
    "What's something you admire about another family member?",
    "What's a family inside joke that always makes you laugh?",
    "If you could tell your parents one thing, what would it be?",
    "What's something you wish you knew about your family history?",
    "What's your favorite thing to do with your siblings or cousins?",
    "If you could create a new family tradition, what would it be?",
    "What's something your family does better than anyone else?",
    "What's a challenge our family has overcome together?",
    "What's your favorite family vacation or outing?",
    "If you could ask an ancestor about their life, what would you want to know?",
    "What's something you learned from a difficult family experience?",
    "What's your favorite family meal or gathering?",
    "What's a value that's important in our family?",
    "If you could change one thing about family gatherings, what would it be?",
    "What's something you appreciate more about your family now than when you were younger?",
    "What's your favorite memory from growing up?",
    "If you could give one piece of advice to a younger family member, what would it be?",
    "What's something your family taught you about relationships?",
    "What's a quality you got from your parents that you're proud of?",
    "If you could spend a day with any family member, who would it be and why?",
    "What's something you wish you had asked a family member before they passed?",
    "What's your favorite family photo or memory?",
    "If you could bring back one family tradition, what would it be?",
    "What's something that reminds you of home?",
    "What's a family achievement you're proud of?",
    "If you could have a family talent show, what would your talent be?",
    "What's something you want to thank a family member for?",
    "What's your favorite way to stay connected with distant family?",
    "If you could have a family reunion anywhere, where would it be?",
    "What's a lesson about family that you want to pass on?",
    "What's something your family does that other families might find unique?",
    "If you could freeze time at any family moment, which would it be?",
    "What's a tradition from your culture that you want to continue?",
    "What's your favorite thing about family gatherings?",
    "If you could tell your younger self something about family, what would it be?",
    "What's a family member's story that inspires you?",
    "What's something you've learned about love from your family?",
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
    "What's something that made you smile today?",
    "If you could travel anywhere for a first date, where would it be?",
    "What's your idea of a perfect weekend together?",
    "What's something you're passionate about that you could talk about for hours?",
    "What's the best piece of advice someone has given you about relationships?",
    "What's your love language and how do you like to receive affection?",
    "What's a song that reminds you of us?",
    "If we could have a perfect date night, what would it look like?",
    "What's something you've always wanted to learn with a partner?",
    "What's your favorite way to show someone you care?",
    "If you could relive our first date, would you change anything?",
    "What's something that attracted you to me initially?",
    "What's a quality you admire most in a partner?",
    "If we could have any adventure together, what would it be?",
    "What's your favorite way to spend quality time together?",
    "What's something you appreciate about our communication?",
    "If you could give relationship advice to your younger self, what would it be?",
    "What's a goal you have for our relationship?",
    "What's your favorite inside joke or memory we share?",
    "If we could have a couples' bucket list, what would be on it?",
    "What's something I do that always makes you laugh?",
    "What's your ideal way to celebrate special occasions together?",
    "If you could describe our relationship in three words, what would they be?",
    "What's something you want to get better at in relationships?",
    "What's your favorite thing we do together?",
    "If we could learn a new skill together, what would you want it to be?",
    "What's something you're looking forward to experiencing with me?",
    "What's your favorite physical affection gesture?",
    "If you could plan a surprise for me, what would it be?",
    "What's something that helps you feel connected to me?",
    "What's a value that's important to you in relationships?",
    "If we could have a tradition just for us, what would it be?",
    "What's something you've learned about love from past experiences?",
    "What's your favorite way to support your partner?",
    "If we could time travel together, where and when would we go?",
    "What's something you want to achieve together this year?",
    "What's your favorite way to resolve conflicts?",
    "If you could describe your ideal partner, what qualities would they have?",
    "What's something you appreciate about how we handle challenges?",
    "What's your favorite thing about dating or being in a relationship?",
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
    "If you could have any job in the world, what would it be?",
    "What's the best piece of career advice you've received?",
    "What's something you're passionate about in your field?",
    "If you could mentor someone, what would you teach them?",
    "What's a professional risk you're glad you took?",
    "What's your favorite thing about your current role?",
    "If you could start a business, what would it be?",
    "What's something you've learned from a difficult work situation?",
    "What's your approach to work-life balance?",
    "If you could collaborate with anyone, who would it be?",
    "What's a trend in your industry that excites you?",
    "What's the most important quality in a team member?",
    "If you could automate one part of your job, what would it be?",
    "What's something you wish more people knew about your profession?",
    "What's your favorite way to celebrate work successes?",
    "If you could give a TED Talk, what would it be about?",
    "What's a book or podcast that influenced your career?",
    "What's your strategy for handling workplace stress?",
    "If you could work from anywhere, where would you choose?",
    "What's something you've improved at professionally in the last year?",
    "What's the best professional relationship you've built?",
    "If you could attend any conference or workshop, which would it be?",
    "What's a skill from outside your field that helps you at work?",
    "What's your favorite way to continue learning and growing?",
    "If you could change one thing about how people work, what would it be?",
    "What's something you admire about a colleague or leader?",
    "What's your philosophy on leadership?",
    "If you could solve one problem in your industry, what would it be?",
    "What's the most innovative idea you've seen in your field?",
    "What's your approach to networking and building connections?",
    "If you could have a different role for a month, what would you try?",
    "What's something you're currently learning for professional growth?",
    "What's the best team you've ever been part of and why?",
    "If you could give advice to someone entering your field, what would it be?",
    "What's a project that challenged you the most?",
    "What's your favorite thing about professional development?",
    "If you could redesign your workplace, what would you change?",
    "What's a value that guides your professional decisions?",
    "What's something you want to be known for professionally?",
    "If you could take a sabbatical to learn something, what would it be?",
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
  
  if (lowerText.includes('memory') || lowerText.includes('remember') || lowerText.includes('favorite memory')) {
    baseTags.push('memory');
  }
  if (lowerText.includes('future') || lowerText.includes('goal') || lowerText.includes('hope')) {
    baseTags.push('future');
  }
  if (lowerText.includes('favorite') || lowerText.includes('best') || lowerText.includes('most')) {
    baseTags.push('preferences');
  }
  if (lowerText.includes('advice') || lowerText.includes('learn') || lowerText.includes('lesson')) {
    baseTags.push('wisdom');
  }
  if (lowerText.includes('together') || lowerText.includes('with') || lowerText.includes('us')) {
    baseTags.push('shared');
  }
  if (lowerText.includes('feel') || lowerText.includes('emotion')) {
    baseTags.push('emotional');
  }
  if (lowerText.includes('dream') || lowerText.includes('ideal') || lowerText.includes('perfect')) {
    baseTags.push('aspirational');
  }

  return baseTags;
}

// Clear existing data
async function clearExistingData() {
  console.log('🗑️  Clearing existing data...');
  
  // Delete questions first (due to foreign keys)
  const { error: questionsError } = await supabase
    .from('questions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (questionsError) {
    console.warn('⚠️  Note on questions cleanup:', questionsError.message);
  }

  // Delete decks
  const { error: decksError } = await supabase
    .from('question_decks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (decksError) {
    console.warn('⚠️  Note on decks cleanup:', decksError.message);
  }

  console.log('✅ Existing data cleared');
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
    .insert(decksToSeed)
    .select();

  if (error) {
    console.error('❌ Error seeding decks:', error);
    throw error;
  }

  console.log(`✅ Successfully seeded ${decksToSeed.length} question decks`);
  return data;
}

// Seed questions for each deck
async function seedQuestions() {
  console.log('❓ Seeding questions...');
  
  // Get the actual deck IDs from the database
  const { data: decks, error: decksError } = await supabase
    .from('question_decks')
    .select('id, category, name')
    .eq('is_active', true);

  if (decksError) {
    console.error('❌ Error fetching decks:', decksError);
    throw decksError;
  }

  const questionsToSeed = [];

  // Generate questions for each deck category
  Object.entries(EXPANDED_QUESTIONS).forEach(([category, questions]) => {
    const deck = decks.find(d => d.category === category);
    if (!deck) {
      console.warn(`⚠️  No deck found for category: ${category}`);
      return;
    }

    console.log(`📝 Adding ${questions.length} questions for ${deck.name}...`);

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

  console.log(`📊 Total questions to seed: ${questionsToSeed.length}`);

  // Insert questions in batches
  const batchSize = 20;
  for (let i = 0; i < questionsToSeed.length; i += batchSize) {
    const batch = questionsToSeed.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('questions')
      .insert(batch);

    if (error) {
      console.error(`❌ Error seeding questions batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    console.log(`✅ Seeded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questionsToSeed.length / batchSize)}`);
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

  console.log('\n📊 Deck Summary:');
  decks?.forEach(deck => {
    console.log(`  ✓ ${deck.name}: ${deck.question_count || 0} questions`);
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

  console.log(`\n📈 Total active questions: ${count}`);
  console.log(`🎯 Target was 250+ questions: ${count >= 250 ? '✅ PASSED' : '⚠️  BELOW TARGET'}\n`);
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding for GoDeeper...\n');
    
    // Check if we have valid Supabase credentials
    if (!SUPABASE_URL || SUPABASE_URL === 'your-supabase-url') {
      console.error('❌ Please set your SUPABASE_URL in environment variables');
      process.exit(1);
    }
    
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-supabase-anon-key') {
      console.error('❌ Please set your SUPABASE_ANON_KEY in environment variables');
      process.exit(1);
    }
    
    await clearExistingData();
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

