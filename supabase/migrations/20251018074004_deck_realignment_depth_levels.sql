-- Deck Realignment & Depth Level Migration
-- Replace difficulty_level with depth_level
-- Update from 5 to 7 decks with new categories
-- Add 350 questions (25 standard + 25 deeper per deck)

-- 1. Delete all existing questions and decks FIRST (before adding new constraints)
DELETE FROM questions;
DELETE FROM question_decks;

-- 2. Drop the old CHECK constraint on categories
ALTER TABLE question_decks DROP CONSTRAINT IF EXISTS question_decks_category_check;

-- 3. Add new CHECK constraint with all 7 categories
ALTER TABLE question_decks ADD CONSTRAINT question_decks_category_check 
  CHECK (category IN ('friends', 'family', 'dating', 'lovers', 'work', 'growth', 'spice'));

-- 4. Drop difficulty_level CHECK constraint
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_difficulty_level_check;

-- 5. Rename difficulty_level column to depth_level
ALTER TABLE questions RENAME COLUMN difficulty_level TO depth_level;

-- 6. Add new CHECK constraint for depth_level
ALTER TABLE questions ADD CONSTRAINT questions_depth_level_check 
  CHECK (depth_level IN ('standard', 'deeper'));

-- 7. Add is_premium column to question_decks if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'question_decks' AND column_name = 'is_premium') THEN
    ALTER TABLE question_decks ADD COLUMN is_premium BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 8. Change deck ID column type from UUID to TEXT for friendly IDs
-- First, we need to drop the foreign key constraints temporarily
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_deck_id_fkey;
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_deck_id_fkey;
ALTER TABLE question_sessions DROP CONSTRAINT IF EXISTS question_sessions_deck_id_fkey;

-- Change the column types
ALTER TABLE question_decks ALTER COLUMN id TYPE TEXT;
ALTER TABLE questions ALTER COLUMN deck_id TYPE TEXT;
ALTER TABLE user_progress ALTER COLUMN deck_id TYPE TEXT;
ALTER TABLE question_sessions ALTER COLUMN deck_id TYPE TEXT;

-- Recreate the foreign key constraints
ALTER TABLE questions ADD CONSTRAINT questions_deck_id_fkey 
  FOREIGN KEY (deck_id) REFERENCES question_decks(id) ON DELETE CASCADE;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_deck_id_fkey 
  FOREIGN KEY (deck_id) REFERENCES question_decks(id) ON DELETE CASCADE;
ALTER TABLE question_sessions ADD CONSTRAINT question_sessions_deck_id_fkey 
  FOREIGN KEY (deck_id) REFERENCES question_decks(id) ON DELETE CASCADE;

-- 9. Insert the 7 new decks with proper IDs
INSERT INTO question_decks (id, name, description, category, icon, question_count, is_active, is_premium) VALUES
  ('family-deck', 'Family', 'Reconnection with family - meaningful questions to bridge gaps and strengthen bonds', 'family', '🏠', 50, true, false),
  ('dating-deck', 'Dating', 'Connection for early dating - perfect for first dates, getting to know each other', 'dating', '💕', 50, true, false),
  ('lovers-deck', 'Lovers', 'Connection with a partner - building a life, reconnection, purpose, and communication', 'lovers', '❤️', 50, true, false),
  ('work-deck', 'Work', 'Safe but interesting questions for colleagues - build friendships while staying professional', 'work', '💼', 50, true, false),
  ('friends-deck', 'Friends', 'Make friendship conversations more interesting - perfect for dinner and wine', 'friends', '🍷', 50, true, false),
  ('growth-deck', 'Growth', 'Growth mindset and business discussions - explore professional life and aspirations', 'growth', '🌱', 50, true, false),
  ('spice-deck', 'Spice', 'Intimacy and physical connection - improve your connection with your lover', 'spice', '🔥', 50, true, true);

-- 10. FAMILY DECK QUESTIONS (25 standard + 25 deeper)

-- Family - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('family-deck', 'What''s your favorite family tradition and why?', 'standard', ARRAY['traditions', 'memories'], true),
  ('family-deck', 'What family memory always makes you laugh?', 'standard', ARRAY['humor', 'memories'], true),
  ('family-deck', 'What''s your earliest happy memory with family?', 'standard', ARRAY['childhood', 'memories'], true),
  ('family-deck', 'What''s something you''re grateful for that our family taught you?', 'standard', ARRAY['gratitude', 'values'], true),
  ('family-deck', 'What''s your favorite meal that reminds you of home?', 'standard', ARRAY['food', 'nostalgia'], true),
  ('family-deck', 'What holiday do you most look forward to spending with family?', 'standard', ARRAY['holidays', 'celebration'], true),
  ('family-deck', 'What''s a funny story about a family vacation?', 'standard', ARRAY['travel', 'humor'], true),
  ('family-deck', 'Who in the family are you most similar to?', 'standard', ARRAY['identity', 'connection'], true),
  ('family-deck', 'What''s something small that your family does that you love?', 'standard', ARRAY['appreciation', 'habits'], true),
  ('family-deck', 'What game or activity did you always play together?', 'standard', ARRAY['games', 'activities'], true),
  ('family-deck', 'What''s a family recipe that means a lot to you?', 'standard', ARRAY['food', 'traditions'], true),
  ('family-deck', 'What place feels most like home to you?', 'standard', ARRAY['home', 'belonging'], true),
  ('family-deck', 'What do you appreciate most about your siblings or parents?', 'standard', ARRAY['appreciation', 'relationships'], true),
  ('family-deck', 'What''s your favorite photo of the family?', 'standard', ARRAY['memories', 'nostalgia'], true),
  ('family-deck', 'What song reminds you of your family?', 'standard', ARRAY['music', 'memories'], true),
  ('family-deck', 'What''s something your family does differently than others?', 'standard', ARRAY['uniqueness', 'culture'], true),
  ('family-deck', 'What activity would you love to do with family more often?', 'standard', ARRAY['activities', 'connection'], true),
  ('family-deck', 'What''s a lesson your grandparents taught you?', 'standard', ARRAY['wisdom', 'heritage'], true),
  ('family-deck', 'What do you think makes your family special?', 'standard', ARRAY['identity', 'pride'], true),
  ('family-deck', 'What''s your favorite thing about family gatherings?', 'standard', ARRAY['celebration', 'togetherness'], true),
  ('family-deck', 'What childhood toy or game do you remember most?', 'standard', ARRAY['childhood', 'nostalgia'], true),
  ('family-deck', 'What family member has influenced you the most?', 'standard', ARRAY['influence', 'growth'], true),
  ('family-deck', 'What''s a family inside joke that always makes you smile?', 'standard', ARRAY['humor', 'connection'], true),
  ('family-deck', 'What would your perfect family day look like?', 'standard', ARRAY['ideals', 'quality time'], true),
  ('family-deck', 'What''s something you''d like to thank your parents for?', 'standard', ARRAY['gratitude', 'appreciation'], true);

-- Family - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('family-deck', 'How has our family shaped who you are today?', 'deeper', ARRAY['identity', 'growth'], true),
  ('family-deck', 'What''s something you wish you knew about your parents when they were your age?', 'deeper', ARRAY['curiosity', 'perspective'], true),
  ('family-deck', 'What would you like future generations to know about our family?', 'deeper', ARRAY['legacy', 'values'], true),
  ('family-deck', 'What family value do you hold most dear?', 'deeper', ARRAY['values', 'principles'], true),
  ('family-deck', 'If you could ask any family member one question, what would it be?', 'deeper', ARRAY['curiosity', 'connection'], true),
  ('family-deck', 'What''s something you learned from your parents that you want to pass on?', 'deeper', ARRAY['wisdom', 'values'], true),
  ('family-deck', 'What advice would you give to a younger family member?', 'deeper', ARRAY['wisdom', 'guidance'], true),
  ('family-deck', 'What''s a story about a family member that inspires you?', 'deeper', ARRAY['inspiration', 'stories'], true),
  ('family-deck', 'How do you want to honor your family''s legacy?', 'deeper', ARRAY['legacy', 'purpose'], true),
  ('family-deck', 'What''s a difficult family moment that made you stronger?', 'deeper', ARRAY['resilience', 'growth'], true),
  ('family-deck', 'What family pattern would you like to break?', 'deeper', ARRAY['growth', 'change'], true),
  ('family-deck', 'What family pattern do you want to continue?', 'deeper', ARRAY['traditions', 'values'], true),
  ('family-deck', 'How has your relationship with your family evolved over time?', 'deeper', ARRAY['growth', 'relationships'], true),
  ('family-deck', 'What do you wish your family understood better about you?', 'deeper', ARRAY['understanding', 'authenticity'], true),
  ('family-deck', 'What''s something you''ve forgiven in your family?', 'deeper', ARRAY['forgiveness', 'healing'], true),
  ('family-deck', 'How do you want to make your family proud?', 'deeper', ARRAY['aspirations', 'pride'], true),
  ('family-deck', 'What''s an unspoken rule in your family?', 'deeper', ARRAY['culture', 'awareness'], true),
  ('family-deck', 'What sacrifice has a family member made for you?', 'deeper', ARRAY['gratitude', 'sacrifice'], true),
  ('family-deck', 'How has your family influenced your relationships outside of it?', 'deeper', ARRAY['influence', 'patterns'], true),
  ('family-deck', 'What would you change about your family dynamic if you could?', 'deeper', ARRAY['growth', 'honesty'], true),
  ('family-deck', 'What''s the most important thing family has taught you about love?', 'deeper', ARRAY['love', 'wisdom'], true),
  ('family-deck', 'How do you handle disagreements within the family?', 'deeper', ARRAY['conflict', 'communication'], true),
  ('family-deck', 'What do you hope your children will say about our family?', 'deeper', ARRAY['legacy', 'future'], true),
  ('family-deck', 'What''s a hard truth about your family that you''ve come to accept?', 'deeper', ARRAY['acceptance', 'reality'], true),
  ('family-deck', 'How can we strengthen our family bonds moving forward?', 'deeper', ARRAY['growth', 'connection'], true);

-- 11. DATING DECK QUESTIONS (25 standard + 25 deeper)

-- Dating - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('dating-deck', 'What''s something that made you smile today?', 'standard', ARRAY['positivity', 'connection'], true),
  ('dating-deck', 'What''s your idea of a perfect weekend?', 'standard', ARRAY['lifestyle', 'preferences'], true),
  ('dating-deck', 'What''s something you''re passionate about?', 'standard', ARRAY['passions', 'interests'], true),
  ('dating-deck', 'If you could travel anywhere for a first date, where would it be?', 'standard', ARRAY['travel', 'romance'], true),
  ('dating-deck', 'What''s your favorite way to spend a free evening?', 'standard', ARRAY['leisure', 'preferences'], true),
  ('dating-deck', 'What kind of music do you enjoy?', 'standard', ARRAY['music', 'interests'], true),
  ('dating-deck', 'What''s your favorite season and why?', 'standard', ARRAY['preferences', 'nature'], true),
  ('dating-deck', 'What''s something you''re really good at?', 'standard', ARRAY['talents', 'confidence'], true),
  ('dating-deck', 'What''s your go-to comfort food?', 'standard', ARRAY['food', 'preferences'], true),
  ('dating-deck', 'What''s the best trip you''ve ever taken?', 'standard', ARRAY['travel', 'memories'], true),
  ('dating-deck', 'What do you do for fun?', 'standard', ARRAY['hobbies', 'lifestyle'], true),
  ('dating-deck', 'What''s something new you''d like to try?', 'standard', ARRAY['adventure', 'curiosity'], true),
  ('dating-deck', 'What''s your favorite way to stay active?', 'standard', ARRAY['health', 'activities'], true),
  ('dating-deck', 'What makes you laugh the most?', 'standard', ARRAY['humor', 'joy'], true),
  ('dating-deck', 'What''s your favorite movie or TV show?', 'standard', ARRAY['entertainment', 'interests'], true),
  ('dating-deck', 'What''s your morning routine like?', 'standard', ARRAY['lifestyle', 'habits'], true),
  ('dating-deck', 'What''s something you''re currently learning?', 'standard', ARRAY['growth', 'curiosity'], true),
  ('dating-deck', 'What''s your favorite restaurant or cuisine?', 'standard', ARRAY['food', 'preferences'], true),
  ('dating-deck', 'What do you like most about where you live?', 'standard', ARRAY['location', 'lifestyle'], true),
  ('dating-deck', 'What''s your idea of the perfect date?', 'standard', ARRAY['romance', 'preferences'], true),
  ('dating-deck', 'What''s something that always puts you in a good mood?', 'standard', ARRAY['happiness', 'positivity'], true),
  ('dating-deck', 'What''s your favorite childhood memory?', 'standard', ARRAY['memories', 'nostalgia'], true),
  ('dating-deck', 'What''s something most people don''t know about you?', 'standard', ARRAY['uniqueness', 'discovery'], true),
  ('dating-deck', 'What''s your favorite thing about your best friend?', 'standard', ARRAY['friendship', 'values'], true),
  ('dating-deck', 'What would your ideal Sunday look like?', 'standard', ARRAY['leisure', 'lifestyle'], true);

-- Dating - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('dating-deck', 'What qualities do you value most in a relationship?', 'deeper', ARRAY['values', 'relationships'], true),
  ('dating-deck', 'What''s your love language?', 'deeper', ARRAY['love', 'communication'], true),
  ('dating-deck', 'What makes you feel most alive?', 'deeper', ARRAY['passions', 'self-discovery'], true),
  ('dating-deck', 'What does a meaningful connection look like to you?', 'deeper', ARRAY['values', 'relationships'], true),
  ('dating-deck', 'What''s the best piece of advice someone has given you?', 'deeper', ARRAY['wisdom', 'values'], true),
  ('dating-deck', 'What''s something you''re working on improving about yourself?', 'deeper', ARRAY['growth', 'self-awareness'], true),
  ('dating-deck', 'What do you think makes a relationship last?', 'deeper', ARRAY['relationships', 'wisdom'], true),
  ('dating-deck', 'What''s your biggest fear in relationships?', 'deeper', ARRAY['vulnerability', 'fears'], true),
  ('dating-deck', 'What''s something from your past that shaped who you are?', 'deeper', ARRAY['identity', 'growth'], true),
  ('dating-deck', 'What do you need most from a partner?', 'deeper', ARRAY['needs', 'relationships'], true),
  ('dating-deck', 'How do you handle conflict in relationships?', 'deeper', ARRAY['conflict', 'communication'], true),
  ('dating-deck', 'What''s your biggest dream for the future?', 'deeper', ARRAY['dreams', 'aspirations'], true),
  ('dating-deck', 'What''s something you''re proud of overcoming?', 'deeper', ARRAY['resilience', 'growth'], true),
  ('dating-deck', 'What does trust mean to you in a relationship?', 'deeper', ARRAY['trust', 'values'], true),
  ('dating-deck', 'What''s a deal-breaker for you in dating?', 'deeper', ARRAY['boundaries', 'values'], true),
  ('dating-deck', 'How do you know when you''re ready for a serious relationship?', 'deeper', ARRAY['readiness', 'self-awareness'], true),
  ('dating-deck', 'What''s the most important lesson you''ve learned from past relationships?', 'deeper', ARRAY['wisdom', 'growth'], true),
  ('dating-deck', 'What makes you feel truly understood?', 'deeper', ARRAY['connection', 'understanding'], true),
  ('dating-deck', 'What''s your biggest insecurity?', 'deeper', ARRAY['vulnerability', 'authenticity'], true),
  ('dating-deck', 'How do you want to grow in your next relationship?', 'deeper', ARRAY['growth', 'aspirations'], true),
  ('dating-deck', 'What does vulnerability mean to you?', 'deeper', ARRAY['vulnerability', 'authenticity'], true),
  ('dating-deck', 'What''s something you need to work on before committing to someone?', 'deeper', ARRAY['self-awareness', 'growth'], true),
  ('dating-deck', 'What role does family play in your relationships?', 'deeper', ARRAY['family', 'values'], true),
  ('dating-deck', 'What are you most afraid of missing out on in life?', 'deeper', ARRAY['fears', 'aspirations'], true),
  ('dating-deck', 'If you could learn one thing about me right now, what would it be?', 'deeper', ARRAY['curiosity', 'connection'], true);

-- 12. LOVERS DECK QUESTIONS (25 standard + 25 deeper)

-- Lovers - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('lovers-deck', 'What makes you feel most loved by me?', 'standard', ARRAY['love', 'connection'], true),
  ('lovers-deck', 'What small thing do I do that makes you smile?', 'standard', ARRAY['appreciation', 'joy'], true),
  ('lovers-deck', 'What''s your favorite memory of us together?', 'standard', ARRAY['memories', 'nostalgia'], true),
  ('lovers-deck', 'If we could go anywhere in the world together, where would you choose?', 'standard', ARRAY['travel', 'dreams'], true),
  ('lovers-deck', 'What''s your favorite thing about our relationship?', 'standard', ARRAY['appreciation', 'connection'], true),
  ('lovers-deck', 'What makes you laugh the most about us?', 'standard', ARRAY['humor', 'joy'], true),
  ('lovers-deck', 'What''s a goal you''d love for us to achieve together?', 'standard', ARRAY['goals', 'partnership'], true),
  ('lovers-deck', 'What''s your favorite way to spend time with me?', 'standard', ARRAY['quality time', 'preferences'], true),
  ('lovers-deck', 'What song reminds you of us?', 'standard', ARRAY['music', 'memories'], true),
  ('lovers-deck', 'What''s something you''d love to try together?', 'standard', ARRAY['adventure', 'exploration'], true),
  ('lovers-deck', 'What do you appreciate most about how we communicate?', 'standard', ARRAY['communication', 'appreciation'], true),
  ('lovers-deck', 'What''s your favorite date we''ve had?', 'standard', ARRAY['romance', 'memories'], true),
  ('lovers-deck', 'What makes our relationship unique?', 'standard', ARRAY['identity', 'connection'], true),
  ('lovers-deck', 'What''s something we do well as a team?', 'standard', ARRAY['teamwork', 'strengths'], true),
  ('lovers-deck', 'What tradition would you like us to start?', 'standard', ARRAY['traditions', 'future'], true),
  ('lovers-deck', 'What''s your favorite season of the year to spend with me?', 'standard', ARRAY['preferences', 'togetherness'], true),
  ('lovers-deck', 'What makes you feel most appreciated in our relationship?', 'standard', ARRAY['appreciation', 'love'], true),
  ('lovers-deck', 'What''s a simple pleasure we both enjoy?', 'standard', ARRAY['joy', 'connection'], true),
  ('lovers-deck', 'What hobby would you love for us to share?', 'standard', ARRAY['hobbies', 'togetherness'], true),
  ('lovers-deck', 'What''s your favorite thing I cook or make for you?', 'standard', ARRAY['food', 'care'], true),
  ('lovers-deck', 'What makes you proud of us as a couple?', 'standard', ARRAY['pride', 'partnership'], true),
  ('lovers-deck', 'What''s a place you''d love to explore with me?', 'standard', ARRAY['travel', 'adventure'], true),
  ('lovers-deck', 'What do you think is our greatest strength as a couple?', 'standard', ARRAY['strengths', 'partnership'], true),
  ('lovers-deck', 'What makes you feel most comfortable with me?', 'standard', ARRAY['comfort', 'safety'], true),
  ('lovers-deck', 'What''s something you''re excited about in our future?', 'standard', ARRAY['future', 'excitement'], true);

-- Lovers - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('lovers-deck', 'What does a fulfilling life together look like to you?', 'deeper', ARRAY['vision', 'future'], true),
  ('lovers-deck', 'How can we better support each other''s goals?', 'deeper', ARRAY['support', 'growth'], true),
  ('lovers-deck', 'What''s one way we could improve our communication?', 'deeper', ARRAY['communication', 'growth'], true),
  ('lovers-deck', 'What do you need most from me right now?', 'deeper', ARRAY['needs', 'communication'], true),
  ('lovers-deck', 'What''s a dream we could build together?', 'deeper', ARRAY['dreams', 'partnership'], true),
  ('lovers-deck', 'How do you want our relationship to grow in the next year?', 'deeper', ARRAY['growth', 'vision'], true),
  ('lovers-deck', 'What''s something you''ve been afraid to tell me?', 'deeper', ARRAY['vulnerability', 'honesty'], true),
  ('lovers-deck', 'How can I help you feel more loved?', 'deeper', ARRAY['love', 'care'], true),
  ('lovers-deck', 'What challenge have we overcome that made us stronger?', 'deeper', ARRAY['resilience', 'growth'], true),
  ('lovers-deck', 'What values do you want us to build our life on?', 'deeper', ARRAY['values', 'foundation'], true),
  ('lovers-deck', 'What''s something I don''t know about what you need emotionally?', 'deeper', ARRAY['needs', 'communication'], true),
  ('lovers-deck', 'How do you envision us handling tough times together?', 'deeper', ARRAY['resilience', 'partnership'], true),
  ('lovers-deck', 'What sacrifice would you be willing to make for our relationship?', 'deeper', ARRAY['commitment', 'sacrifice'], true),
  ('lovers-deck', 'What does commitment mean to you in our relationship?', 'deeper', ARRAY['commitment', 'values'], true),
  ('lovers-deck', 'What''s your biggest fear about our future?', 'deeper', ARRAY['fears', 'vulnerability'], true),
  ('lovers-deck', 'How do you want us to handle disagreements better?', 'deeper', ARRAY['conflict', 'growth'], true),
  ('lovers-deck', 'What makes you feel most secure in our relationship?', 'deeper', ARRAY['security', 'trust'], true),
  ('lovers-deck', 'What''s something you''d like to experience together that we haven''t yet?', 'deeper', ARRAY['exploration', 'growth'], true),
  ('lovers-deck', 'How can we keep the spark alive as we grow together?', 'deeper', ARRAY['romance', 'connection'], true),
  ('lovers-deck', 'What does true partnership mean to you?', 'deeper', ARRAY['partnership', 'values'], true),
  ('lovers-deck', 'What pattern in our relationship would you like to change?', 'deeper', ARRAY['growth', 'awareness'], true),
  ('lovers-deck', 'What do you think we need to work on as a couple?', 'deeper', ARRAY['growth', 'honesty'], true),
  ('lovers-deck', 'How do you want to be supported during difficult times?', 'deeper', ARRAY['support', 'care'], true),
  ('lovers-deck', 'What legacy do you want us to build together?', 'deeper', ARRAY['legacy', 'purpose'], true),
  ('lovers-deck', 'What''s the most important thing you''ve learned about love from us?', 'deeper', ARRAY['wisdom', 'love'], true);

-- 13. WORK DECK QUESTIONS (25 standard + 25 deeper)

-- Work - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('work-deck', 'What''s the most interesting project you''ve worked on recently?', 'standard', ARRAY['projects', 'interests'], true),
  ('work-deck', 'What do you do to unwind after a challenging day?', 'standard', ARRAY['wellness', 'balance'], true),
  ('work-deck', 'What''s your favorite thing about your current role?', 'standard', ARRAY['work', 'satisfaction'], true),
  ('work-deck', 'What''s a skill you''d love to learn?', 'standard', ARRAY['learning', 'growth'], true),
  ('work-deck', 'What''s your go-to lunch spot?', 'standard', ARRAY['food', 'social'], true),
  ('work-deck', 'What podcast or book are you into right now?', 'standard', ARRAY['media', 'interests'], true),
  ('work-deck', 'What''s your favorite way to start the day?', 'standard', ARRAY['routines', 'wellness'], true),
  ('work-deck', 'What''s something you''ve learned recently that surprised you?', 'standard', ARRAY['learning', 'curiosity'], true),
  ('work-deck', 'What''s your coffee or tea order?', 'standard', ARRAY['preferences', 'social'], true),
  ('work-deck', 'What do you like to do on weekends?', 'standard', ARRAY['hobbies', 'balance'], true),
  ('work-deck', 'What''s the best vacation you''ve taken?', 'standard', ARRAY['travel', 'experiences'], true),
  ('work-deck', 'What''s your favorite season and why?', 'standard', ARRAY['preferences', 'lifestyle'], true),
  ('work-deck', 'What''s something you''re proud of accomplishing?', 'standard', ARRAY['achievement', 'pride'], true),
  ('work-deck', 'What''s your hidden talent?', 'standard', ARRAY['talents', 'fun'], true),
  ('work-deck', 'What show are you binge-watching right now?', 'standard', ARRAY['entertainment', 'social'], true),
  ('work-deck', 'What''s your favorite type of cuisine?', 'standard', ARRAY['food', 'preferences'], true),
  ('work-deck', 'What''s the last concert or event you attended?', 'standard', ARRAY['entertainment', 'experiences'], true),
  ('work-deck', 'What''s your favorite way to stay active?', 'standard', ARRAY['health', 'wellness'], true),
  ('work-deck', 'What''s something on your bucket list?', 'standard', ARRAY['dreams', 'aspirations'], true),
  ('work-deck', 'What''s the best advice you''ve received?', 'standard', ARRAY['wisdom', 'growth'], true),
  ('work-deck', 'What app can you not live without?', 'standard', ARRAY['technology', 'lifestyle'], true),
  ('work-deck', 'What''s your favorite local spot to recommend?', 'standard', ARRAY['local', 'social'], true),
  ('work-deck', 'What''s something that always makes you laugh?', 'standard', ARRAY['humor', 'joy'], true),
  ('work-deck', 'What hobby have you picked up recently?', 'standard', ARRAY['hobbies', 'interests'], true),
  ('work-deck', 'What''s your ideal way to celebrate a win?', 'standard', ARRAY['celebration', 'social'], true);

-- Work - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('work-deck', 'What motivates you most in your career?', 'deeper', ARRAY['motivation', 'purpose'], true),
  ('work-deck', 'If you could change one thing about work culture, what would it be?', 'deeper', ARRAY['culture', 'values'], true),
  ('work-deck', 'What''s the most valuable lesson you''ve learned in your career?', 'deeper', ARRAY['wisdom', 'growth'], true),
  ('work-deck', 'How do you maintain work-life balance?', 'deeper', ARRAY['balance', 'wellness'], true),
  ('work-deck', 'What''s a professional goal you''re working toward?', 'deeper', ARRAY['goals', 'ambition'], true),
  ('work-deck', 'What skill are you most proud of developing?', 'deeper', ARRAY['skills', 'growth'], true),
  ('work-deck', 'What workplace challenge has taught you the most?', 'deeper', ARRAY['challenges', 'learning'], true),
  ('work-deck', 'What does success mean to you?', 'deeper', ARRAY['success', 'values'], true),
  ('work-deck', 'How do you handle stress at work?', 'deeper', ARRAY['stress', 'coping'], true),
  ('work-deck', 'What''s your approach to giving and receiving feedback?', 'deeper', ARRAY['feedback', 'communication'], true),
  ('work-deck', 'What kind of work environment brings out your best?', 'deeper', ARRAY['environment', 'performance'], true),
  ('work-deck', 'What''s the hardest career decision you''ve made?', 'deeper', ARRAY['decisions', 'growth'], true),
  ('work-deck', 'How do you define professional growth?', 'deeper', ARRAY['growth', 'development'], true),
  ('work-deck', 'What makes you feel valued at work?', 'deeper', ARRAY['value', 'recognition'], true),
  ('work-deck', 'What''s your leadership style or philosophy?', 'deeper', ARRAY['leadership', 'philosophy'], true),
  ('work-deck', 'How do you bounce back from setbacks?', 'deeper', ARRAY['resilience', 'mindset'], true),
  ('work-deck', 'What''s something you wish you knew earlier in your career?', 'deeper', ARRAY['wisdom', 'reflection'], true),
  ('work-deck', 'What impact do you want to make in your field?', 'deeper', ARRAY['impact', 'purpose'], true),
  ('work-deck', 'How do you stay motivated during tough projects?', 'deeper', ARRAY['motivation', 'perseverance'], true),
  ('work-deck', 'What''s your biggest professional achievement?', 'deeper', ARRAY['achievement', 'pride'], true),
  ('work-deck', 'How has failure shaped your career?', 'deeper', ARRAY['failure', 'growth'], true),
  ('work-deck', 'What would you tell your younger self about work?', 'deeper', ARRAY['wisdom', 'reflection'], true),
  ('work-deck', 'What''s the most important quality in a colleague?', 'deeper', ARRAY['values', 'teamwork'], true),
  ('work-deck', 'How do you prioritize when everything feels urgent?', 'deeper', ARRAY['priorities', 'strategy'], true),
  ('work-deck', 'Where do you see yourself in five years?', 'deeper', ARRAY['future', 'vision'], true);

-- 14. FRIENDS DECK QUESTIONS (25 standard + 25 deeper)

-- Friends - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('friends-deck', 'What''s your favorite memory of us together?', 'standard', ARRAY['memories', 'friendship'], true),
  ('friends-deck', 'What adventure would you most want to go on together?', 'standard', ARRAY['adventure', 'future'], true),
  ('friends-deck', 'What do you think is my biggest strength?', 'standard', ARRAY['strengths', 'appreciation'], true),
  ('friends-deck', 'What''s a funny story about us that you love?', 'standard', ARRAY['humor', 'memories'], true),
  ('friends-deck', 'Where would you want to travel together?', 'standard', ARRAY['travel', 'adventure'], true),
  ('friends-deck', 'What''s your favorite thing we do together?', 'standard', ARRAY['activities', 'connection'], true),
  ('friends-deck', 'What song reminds you of our friendship?', 'standard', ARRAY['music', 'memories'], true),
  ('friends-deck', 'What''s something new you''d like to try with me?', 'standard', ARRAY['exploration', 'growth'], true),
  ('friends-deck', 'What''s your go-to drink when we hang out?', 'standard', ARRAY['preferences', 'social'], true),
  ('friends-deck', 'What''s your favorite restaurant to go to together?', 'standard', ARRAY['food', 'experiences'], true),
  ('friends-deck', 'What hobby would you love for us to start together?', 'standard', ARRAY['hobbies', 'bonding'], true),
  ('friends-deck', 'What TV show or movie should we watch together?', 'standard', ARRAY['entertainment', 'shared interests'], true),
  ('friends-deck', 'What''s the best gift you''ve ever received from a friend?', 'standard', ARRAY['gifts', 'appreciation'], true),
  ('friends-deck', 'What''s your ideal weekend with friends?', 'standard', ARRAY['leisure', 'quality time'], true),
  ('friends-deck', 'What makes you laugh most about our friendship?', 'standard', ARRAY['humor', 'joy'], true),
  ('friends-deck', 'What tradition should we start?', 'standard', ARRAY['traditions', 'future'], true),
  ('friends-deck', 'What''s something you admire about me?', 'standard', ARRAY['admiration', 'appreciation'], true),
  ('friends-deck', 'What game should we play more often?', 'standard', ARRAY['games', 'fun'], true),
  ('friends-deck', 'What''s your favorite season to hang out?', 'standard', ARRAY['preferences', 'connection'], true),
  ('friends-deck', 'What concert or event would you love to attend together?', 'standard', ARRAY['entertainment', 'experiences'], true),
  ('friends-deck', 'What''s something you''re grateful for in our friendship?', 'standard', ARRAY['gratitude', 'appreciation'], true),
  ('friends-deck', 'What recipe should we try cooking together?', 'standard', ARRAY['food', 'activities'], true),
  ('friends-deck', 'What''s your favorite photo of us?', 'standard', ARRAY['memories', 'nostalgia'], true),
  ('friends-deck', 'What makes our friendship special?', 'standard', ARRAY['connection', 'appreciation'], true),
  ('friends-deck', 'What''s something you''ve learned from me?', 'standard', ARRAY['growth', 'influence'], true);

-- Friends - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('friends-deck', 'What do you value most in a friendship?', 'deeper', ARRAY['values', 'connection'], true),
  ('friends-deck', 'How has our friendship changed you?', 'deeper', ARRAY['growth', 'influence'], true),
  ('friends-deck', 'What''s something you''ve always wanted to tell me?', 'deeper', ARRAY['honesty', 'communication'], true),
  ('friends-deck', 'How can I be a better friend to you?', 'deeper', ARRAY['growth', 'support'], true),
  ('friends-deck', 'What''s a difficult time when I was there for you?', 'deeper', ARRAY['support', 'gratitude'], true),
  ('friends-deck', 'What makes you feel most supported by your friends?', 'deeper', ARRAY['support', 'needs'], true),
  ('friends-deck', 'If you could change one thing about our friendship, what would it be?', 'deeper', ARRAY['honesty', 'growth'], true),
  ('friends-deck', 'What have I taught you that you value most?', 'deeper', ARRAY['wisdom', 'impact'], true),
  ('friends-deck', 'What''s something you''ve been meaning to apologize for?', 'deeper', ARRAY['honesty', 'healing'], true),
  ('friends-deck', 'How do you want our friendship to grow?', 'deeper', ARRAY['growth', 'vision'], true),
  ('friends-deck', 'What''s your biggest fear about our friendship?', 'deeper', ARRAY['vulnerability', 'fears'], true),
  ('friends-deck', 'What boundary do you need me to respect more?', 'deeper', ARRAY['boundaries', 'communication'], true),
  ('friends-deck', 'What''s something you''ve never told anyone but would tell me?', 'deeper', ARRAY['trust', 'vulnerability'], true),
  ('friends-deck', 'How do you handle conflict in friendships?', 'deeper', ARRAY['conflict', 'communication'], true),
  ('friends-deck', 'What makes you feel most understood by me?', 'deeper', ARRAY['understanding', 'connection'], true),
  ('friends-deck', 'What''s a hard truth you need to hear from me?', 'deeper', ARRAY['honesty', 'growth'], true),
  ('friends-deck', 'How has friendship shaped who you are?', 'deeper', ARRAY['identity', 'influence'], true),
  ('friends-deck', 'What''s the most meaningful thing a friend has done for you?', 'deeper', ARRAY['gratitude', 'impact'], true),
  ('friends-deck', 'What do you need from friends that you''re not getting?', 'deeper', ARRAY['needs', 'honesty'], true),
  ('friends-deck', 'How do you define loyalty in friendship?', 'deeper', ARRAY['values', 'loyalty'], true),
  ('friends-deck', 'What friendship pattern would you like to break?', 'deeper', ARRAY['growth', 'awareness'], true),
  ('friends-deck', 'What makes a friendship worth fighting for?', 'deeper', ARRAY['values', 'commitment'], true),
  ('friends-deck', 'How can we navigate growing in different directions?', 'deeper', ARRAY['change', 'growth'], true),
  ('friends-deck', 'What''s something you admire about me but never expressed?', 'deeper', ARRAY['admiration', 'appreciation'], true),
  ('friends-deck', 'What do you hope for the future of our friendship?', 'deeper', ARRAY['future', 'vision'], true);

-- 15. GROWTH DECK QUESTIONS (25 standard + 25 deeper)

-- Growth - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('growth-deck', 'What book has influenced you recently?', 'standard', ARRAY['learning', 'influence'], true),
  ('growth-deck', 'What''s a new skill you''re learning?', 'standard', ARRAY['skills', 'development'], true),
  ('growth-deck', 'What''s your biggest win this year?', 'standard', ARRAY['achievement', 'celebration'], true),
  ('growth-deck', 'What podcast or resource do you recommend?', 'standard', ARRAY['learning', 'resources'], true),
  ('growth-deck', 'What habit are you trying to build?', 'standard', ARRAY['habits', 'discipline'], true),
  ('growth-deck', 'What''s your morning routine?', 'standard', ARRAY['routines', 'productivity'], true),
  ('growth-deck', 'What business idea excites you?', 'standard', ARRAY['entrepreneurship', 'ideas'], true),
  ('growth-deck', 'What''s your approach to goal setting?', 'standard', ARRAY['goals', 'strategy'], true),
  ('growth-deck', 'What industry trend interests you most?', 'standard', ARRAY['trends', 'curiosity'], true),
  ('growth-deck', 'What tool or app has made you more productive?', 'standard', ARRAY['productivity', 'technology'], true),
  ('growth-deck', 'What''s something you''re experimenting with?', 'standard', ARRAY['experimentation', 'growth'], true),
  ('growth-deck', 'What conference or event would you love to attend?', 'standard', ARRAY['events', 'networking'], true),
  ('growth-deck', 'What leader or entrepreneur do you admire?', 'standard', ARRAY['inspiration', 'leadership'], true),
  ('growth-deck', 'What''s your best productivity hack?', 'standard', ARRAY['productivity', 'tips'], true),
  ('growth-deck', 'What''s a business lesson you''ve learned recently?', 'standard', ARRAY['business', 'learning'], true),
  ('growth-deck', 'What project are you most excited about?', 'standard', ARRAY['projects', 'passion'], true),
  ('growth-deck', 'What skill would give you the biggest advantage?', 'standard', ARRAY['skills', 'strategy'], true),
  ('growth-deck', 'What''s your definition of work-life integration?', 'standard', ARRAY['balance', 'lifestyle'], true),
  ('growth-deck', 'What''s the best business advice you''ve received?', 'standard', ARRAY['advice', 'wisdom'], true),
  ('growth-deck', 'What motivates you to keep growing?', 'standard', ARRAY['motivation', 'drive'], true),
  ('growth-deck', 'What''s your approach to learning new things?', 'standard', ARRAY['learning', 'strategy'], true),
  ('growth-deck', 'What networking strategy works best for you?', 'standard', ARRAY['networking', 'relationships'], true),
  ('growth-deck', 'What''s your biggest professional goal this year?', 'standard', ARRAY['goals', 'ambition'], true),
  ('growth-deck', 'What platform or medium do you use to learn?', 'standard', ARRAY['learning', 'resources'], true),
  ('growth-deck', 'What''s one thing you''d do differently if starting over?', 'standard', ARRAY['reflection', 'wisdom'], true);

-- Growth - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('growth-deck', 'What does success mean to you?', 'deeper', ARRAY['success', 'values'], true),
  ('growth-deck', 'Where do you see yourself in five years?', 'deeper', ARRAY['vision', 'future'], true),
  ('growth-deck', 'What''s your biggest limiting belief?', 'deeper', ARRAY['mindset', 'awareness'], true),
  ('growth-deck', 'What failure taught you the most valuable lesson?', 'deeper', ARRAY['failure', 'learning'], true),
  ('growth-deck', 'What legacy do you want to build?', 'deeper', ARRAY['legacy', 'purpose'], true),
  ('growth-deck', 'What''s your deepest ''why'' for what you do?', 'deeper', ARRAY['purpose', 'motivation'], true),
  ('growth-deck', 'What sacrifice have you made for your growth?', 'deeper', ARRAY['sacrifice', 'commitment'], true),
  ('growth-deck', 'What pattern keeps holding you back?', 'deeper', ARRAY['patterns', 'awareness'], true),
  ('growth-deck', 'How do you measure personal growth?', 'deeper', ARRAY['growth', 'metrics'], true),
  ('growth-deck', 'What fear is preventing you from taking the next step?', 'deeper', ARRAY['fear', 'courage'], true),
  ('growth-deck', 'What would you do if you knew you couldn''t fail?', 'deeper', ARRAY['dreams', 'courage'], true),
  ('growth-deck', 'What''s the hardest truth you''ve had to accept about yourself?', 'deeper', ARRAY['self-awareness', 'growth'], true),
  ('growth-deck', 'How has adversity shaped your path?', 'deeper', ARRAY['adversity', 'resilience'], true),
  ('growth-deck', 'What does fulfillment mean to you?', 'deeper', ARRAY['fulfillment', 'values'], true),
  ('growth-deck', 'What''s the gap between where you are and where you want to be?', 'deeper', ARRAY['gap', 'strategy'], true),
  ('growth-deck', 'What belief about yourself needs to change?', 'deeper', ARRAY['beliefs', 'transformation'], true),
  ('growth-deck', 'What would make you feel like you''ve ''made it''?', 'deeper', ARRAY['success', 'goals'], true),
  ('growth-deck', 'What opportunity are you too afraid to pursue?', 'deeper', ARRAY['opportunity', 'fear'], true),
  ('growth-deck', 'How do you want to be remembered professionally?', 'deeper', ARRAY['legacy', 'impact'], true),
  ('growth-deck', 'What''s your relationship with money and success?', 'deeper', ARRAY['money', 'mindset'], true),
  ('growth-deck', 'What version of yourself are you becoming?', 'deeper', ARRAY['identity', 'growth'], true),
  ('growth-deck', 'What mentor or teacher has changed your trajectory?', 'deeper', ARRAY['mentorship', 'influence'], true),
  ('growth-deck', 'What would you tell your 25-year-old self?', 'deeper', ARRAY['wisdom', 'reflection'], true),
  ('growth-deck', 'What does authentic leadership mean to you?', 'deeper', ARRAY['leadership', 'authenticity'], true),
  ('growth-deck', 'What''s the biggest risk you need to take?', 'deeper', ARRAY['risk', 'courage'], true);

-- 16. SPICE DECK QUESTIONS (25 standard + 25 deeper)

-- Spice - Standard Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('spice-deck', 'What makes you feel most desired?', 'standard', ARRAY['attraction', 'desire'], true),
  ('spice-deck', 'What''s your favorite way to be touched?', 'standard', ARRAY['touch', 'intimacy'], true),
  ('spice-deck', 'What''s your favorite memory of us being intimate?', 'standard', ARRAY['memories', 'intimacy'], true),
  ('spice-deck', 'If we could have a perfect romantic evening, what would it look like?', 'standard', ARRAY['romance', 'fantasy'], true),
  ('spice-deck', 'What makes you feel most connected to me physically?', 'standard', ARRAY['connection', 'intimacy'], true),
  ('spice-deck', 'What''s something simple that turns you on?', 'standard', ARRAY['attraction', 'arousal'], true),
  ('spice-deck', 'What''s your favorite thing I do in the bedroom?', 'standard', ARRAY['intimacy', 'pleasure'], true),
  ('spice-deck', 'What song sets the mood for you?', 'standard', ARRAY['music', 'atmosphere'], true),
  ('spice-deck', 'What time of day do you feel most intimate?', 'standard', ARRAY['timing', 'intimacy'], true),
  ('spice-deck', 'What''s a compliment that makes you feel sexy?', 'standard', ARRAY['compliments', 'confidence'], true),
  ('spice-deck', 'What''s your ideal way to reconnect after a busy week?', 'standard', ARRAY['connection', 'intimacy'], true),
  ('spice-deck', 'What outfit of mine do you find most attractive?', 'standard', ARRAY['attraction', 'appearance'], true),
  ('spice-deck', 'What massage or touch helps you relax the most?', 'standard', ARRAY['touch', 'relaxation'], true),
  ('spice-deck', 'What''s your favorite way to initiate intimacy?', 'standard', ARRAY['initiation', 'connection'], true),
  ('spice-deck', 'What makes you feel most comfortable being vulnerable with me?', 'standard', ARRAY['vulnerability', 'safety'], true),
  ('spice-deck', 'What''s something romantic I could surprise you with?', 'standard', ARRAY['romance', 'surprises'], true),
  ('spice-deck', 'What physical feature of mine are you most attracted to?', 'standard', ARRAY['attraction', 'appreciation'], true),
  ('spice-deck', 'What''s the perfect amount of intimacy for you?', 'standard', ARRAY['frequency', 'preferences'], true),
  ('spice-deck', 'What helps you get in the mood?', 'standard', ARRAY['arousal', 'preparation'], true),
  ('spice-deck', 'What aspect of our physical connection means the most to you?', 'standard', ARRAY['connection', 'values'], true),
  ('spice-deck', 'What''s a simple gesture that makes you feel loved?', 'standard', ARRAY['love', 'gestures'], true),
  ('spice-deck', 'What''s your favorite form of affection from me?', 'standard', ARRAY['affection', 'touch'], true),
  ('spice-deck', 'What makes you feel most attractive?', 'standard', ARRAY['confidence', 'self-image'], true),
  ('spice-deck', 'What''s something you appreciate about our intimate life?', 'standard', ARRAY['appreciation', 'intimacy'], true),
  ('spice-deck', 'What environment makes you feel most romantic?', 'standard', ARRAY['environment', 'romance'], true);

-- Spice - Deeper Depth
INSERT INTO questions (deck_id, text, depth_level, tags, is_active) VALUES
  ('spice-deck', 'What''s something intimate you''ve always wanted to try but haven''t shared?', 'deeper', ARRAY['desires', 'vulnerability'], true),
  ('spice-deck', 'What fantasy would you be comfortable exploring together?', 'deeper', ARRAY['fantasies', 'exploration'], true),
  ('spice-deck', 'How can I make you feel more cherished in our intimate moments?', 'deeper', ARRAY['intimacy', 'care'], true),
  ('spice-deck', 'What''s something new you''d love to explore together?', 'deeper', ARRAY['exploration', 'growth'], true),
  ('spice-deck', 'What do you need to feel more present during intimacy?', 'deeper', ARRAY['presence', 'mindfulness'], true),
  ('spice-deck', 'What insecurity affects your confidence in the bedroom?', 'deeper', ARRAY['insecurity', 'vulnerability'], true),
  ('spice-deck', 'How can we improve our physical connection?', 'deeper', ARRAY['connection', 'growth'], true),
  ('spice-deck', 'What''s something you''d like me to do more of?', 'deeper', ARRAY['desires', 'communication'], true),
  ('spice-deck', 'What makes you feel most safe exploring your sexuality?', 'deeper', ARRAY['safety', 'exploration'], true),
  ('spice-deck', 'What boundary do you need me to respect more?', 'deeper', ARRAY['boundaries', 'respect'], true),
  ('spice-deck', 'How has our intimate connection evolved?', 'deeper', ARRAY['evolution', 'growth'], true),
  ('spice-deck', 'What do you wish we talked about more regarding intimacy?', 'deeper', ARRAY['communication', 'needs'], true),
  ('spice-deck', 'What turns you off that I might not know about?', 'deeper', ARRAY['preferences', 'honesty'], true),
  ('spice-deck', 'What does emotional intimacy look like for you?', 'deeper', ARRAY['emotional intimacy', 'connection'], true),
  ('spice-deck', 'How can we keep our physical connection exciting?', 'deeper', ARRAY['excitement', 'maintenance'], true),
  ('spice-deck', 'What past experience affects how you approach intimacy?', 'deeper', ARRAY['past', 'awareness'], true),
  ('spice-deck', 'What makes you feel most seen during intimate moments?', 'deeper', ARRAY['connection', 'presence'], true),
  ('spice-deck', 'What''s your biggest fear about our intimate life?', 'deeper', ARRAY['fears', 'vulnerability'], true),
  ('spice-deck', 'How do you want our intimacy to grow as we age together?', 'deeper', ARRAY['growth', 'future'], true),
  ('spice-deck', 'What do you need after intimacy to feel close?', 'deeper', ARRAY['aftercare', 'connection'], true),
  ('spice-deck', 'What role does physical intimacy play in feeling connected?', 'deeper', ARRAY['connection', 'values'], true),
  ('spice-deck', 'How can I help you feel more confident sexually?', 'deeper', ARRAY['confidence', 'support'], true),
  ('spice-deck', 'What''s something you''ve been too shy to ask for?', 'deeper', ARRAY['vulnerability', 'desires'], true),
  ('spice-deck', 'What does fulfilling intimacy mean to you?', 'deeper', ARRAY['fulfillment', 'values'], true),
  ('spice-deck', 'How do you want to prioritize intimacy in our relationship?', 'deeper', ARRAY['priorities', 'commitment'], true);

-- 17. Update question counts for all decks
UPDATE question_decks qd
SET question_count = (
  SELECT COUNT(*) FROM questions q WHERE q.deck_id = qd.id AND q.is_active = true
);

