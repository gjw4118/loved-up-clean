require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log('🔍 Checking Supabase Database...\n');
  
  // Check question_decks
  console.log('📚 Question Decks:');
  const { data: decks, error: decksError } = await supabase
    .from('question_decks')
    .select('*')
    .order('name');
  
  if (decksError) {
    console.error('Error fetching decks:', decksError);
  } else {
    console.log(`Found ${decks.length} decks:`);
    decks.forEach(deck => {
      console.log(`  - ${deck.name} (${deck.category})`);
      console.log(`    ID: ${deck.id}`);
      console.log(`    Question Count: ${deck.question_count}`);
      console.log(`    Icon: ${deck.icon}`);
      console.log('');
    });
  }
  
  // Check questions for each deck
  console.log('\n❓ Questions per deck:');
  if (decks) {
    for (const deck of decks) {
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('deck_id', deck.id);
      
      if (questionsError) {
        console.error(`Error fetching questions for ${deck.name}:`, questionsError);
      } else {
        console.log(`  ${deck.name}: ${questions.length} questions`);
        if (questions.length > 0) {
          console.log(`    First question: "${questions[0].text.substring(0, 60)}..."`);
        }
      }
    }
  }
  
  // Check database schema
  console.log('\n🗄️  Database Tables:');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');
    
  if (!tablesError && tables) {
    console.log('Available tables:', tables.map(t => t.table_name).join(', '));
  }
}

checkDatabase().catch(console.error);
