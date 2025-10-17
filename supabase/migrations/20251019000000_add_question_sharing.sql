-- Question Sharing Feature Migration
-- Add tables for one-on-one question sharing and responses

-- 1. Create question_threads table
-- Tracks individual question shares between users
CREATE TABLE IF NOT EXISTS question_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_contact TEXT, -- Email or phone number (before recipient signs up)
  recipient_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Set when recipient responds
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create question_responses table
-- Stores text responses to shared questions
CREATE TABLE IF NOT EXISTS question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES question_threads(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL CHECK (LENGTH(response_text) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Add thread_id to shared_questions for backwards compatibility
ALTER TABLE shared_questions ADD COLUMN IF NOT EXISTS thread_id UUID REFERENCES question_threads(id) ON DELETE SET NULL;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_threads_sender ON question_threads(sender_id);
CREATE INDEX IF NOT EXISTS idx_question_threads_recipient ON question_threads(recipient_id);
CREATE INDEX IF NOT EXISTS idx_question_threads_status ON question_threads(status);
CREATE INDEX IF NOT EXISTS idx_question_threads_created_at ON question_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_responses_thread ON question_responses(thread_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_responder ON question_responses(responder_id);

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_question_thread_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_question_thread_updated_at ON question_threads;
CREATE TRIGGER trigger_update_question_thread_updated_at
  BEFORE UPDATE ON question_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_question_thread_updated_at();

-- 7. Enable Row Level Security
ALTER TABLE question_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies for question_threads
-- Users can view threads where they are sender or recipient
CREATE POLICY "Users can view their own threads"
  ON question_threads
  FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

-- Users can insert threads they create
CREATE POLICY "Users can create threads"
  ON question_threads
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update threads they're part of (for recipient_id assignment)
CREATE POLICY "Users can update their threads"
  ON question_threads
  FOR UPDATE
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

-- 9. Create RLS Policies for question_responses
-- Users can view responses on their threads
CREATE POLICY "Users can view responses on their threads"
  ON question_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM question_threads qt
      WHERE qt.id = thread_id
      AND (qt.sender_id = auth.uid() OR qt.recipient_id = auth.uid())
    )
  );

-- Users can create responses on threads where they're recipient
CREATE POLICY "Recipients can create responses"
  ON question_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM question_threads qt
      WHERE qt.id = thread_id
      AND qt.recipient_id = auth.uid()
    )
  );

-- 10. Create helper function to get user threads with details
CREATE OR REPLACE FUNCTION get_user_threads(user_id UUID)
RETURNS TABLE (
  thread_id UUID,
  question_id UUID,
  question_text TEXT,
  deck_name TEXT,
  sender_id UUID,
  sender_name TEXT,
  recipient_id UUID,
  recipient_name TEXT,
  recipient_contact TEXT,
  status TEXT,
  response_text TEXT,
  response_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qt.id as thread_id,
    q.id as question_id,
    q.text as question_text,
    qd.name as deck_name,
    qt.sender_id,
    sender.display_name as sender_name,
    qt.recipient_id,
    recipient.display_name as recipient_name,
    qt.recipient_contact,
    qt.status,
    qr.response_text,
    qr.created_at as response_created_at,
    qt.created_at,
    qt.updated_at
  FROM question_threads qt
  JOIN questions q ON qt.question_id = q.id
  JOIN question_decks qd ON q.deck_id = qd.id
  JOIN user_profiles sender ON qt.sender_id = sender.id
  LEFT JOIN user_profiles recipient ON qt.recipient_id = recipient.id
  LEFT JOIN question_responses qr ON qt.id = qr.thread_id
  WHERE qt.sender_id = user_id OR qt.recipient_id = user_id
  ORDER BY qt.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

