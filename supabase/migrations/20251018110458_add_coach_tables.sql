-- Coach Feature Database Migration
-- Adds tables for voice coaching sessions and topics

-- Coach sessions table
CREATE TABLE IF NOT EXISTS coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('conversation', 'guidance')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  transcript JSONB,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Coach topics for recent topics display
CREATE TABLE IF NOT EXISTS coach_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES coach_sessions(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies for coach_sessions
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own coach sessions" ON coach_sessions;
CREATE POLICY "Users can view own coach sessions"
  ON coach_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own coach sessions" ON coach_sessions;
CREATE POLICY "Users can create own coach sessions"
  ON coach_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own coach sessions" ON coach_sessions;
CREATE POLICY "Users can update own coach sessions"
  ON coach_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for coach_topics
ALTER TABLE coach_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own coach topics" ON coach_topics;
CREATE POLICY "Users can view own coach topics"
  ON coach_topics FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM coach_sessions WHERE id = session_id
  ));

DROP POLICY IF EXISTS "Users can create own coach topics" ON coach_topics;
CREATE POLICY "Users can create own coach topics"
  ON coach_topics FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM coach_sessions WHERE id = session_id
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_coach_sessions_user_id ON coach_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_sessions_created_at ON coach_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coach_topics_session_id ON coach_topics(session_id);
CREATE INDEX IF NOT EXISTS idx_coach_topics_created_at ON coach_topics(created_at DESC);

-- Updated_at trigger (reuse existing function if it exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
  ) THEN
    -- Create the function if it doesn't exist
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;
END
$$;

DROP TRIGGER IF EXISTS update_coach_sessions_updated_at ON coach_sessions;
CREATE TRIGGER update_coach_sessions_updated_at
  BEFORE UPDATE ON coach_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON coach_sessions TO authenticated;
GRANT ALL ON coach_topics TO authenticated;

