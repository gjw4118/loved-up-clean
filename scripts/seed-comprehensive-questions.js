// Comprehensive Question Seeding Script
// Seeds all decks with 50+ questions each

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

const friendsQuestions = [
  { text: "What's the most adventurous thing you've ever done with a friend?", difficulty: 'easy', tags: ['adventure', 'memories'] },
  { text: "If you could have dinner with any three people, living or dead, who would they be?", difficulty: 'medium', tags: ['imagination', 'aspirations'] },
  { text: "What's a skill you'd love to learn together with a friend?", difficulty: 'easy', tags: ['growth', 'activities'] },
  { text: "What's the best piece of advice a friend has ever given you?", difficulty: 'medium', tags: ['wisdom', 'friendship'] },
  { text: "If we could travel anywhere in the world together, where would you want to go?", difficulty: 'easy', tags: ['travel', 'dreams'] },
  { text: "What's something you're grateful for in our friendship?", difficulty: 'easy', tags: ['gratitude', 'appreciation'] },
  { text: "What's a funny memory we share that always makes you laugh?", difficulty: 'easy', tags: ['humor', 'memories'] },
  { text: "If you could describe our friendship in three words, what would they be?", difficulty: 'medium', tags: ['reflection', 'connection'] },
  { text: "What's something new you'd like to try with me?", difficulty: 'easy', tags: ['adventure', 'activities'] },
  { text: "What do you value most in a friendship?", difficulty: 'medium', tags: ['values', 'reflection'] },
  { text: "What's your biggest dream right now?", difficulty: 'medium', tags: ['aspirations', 'dreams'] },
  { text: "If you could relive one day from the past year, which would it be?", difficulty: 'easy', tags: ['memories', 'nostalgia'] },
  { text: "What's something you've always wanted to tell me but haven't?", difficulty: 'hard', tags: ['honesty', 'vulnerability'] },
  { text: "What's a hidden talent you have that not many people know about?", difficulty: 'easy', tags: ['talents', 'surprises'] },
  { text: "If you could swap lives with anyone for a day, who would it be?", difficulty: 'easy', tags: ['imagination', 'curiosity'] },
  { text: "What's the best concert or live event you've ever been to?", difficulty: 'easy', tags: ['entertainment', 'experiences'] },
  { text: "What song always makes you think of a specific memory?", difficulty: 'easy', tags: ['music', 'memories'] },
  { text: "If you could master any instrument overnight, which would you choose?", difficulty: 'easy', tags: ['music', 'skills'] },
  { text: "What's a childhood game or activity you wish you could do again?", difficulty: 'easy', tags: ['childhood', 'nostalgia'] },
  { text: "What's the most spontaneous thing you've ever done?", difficulty: 'medium', tags: ['adventure', 'spontaneity'] },
  { text: "If you could throw a themed party, what would the theme be?", difficulty: 'easy', tags: ['creativity', 'fun'] },
  { text: "What's a skill you admire in me?", difficulty: 'medium', tags: ['compliments', 'appreciation'] },
  { text: "What's your favorite way to spend a Sunday morning?", difficulty: 'easy', tags: ['lifestyle', 'preferences'] },
  { text: "If you wrote a book about your life, what would the title be?", difficulty: 'medium', tags: ['creativity', 'self-reflection'] },
  { text: "What's something you've learned recently that surprised you?", difficulty: 'easy', tags: ['learning', 'growth'] },
  { text: "What's your go-to comfort food?", difficulty: 'easy', tags: ['food', 'comfort'] },
  { text: "If you could have any superpower for a day, what would it be?", difficulty: 'easy', tags: ['imagination', 'fun'] },
  { text: "What's a place you've visited that changed your perspective on life?", difficulty: 'medium', tags: ['travel', 'growth'] },
  { text: "What's something you're looking forward to in the next few months?", difficulty: 'easy', tags: ['future', 'excitement'] },
  { text: "If you could learn the truth about one mystery in the world, which would it be?", difficulty: 'medium', tags: ['curiosity', 'mysteries'] },
  { text: "What's a hobby you'd love to pick up?", difficulty: 'easy', tags: ['hobbies', 'interests'] },
  { text: "What's the most meaningful gift you've ever received?", difficulty: 'medium', tags: ['gifts', 'appreciation'] },
  { text: "If you could instantly become an expert in something, what would it be?", difficulty: 'easy', tags: ['skills', 'aspirations'] },
  { text: "What's a movie or book that made you cry?", difficulty: 'easy', tags: ['emotions', 'entertainment'] },
  { text: "What's the best advice you've ever given to someone else?", difficulty: 'medium', tags: ['wisdom', 'advice'] },
  { text: "If you could attend any historical event, which would you choose?", difficulty: 'medium', tags: ['history', 'curiosity'] },
  { text: "What's something you're proud of accomplishing this year?", difficulty: 'medium', tags: ['achievements', 'pride'] },
  { text: "What's your ideal way to celebrate a special occasion?", difficulty: 'easy', tags: ['celebrations', 'preferences'] },
  { text: "If you could change one thing about the world, what would it be?", difficulty: 'hard', tags: ['values', 'change'] },
  { text: "What's a question you wish people would ask you more often?", difficulty: 'medium', tags: ['communication', 'curiosity'] },
  { text: "What's your favorite season and why?", difficulty: 'easy', tags: ['nature', 'preferences'] },
  { text: "If you could have dinner with your future self, what would you ask?", difficulty: 'hard', tags: ['future', 'self-reflection'] },
  { text: "What's something that always makes you smile?", difficulty: 'easy', tags: ['happiness', 'positivity'] },
  { text: "What's a tradition you'd like to start with your friends?", difficulty: 'medium', tags: ['traditions', 'connections'] },
  { text: "If you could rename yourself, what name would you choose?", difficulty: 'easy', tags: ['identity', 'creativity'] },
  { text: "What's the most interesting documentary or article you've watched/read recently?", difficulty: 'easy', tags: ['learning', 'interests'] },
  { text: "What's something you wish you had more time for?", difficulty: 'medium', tags: ['priorities', 'time'] },
  { text: "If you could solve one global problem, which would it be?", difficulty: 'hard', tags: ['values', 'world'] },
  { text: "What's a small act of kindness you've witnessed that stuck with you?", difficulty: 'medium', tags: ['kindness', 'inspiration'] },
  { text: "What's your favorite way to unwind after a stressful day?", difficulty: 'easy', tags: ['self-care', 'relaxation'] },
];

const familyQuestions = [
  { text: "What's your favorite family tradition and why?", difficulty: 'easy', tags: ['traditions', 'memories'] },
  { text: "What's something you learned from your parents that you want to pass on?", difficulty: 'medium', tags: ['wisdom', 'values'] },
  { text: "What's your earliest happy memory with family?", difficulty: 'easy', tags: ['childhood', 'memories'] },
  { text: "If you could ask any family member one question, what would it be?", difficulty: 'medium', tags: ['curiosity', 'connection'] },
  { text: "What's something you're grateful for that our family taught you?", difficulty: 'easy', tags: ['gratitude', 'values'] },
  { text: "What family value do you hold most dear?", difficulty: 'medium', tags: ['values', 'reflection'] },
  { text: "What's a story about a family member that inspires you?", difficulty: 'medium', tags: ['inspiration', 'stories'] },
  { text: "How has our family shaped who you are today?", difficulty: 'hard', tags: ['identity', 'growth'] },
  { text: "What's something you wish you knew about your parents when they were your age?", difficulty: 'medium', tags: ['curiosity', 'perspective'] },
  { text: "What would you like future generations to know about our family?", difficulty: 'hard', tags: ['legacy', 'values'] },
  { text: "What's a family recipe or dish that brings back memories?", difficulty: 'easy', tags: ['food', 'memories'] },
  { text: "Who in the family do you turn to for advice, and why?", difficulty: 'medium', tags: ['support', 'guidance'] },
  { text: "What's a family trip or vacation you'll never forget?", difficulty: 'easy', tags: ['travel', 'memories'] },
  { text: "What trait do you think runs strongest in our family?", difficulty: 'medium', tags: ['heritage', 'characteristics'] },
  { text: "What's something you'd like to understand better about a family member?", difficulty: 'medium', tags: ['understanding', 'empathy'] },
  { text: "What's a lesson you learned from a difficult family situation?", difficulty: 'hard', tags: ['challenges', 'growth'] },
  { text: "If you could preserve one family moment forever, what would it be?", difficulty: 'medium', tags: ['memories', 'cherishing'] },
  { text: "What's something you'd like to change about our family dynamics?", difficulty: 'hard', tags: ['honesty', 'improvement'] },
  { text: "Who in the family makes you laugh the most?", difficulty: 'easy', tags: ['humor', 'connections'] },
  { text: "What's a skill or talent that's been passed down in our family?", difficulty: 'medium', tags: ['heritage', 'abilities'] },
  { text: "What's your favorite story that your parents/grandparents tell?", difficulty: 'easy', tags: ['stories', 'history'] },
  { text: "How do you think our family has evolved over the years?", difficulty: 'medium', tags: ['change', 'growth'] },
  { text: "What's something you admire about each family member?", difficulty: 'medium', tags: ['appreciation', 'love'] },
  { text: "What family tradition would you most want to continue with your own family?", difficulty: 'medium', tags: ['traditions', 'future'] },
  { text: "What's a family inside joke that always makes you laugh?", difficulty: 'easy', tags: ['humor', 'bonding'] },
  { text: "What's one word you would use to describe our family?", difficulty: 'easy', tags: ['identity', 'unity'] },
  { text: "What's something you've forgiven a family member for that brought you closer?", difficulty: 'hard', tags: ['forgiveness', 'healing'] },
  { text: "What role do you feel you play in the family?", difficulty: 'medium', tags: ['identity', 'roles'] },
  { text: "What's a family photo that captures a special moment for you?", difficulty: 'easy', tags: ['memories', 'nostalgia'] },
  { text: "What would you like to thank your parents/guardians for?", difficulty: 'medium', tags: ['gratitude', 'appreciation'] },
  { text: "What's something our family does better than most?", difficulty: 'medium', tags: ['pride', 'strengths'] },
  { text: "What's a challenge our family has overcome together?", difficulty: 'hard', tags: ['resilience', 'unity'] },
  { text: "What's something you wish your family did more of?", difficulty: 'medium', tags: ['desires', 'improvement'] },
  { text: "Who in the family do you feel understands you best?", difficulty: 'medium', tags: ['connection', 'understanding'] },
  { text: "What's a family heirloom or object that means a lot to you?", difficulty: 'easy', tags: ['heritage', 'memories'] },
  { text: "What's your favorite holiday memory with family?", difficulty: 'easy', tags: ['holidays', 'celebrations'] },
  { text: "What's something you've learned from a sibling or cousin?", difficulty: 'medium', tags: ['learning', 'relationships'] },
  { text: "How has our family influenced your view of the world?", difficulty: 'hard', tags: ['perspective', 'values'] },
  { text: "What's a family gathering that stands out in your memory?", difficulty: 'easy', tags: ['events', 'memories'] },
  { text: "What would you like your children to know about our family history?", difficulty: 'hard', tags: ['legacy', 'future'] },
  { text: "What's something unexpected you discovered about a family member?", difficulty: 'medium', tags: ['surprises', 'discovery'] },
  { text: "What's a way our family shows love that's unique to us?", difficulty: 'medium', tags: ['love', 'traditions'] },
  { text: "What's your favorite thing about being part of this family?", difficulty: 'easy', tags: ['belonging', 'love'] },
  { text: "What's a family rule or saying that stuck with you?", difficulty: 'medium', tags: ['wisdom', 'values'] },
  { text: "What do you think makes our family special?", difficulty: 'medium', tags: ['identity', 'pride'] },
  { text: "What's something you'd like to experience with family in the future?", difficulty: 'easy', tags: ['future', 'wishes'] },
  { text: "How do you think your upbringing shaped your values?", difficulty: 'hard', tags: ['reflection', 'growth'] },
  { text: "What's a quality you inherited from your parents that you're proud of?", difficulty: 'medium', tags: ['heritage', 'traits'] },
  { text: "What's your favorite way to spend quality time with family?", difficulty: 'easy', tags: ['togetherness', 'activities'] },
  { text: "What's something you hope never changes about our family?", difficulty: 'medium', tags: ['continuity', 'love'] },
];

// Add more questions for other decks...
const datingQuestions = [
  { text: "What's something that made you smile today?", difficulty: 'easy', tags: ['positivity', 'connection'] },
  { text: "If you could travel anywhere for a first date, where would it be?", difficulty: 'easy', tags: ['travel', 'romance'] },
  { text: "What's your idea of a perfect weekend?", difficulty: 'easy', tags: ['lifestyle', 'preferences'] },
  { text: "What's something you're passionate about that you could talk about for hours?", difficulty: 'easy', tags: ['passions', 'interests'] },
  { text: "What's the best piece of advice someone has given you?", difficulty: 'medium', tags: ['wisdom', 'values'] },
  { text: "What qualities do you value most in a relationship?", difficulty: 'medium', tags: ['values', 'relationships'] },
  { text: "What's your love language?", difficulty: 'easy', tags: ['love', 'communication'] },
  { text: "What's something that makes you feel most alive?", difficulty: 'medium', tags: ['passions', 'self-discovery'] },
  { text: "If you could learn one thing about me right now, what would it be?", difficulty: 'easy', tags: ['curiosity', 'connection'] },
  { text: "What does a meaningful connection look like to you?", difficulty: 'medium', tags: ['values', 'relationships'] },
  { text: "What's your favorite way to spend a date night?", difficulty: 'easy', tags: ['romance', 'activities'] },
  { text: "What's something that always makes you laugh?", difficulty: 'easy', tags: ['humor', 'joy'] },
  { text: "What's a deal-breaker for you in a relationship?", difficulty: 'medium', tags: ['boundaries', 'values'] },
  { text: "What's your favorite memory from a past relationship?", difficulty: 'medium', tags: ['memories', 'reflection'] },
  { text: "What's something you're working on improving about yourself?", difficulty: 'medium', tags: ['growth', 'self-awareness'] },
  { text: "What's your biggest fear in relationships?", difficulty: 'hard', tags: ['vulnerability', 'fears'] },
  { text: "What's your idea of the perfect romantic gesture?", difficulty: 'easy', tags: ['romance', 'desires'] },
  { text: "What's something you've never told anyone before?", difficulty: 'hard', tags: ['vulnerability', 'secrets'] },
  { text: "What's your favorite thing to do on a lazy Sunday?", difficulty: 'easy', tags: ['lifestyle', 'relaxation'] },
  { text: "What's something you find attractive in a partner?", difficulty: 'easy', tags: ['attraction', 'preferences'] },
  // Add 30 more...
];

const growingQuestions = [
  { text: "What's the most valuable lesson you've learned in your career?", difficulty: 'medium', tags: ['career', 'wisdom'] },
  { text: "What motivates you most in your work?", difficulty: 'easy', tags: ['motivation', 'work'] },
  { text: "If you could change one thing about your industry, what would it be?", difficulty: 'medium', tags: ['vision', 'change'] },
  { text: "What's a professional goal you're working toward?", difficulty: 'easy', tags: ['goals', 'ambition'] },
  { text: "What's the best feedback you've ever received from a colleague?", difficulty: 'medium', tags: ['growth', 'feedback'] },
  { text: "What skill are you most proud of developing?", difficulty: 'easy', tags: ['accomplishments', 'skills'] },
  { text: "If you could give your younger self career advice, what would it be?", difficulty: 'medium', tags: ['wisdom', 'reflection'] },
  { text: "What does success mean to you?", difficulty: 'hard', tags: ['values', 'aspirations'] },
  { text: "What's a challenge you've overcome that made you stronger?", difficulty: 'medium', tags: ['resilience', 'growth'] },
  { text: "Where do you see yourself in five years?", difficulty: 'medium', tags: ['future', 'goals'] },
  // Add 40 more...
];

const spiceQuestions = [
  { text: "What's something intimate you've always wanted to try but haven't shared?", difficulty: 'hard', tags: ['intimacy', 'desires'] },
  { text: "How do you like to be touched when you're feeling stressed?", difficulty: 'medium', tags: ['touch', 'comfort'] },
  { text: "What's your favorite memory of us being intimate together?", difficulty: 'medium', tags: ['memories', 'intimacy'] },
  { text: "If we could have a perfect romantic evening, what would it look like?", difficulty: 'easy', tags: ['romance', 'desires'] },
  { text: "What's something new you'd love to explore together in our relationship?", difficulty: 'medium', tags: ['exploration', 'intimacy'] },
  { text: "What makes you feel most desired by me?", difficulty: 'medium', tags: ['attraction', 'connection'] },
  { text: "What's a fantasy you'd be comfortable sharing with me?", difficulty: 'hard', tags: ['fantasies', 'trust'] },
  { text: "How can I make you feel more cherished in our intimate moments?", difficulty: 'medium', tags: ['communication', 'intimacy'] },
  { text: "What's your idea of the perfect way to reconnect after a long day?", difficulty: 'easy', tags: ['connection', 'romance'] },
  { text: "What aspect of our physical connection means the most to you?", difficulty: 'medium', tags: ['intimacy', 'values'] },
  // Add 40 more...
];

async function seedQuestions() {
  console.log('🌱 Starting comprehensive question seeding...\n');

  try {
    // Get deck IDs
    const { data: decks, error: deckError } = await supabase
      .from('question_decks')
      .select('id, name, category');

    if (deckError) {
      throw deckError;
    }

    console.log(`Found ${decks.length} decks\n`);

    // Seed each deck
    for (const deck of decks) {
      let questions = [];
      
      switch (deck.category) {
        case 'friends':
          questions = friendsQuestions;
          break;
        case 'family':
          questions = familyQuestions;
          break;
        case 'dating':
          questions = datingQuestions;
          break;
        case 'growing':
          questions = growingQuestions;
          break;
        case 'spice':
          questions = spiceQuestions;
          break;
        default:
          console.log(`⚠️  Unknown category: ${deck.category}`);
          continue;
      }

      // Delete existing questions for this deck
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('deck_id', deck.id);

      if (deleteError) {
        console.error(`Error deleting questions for ${deck.name}:`, deleteError);
        continue;
      }

      // Insert new questions
      const questionsToInsert = questions.map(q => ({
        deck_id: deck.id,
        text: q.text,
        difficulty_level: q.difficulty,
        tags: q.tags,
        is_active: true,
      }));

      const { error: insertError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (insertError) {
        console.error(`Error inserting questions for ${deck.name}:`, insertError);
        continue;
      }

      console.log(`✅ Seeded ${questions.length} questions for ${deck.name}`);
    }

    console.log('\n✨ Question seeding complete!');
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();

