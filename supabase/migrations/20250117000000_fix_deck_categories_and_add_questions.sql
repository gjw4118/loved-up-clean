-- Fix deck categories and add missing decks/questions
-- Update category enum to match app expectations

-- 1. Drop the old CHECK constraint
ALTER TABLE question_decks DROP CONSTRAINT IF EXISTS question_decks_category_check;

-- 2. Add new CHECK constraint with correct categories
ALTER TABLE question_decks ADD CONSTRAINT question_decks_category_check 
  CHECK (category IN ('friends', 'family', 'dating', 'growing', 'spice'));

-- 3. Update existing decks to match new categories
UPDATE question_decks SET category = 'dating' WHERE category = 'romantic';
UPDATE question_decks SET category = 'growing' WHERE category = 'professional';

-- 4. Delete old decks if they exist (we'll recreate with proper IDs)
DELETE FROM questions WHERE deck_id IN (
  SELECT id FROM question_decks WHERE category IN ('friends', 'family', 'dating', 'growing')
);
DELETE FROM question_decks WHERE category IN ('friends', 'family', 'dating', 'growing', 'spice');

-- 5. Create the 5 main decks with specific IDs that match the constants
INSERT INTO question_decks (id, name, description, category, icon, question_count, is_active) VALUES
  ('friends-deck', 'Friends', 'Fun social questions for friends - create memorable moments and deepen friendships', 'friends', '👥', 0, true),
  ('family-deck', 'Family', 'Connection and reconnection questions for family members who do not connect', 'family', '🏠', 0, true),
  ('dating-deck', 'Dating', 'Questions for people who are starting to date, perfect for early dates', 'dating', '💕', 0, true),
  ('growing-deck', 'Growing', 'Questions about work, aspirations, career, goals, and personal growth', 'growing', '💼', 0, true),
  ('spice-deck', 'Spice', 'Premium intimate questions for couples to deepen connection and rekindle passion', 'spice', '🌶️', 0, true);

-- 6. Add premium flag column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'question_decks' AND column_name = 'is_premium') THEN
    ALTER TABLE question_decks ADD COLUMN is_premium BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 7. Mark spice deck as premium
UPDATE question_decks SET is_premium = true WHERE id = 'spice-deck';

-- 8. Add questions for Friends deck
INSERT INTO questions (deck_id, text, difficulty_level, tags, is_active) VALUES
  ('friends-deck', 'What''s the most adventurous thing you''ve ever done with a friend?', 'easy', ARRAY['adventure', 'memories'], true),
  ('friends-deck', 'If you could have dinner with any three people, living or dead, who would they be?', 'medium', ARRAY['imagination', 'aspirations'], true),
  ('friends-deck', 'What''s a skill you''d love to learn together with a friend?', 'easy', ARRAY['growth', 'activities'], true),
  ('friends-deck', 'What''s the best piece of advice a friend has ever given you?', 'medium', ARRAY['wisdom', 'friendship'], true),
  ('friends-deck', 'If we could travel anywhere in the world together, where would you want to go?', 'easy', ARRAY['travel', 'dreams'], true),
  ('friends-deck', 'What''s something you''re grateful for in our friendship?', 'easy', ARRAY['gratitude', 'appreciation'], true),
  ('friends-deck', 'What''s a funny memory we share that always makes you laugh?', 'easy', ARRAY['humor', 'memories'], true),
  ('friends-deck', 'If you could describe our friendship in three words, what would they be?', 'medium', ARRAY['reflection', 'connection'], true),
  ('friends-deck', 'What''s something new you''d like to try with me?', 'easy', ARRAY['adventure', 'activities'], true),
  ('friends-deck', 'What do you value most in a friendship?', 'medium', ARRAY['values', 'reflection'], true);

-- 9. Add questions for Family deck
INSERT INTO questions (deck_id, text, difficulty_level, tags, is_active) VALUES
  ('family-deck', 'What''s your favorite family tradition and why?', 'easy', ARRAY['traditions', 'memories'], true),
  ('family-deck', 'What''s something you learned from your parents that you want to pass on?', 'medium', ARRAY['wisdom', 'values'], true),
  ('family-deck', 'What''s your earliest happy memory with family?', 'easy', ARRAY['childhood', 'memories'], true),
  ('family-deck', 'If you could ask any family member one question, what would it be?', 'medium', ARRAY['curiosity', 'connection'], true),
  ('family-deck', 'What''s something you''re grateful for that our family taught you?', 'easy', ARRAY['gratitude', 'values'], true),
  ('family-deck', 'What family value do you hold most dear?', 'medium', ARRAY['values', 'reflection'], true),
  ('family-deck', 'What''s a story about a family member that inspires you?', 'medium', ARRAY['inspiration', 'stories'], true),
  ('family-deck', 'How has our family shaped who you are today?', 'hard', ARRAY['identity', 'growth'], true),
  ('family-deck', 'What''s something you wish you knew about your parents when they were your age?', 'medium', ARRAY['curiosity', 'perspective'], true),
  ('family-deck', 'What would you like future generations to know about our family?', 'hard', ARRAY['legacy', 'values'], true);

-- 10. Add questions for Dating deck
INSERT INTO questions (deck_id, text, difficulty_level, tags, is_active) VALUES
  ('dating-deck', 'What''s something that made you smile today?', 'easy', ARRAY['positivity', 'connection'], true),
  ('dating-deck', 'If you could travel anywhere for a first date, where would it be?', 'easy', ARRAY['travel', 'romance'], true),
  ('dating-deck', 'What''s your idea of a perfect weekend?', 'easy', ARRAY['lifestyle', 'preferences'], true),
  ('dating-deck', 'What''s something you''re passionate about that you could talk about for hours?', 'easy', ARRAY['passions', 'interests'], true),
  ('dating-deck', 'What''s the best piece of advice someone has given you?', 'medium', ARRAY['wisdom', 'values'], true),
  ('dating-deck', 'What qualities do you value most in a relationship?', 'medium', ARRAY['values', 'relationships'], true),
  ('dating-deck', 'What''s your love language?', 'easy', ARRAY['love', 'communication'], true),
  ('dating-deck', 'What''s something that makes you feel most alive?', 'medium', ARRAY['passions', 'self-discovery'], true),
  ('dating-deck', 'If you could learn one thing about me right now, what would it be?', 'easy', ARRAY['curiosity', 'connection'], true),
  ('dating-deck', 'What does a meaningful connection look like to you?', 'medium', ARRAY['values', 'relationships'], true);

-- 11. Add questions for Growing deck
INSERT INTO questions (deck_id, text, difficulty_level, tags, is_active) VALUES
  ('growing-deck', 'What''s the most valuable lesson you''ve learned in your career?', 'medium', ARRAY['career', 'wisdom'], true),
  ('growing-deck', 'What motivates you most in your work?', 'easy', ARRAY['motivation', 'work'], true),
  ('growing-deck', 'If you could change one thing about your industry, what would it be?', 'medium', ARRAY['vision', 'change'], true),
  ('growing-deck', 'What''s a professional goal you''re working toward?', 'easy', ARRAY['goals', 'ambition'], true),
  ('growing-deck', 'What''s the best feedback you''ve ever received from a colleague?', 'medium', ARRAY['growth', 'feedback'], true),
  ('growing-deck', 'What skill are you most proud of developing?', 'easy', ARRAY['accomplishments', 'skills'], true),
  ('growing-deck', 'If you could give your younger self career advice, what would it be?', 'medium', ARRAY['wisdom', 'reflection'], true),
  ('growing-deck', 'What does success mean to you?', 'hard', ARRAY['values', 'aspirations'], true),
  ('growing-deck', 'What''s a challenge you''ve overcome that made you stronger?', 'medium', ARRAY['resilience', 'growth'], true),
  ('growing-deck', 'Where do you see yourself in five years?', 'medium', ARRAY['future', 'goals'], true);

-- 12. Add questions for Spice deck (Premium only)
INSERT INTO questions (deck_id, text, difficulty_level, tags, is_active) VALUES
  ('spice-deck', 'What''s something intimate you''ve always wanted to try but haven''t shared?', 'hard', ARRAY['intimacy', 'desires'], true),
  ('spice-deck', 'How do you like to be touched when you''re feeling stressed?', 'medium', ARRAY['touch', 'comfort'], true),
  ('spice-deck', 'What''s your favorite memory of us being intimate together?', 'medium', ARRAY['memories', 'intimacy'], true),
  ('spice-deck', 'If we could have a perfect romantic evening, what would it look like?', 'easy', ARRAY['romance', 'desires'], true),
  ('spice-deck', 'What''s something new you''d love to explore together in our relationship?', 'medium', ARRAY['exploration', 'intimacy'], true),
  ('spice-deck', 'What makes you feel most desired by me?', 'medium', ARRAY['attraction', 'connection'], true),
  ('spice-deck', 'What''s a fantasy you''d be comfortable sharing with me?', 'hard', ARRAY['fantasies', 'trust'], true),
  ('spice-deck', 'How can I make you feel more cherished in our intimate moments?', 'medium', ARRAY['communication', 'intimacy'], true),
  ('spice-deck', 'What''s your idea of the perfect way to reconnect after a long day?', 'easy', ARRAY['connection', 'romance'], true),
  ('spice-deck', 'What aspect of our physical connection means the most to you?', 'medium', ARRAY['intimacy', 'values'], true);

-- 13. Update question counts for all decks
UPDATE question_decks qd
SET question_count = (
  SELECT COUNT(*) FROM questions q WHERE q.deck_id = qd.id AND q.is_active = true
);

