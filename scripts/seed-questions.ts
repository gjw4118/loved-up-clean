// Question Seeding Script for Connect App
// Seeds the database with sample questions from constants/decks.ts

import { QUESTION_DECKS, SAMPLE_QUESTIONS } from '../constants/decks.ts';
import { supabase } from '../lib/database/supabase.ts';
import { DeckCategory } from '../types/questions.ts';

interface QuestionSeed {
  deck_id: string;
  text: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  tags: string[];
  is_active: boolean;
}

interface DeckSeed {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  is_active: boolean;
}

// Seed question decks
async function seedDecks(): Promise<void> {
  console.log('🎯 Seeding question decks...');
  
  const decksToSeed: DeckSeed[] = QUESTION_DECKS.map(deck => ({
    id: deck.id,
    name: deck.name,
    description: deck.description,
    category: deck.category,
    icon: deck.icon,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('question_decks')
    .upsert(decksToSeed as any, { 
      onConflict: 'id',
      ignoreDuplicates: false 
    });

  if (error) {
    console.error('❌ Error seeding decks:', error);
    throw error;
  }

  console.log(`✅ Successfully seeded ${decksToSeed.length} question decks`);
}

// Seed questions for each deck
async function seedQuestions(): Promise<void> {
  console.log('❓ Seeding questions...');
  
  const questionsToSeed: QuestionSeed[] = [];

  // Generate questions for each deck category
  Object.entries(SAMPLE_QUESTIONS).forEach(([category, questions]) => {
    const deck = QUESTION_DECKS.find(d => d.category === category);
    if (!deck) return;

    questions.forEach((questionText, index) => {
      questionsToSeed.push({
        deck_id: deck.id,
        text: questionText,
        difficulty_level: getDifficultyLevel(index, questions.length),
        tags: generateTags(category as DeckCategory, questionText),
        is_active: true,
      });
    });
  });

  // Insert questions in batches to avoid overwhelming the database
  const batchSize = 10;
  for (let i = 0; i < questionsToSeed.length; i += batchSize) {
    const batch = questionsToSeed.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('questions')
      .upsert(batch as any, { 
        onConflict: 'deck_id,text',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error(`❌ Error seeding questions batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    console.log(`✅ Seeded batch ${i / batchSize + 1}/${Math.ceil(questionsToSeed.length / batchSize)}`);
  }

  console.log(`✅ Successfully seeded ${questionsToSeed.length} questions`);
}

// Helper function to assign difficulty levels
function getDifficultyLevel(index: number, total: number): 'easy' | 'medium' | 'hard' {
  const ratio = index / total;
  if (ratio < 0.3) return 'easy';
  if (ratio < 0.7) return 'medium';
  return 'hard';
}

// Helper function to generate tags based on category and content
function generateTags(category: DeckCategory, questionText: string): string[] {
  const baseTags: string[] = [category];
  
  // Add content-based tags
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

// Verify seeding results
async function verifySeeding(): Promise<void> {
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
  decks?.forEach((deck: any) => {
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
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedDecks();
    await seedQuestions();
    await verifySeeding();
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding script failed:', error);
      process.exit(1);
    });
}
