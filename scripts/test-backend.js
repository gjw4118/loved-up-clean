// Test script for AI question generation
// This tests the API locally before deploying

const testAIGeneration = async () => {
  console.log('🧪 Testing AI Question Generation...');
  
  try {
    // Test the API endpoint
    const response = await fetch('https://loved-up-clean-lrhz7sgts-greg-woulfes-projects.vercel.app/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: 'friends',
        count: 2,
        difficulty: 'medium'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Generation Test Successful!');
      console.log('📝 Generated Questions:');
      data.questions.forEach((q, i) => {
        console.log(`${i + 1}. ${q.text}`);
        console.log(`   Difficulty: ${q.difficulty_level}`);
        console.log(`   Tags: ${q.tags.join(', ')}`);
      });
    } else {
      console.log('❌ AI Generation Test Failed');
      console.log('Status:', response.status);
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ AI Generation Test Error:', error.message);
  }
};

// Test Supabase connection
const testSupabaseConnection = async () => {
  console.log('🧪 Testing Supabase Connection...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    require('dotenv').config({ path: '.env.local' });
    
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase credentials not found in .env.local');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test fetching decks
    const { data: decks, error: decksError } = await supabase
      .from('question_decks')
      .select('*')
      .eq('is_active', true);
    
    if (decksError) {
      console.log('❌ Supabase Test Failed:', decksError.message);
      return;
    }
    
    console.log('✅ Supabase Connection Successful!');
    console.log(`📊 Found ${decks.length} active decks:`);
    decks.forEach(deck => {
      console.log(`   - ${deck.name} (${deck.category})`);
    });
    
    // Test fetching questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (questionsError) {
      console.log('❌ Questions Test Failed:', questionsError.message);
      return;
    }
    
    console.log(`📝 Found ${questions.length} sample questions:`);
    questions.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q.text.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.log('❌ Supabase Test Error:', error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Running Backend Tests...\n');
  
  await testSupabaseConnection();
  console.log('');
  await testAIGeneration();
  
  console.log('\n🎉 Tests completed!');
};

runTests();
