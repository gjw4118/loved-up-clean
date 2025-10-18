-- GoDeeper Coach Tables Migration
-- Creates tables for storing AI coach sessions and topics

-- Create coach_sessions table
CREATE TABLE IF NOT EXISTS coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('conversation', 'guidance')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  transcript JSONB,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for coach_sessions
CREATE INDEX IF NOT EXISTS idx_coach_sessions_user_id ON coach_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_sessions_started_at ON coach_sessions(started_at DESC);

-- Enable RLS on coach_sessions
ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for coach_sessions
CREATE POLICY "Users can view their own coach sessions"
  ON coach_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coach sessions"
  ON coach_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coach sessions"
  ON coach_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coach sessions"
  ON coach_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Create coach_topics table (for tracking conversation topics)
CREATE TABLE IF NOT EXISTS coach_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES coach_sessions(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for coach_topics
CREATE INDEX IF NOT EXISTS idx_coach_topics_session_id ON coach_topics(session_id);
CREATE INDEX IF NOT EXISTS idx_coach_topics_created_at ON coach_topics(created_at DESC);

-- Enable RLS on coach_topics
ALTER TABLE coach_topics ENABLE ROW LEVEL SECURITY;

-- RLS policies for coach_topics
CREATE POLICY "Users can view their own coach topics"
  ON coach_topics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_sessions
      WHERE coach_sessions.id = coach_topics.session_id
      AND coach_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own coach topics"
  ON coach_topics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM coach_sessions
      WHERE coach_sessions.id = coach_topics.session_id
      AND coach_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own coach topics"
  ON coach_topics FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM coach_sessions
      WHERE coach_sessions.id = coach_topics.session_id
      AND coach_sessions.user_id = auth.uid()
    )
  );

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_coach_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for coach_sessions
DROP TRIGGER IF EXISTS trigger_update_coach_sessions_updated_at ON coach_sessions;
CREATE TRIGGER trigger_update_coach_sessions_updated_at
  BEFORE UPDATE ON coach_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_coach_sessions_updated_at();
