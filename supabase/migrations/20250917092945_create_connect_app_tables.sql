-- Question Cards App Database Schema (Fixed)
-- Based on PRD requirements for Connect app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Question Decks Table
CREATE TABLE question_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('friends', 'family', 'romantic', 'professional')),
    icon VARCHAR(10),
    question_count INTEGER DEFAULT 0,
    popularity_score DECIMAL(3,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions Table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES question_decks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    difficulty_level VARCHAR(10) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    tags TEXT[] DEFAULT '{}',
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    skip_rate DECIMAL(5,2) DEFAULT 0.0,
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Interactions Table
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('completed', 'skipped', 'favorited')),
    session_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate interactions for the same question
    UNIQUE(user_id, question_id, interaction_type)
);

-- Question Sessions Table
CREATE TABLE question_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_id UUID NOT NULL REFERENCES question_decks(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    questions_completed INTEGER DEFAULT 0,
    questions_skipped INTEGER DEFAULT 0,
    session_duration_minutes INTEGER
);

-- Shared Questions Table
CREATE TABLE shared_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_via VARCHAR(20) NOT NULL CHECK (shared_via IN ('imessage', 'in_app', 'link')),
    recipient_info TEXT, -- email, phone, or user_id depending on share method
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table (tracks progress per deck)
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_id UUID NOT NULL REFERENCES question_decks(id) ON DELETE CASCADE,
    questions_completed INTEGER DEFAULT 0,
    questions_skipped INTEGER DEFAULT 0,
    last_question_id UUID REFERENCES questions(id),
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One progress record per user per deck
    UNIQUE(user_id, deck_id)
);

-- Indexes for performance
CREATE INDEX idx_questions_deck_id ON questions(deck_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX idx_questions_text_search ON questions USING GIN(to_tsvector('english', text));

CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_question_id ON user_interactions(question_id);
CREATE INDEX idx_user_interactions_timestamp ON user_interactions(timestamp);
CREATE INDEX idx_user_interactions_session_id ON user_interactions(session_id);

CREATE INDEX idx_question_sessions_user_id ON question_sessions(user_id);
CREATE INDEX idx_question_sessions_deck_id ON question_sessions(deck_id);
CREATE INDEX idx_question_sessions_started_at ON question_sessions(started_at);

CREATE INDEX idx_shared_questions_shared_by ON shared_questions(shared_by);
CREATE INDEX idx_shared_questions_question_id ON shared_questions(question_id);
CREATE INDEX idx_shared_questions_shared_at ON shared_questions(shared_at);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_deck_id ON user_progress(deck_id);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_question_decks_updated_at BEFORE UPDATE ON question_decks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update question statistics
CREATE OR REPLACE FUNCTION update_question_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update completion and skip rates
    UPDATE questions 
    SET 
        completion_rate = (
            SELECT COUNT(*)::DECIMAL / NULLIF(
                (SELECT COUNT(*) FROM user_interactions WHERE question_id = NEW.question_id), 0
            ) * 100
            FROM user_interactions 
            WHERE question_id = NEW.question_id AND interaction_type = 'completed'
        ),
        skip_rate = (
            SELECT COUNT(*)::DECIMAL / NULLIF(
                (SELECT COUNT(*) FROM user_interactions WHERE question_id = NEW.question_id), 0
            ) * 100
            FROM user_interactions 
            WHERE question_id = NEW.question_id AND interaction_type = 'skipped'
        )
    WHERE id = NEW.question_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_question_stats_trigger 
    AFTER INSERT ON user_interactions 
    FOR EACH ROW EXECUTE FUNCTION update_question_stats();

-- Function to update deck question counts
CREATE OR REPLACE FUNCTION update_deck_question_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE question_decks 
    SET question_count = (
        SELECT COUNT(*) 
        FROM questions 
        WHERE deck_id = COALESCE(NEW.deck_id, OLD.deck_id) AND is_active = true
    )
    WHERE id = COALESCE(NEW.deck_id, OLD.deck_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deck_question_count_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON questions 
    FOR EACH ROW EXECUTE FUNCTION update_deck_question_count();

-- Function to update session duration
CREATE OR REPLACE FUNCTION update_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
        NEW.session_duration_minutes = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at)) / 60;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_session_duration_trigger 
    BEFORE UPDATE ON question_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_session_duration();

-- Function to update user progress percentage
CREATE OR REPLACE FUNCTION update_user_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate progress percentage based on deck question count
    NEW.progress_percentage = (
        CASE 
            WHEN (SELECT question_count FROM question_decks WHERE id = NEW.deck_id) > 0
            THEN (NEW.questions_completed::DECIMAL / (SELECT question_count FROM question_decks WHERE id = NEW.deck_id)) * 100
            ELSE 0
        END
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_percentage_trigger 
    BEFORE INSERT OR UPDATE ON user_progress 
    FOR EACH ROW EXECUTE FUNCTION update_user_progress_percentage();

-- Row Level Security (RLS) Policies
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_interactions
CREATE POLICY "Users can view own interactions" ON user_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interactions" ON user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interactions" ON user_interactions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for question_sessions
CREATE POLICY "Users can view own sessions" ON question_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON question_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON question_sessions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for shared_questions
CREATE POLICY "Users can view own shared questions" ON shared_questions FOR SELECT USING (auth.uid() = shared_by);
CREATE POLICY "Users can insert own shared questions" ON shared_questions FOR INSERT WITH CHECK (auth.uid() = shared_by);

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for question_decks and questions (no RLS needed)
-- These are public content that all authenticated users can read
