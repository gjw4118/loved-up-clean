-- Question Cards App Database Schema
-- Based on PRD requirements for Connect app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Question Decks Table
CREATE TABLE question_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    
    -- Preferences
    preferred_decks UUID[] DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"daily_reminder": true, "weekly_summary": true, "new_questions": true, "sharing_notifications": true}',
    privacy_settings JSONB DEFAULT '{"profile_visibility": "private", "allow_question_sharing": true, "analytics_opt_in": true}',
    
    -- Progress tracking
    total_questions_completed INTEGER DEFAULT 0,
    total_questions_skipped INTEGER DEFAULT 0,
    favorite_questions UUID[] DEFAULT '{}',
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Interactions Table
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('completed', 'skipped', 'favorited')),
    session_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate interactions for the same question
    UNIQUE(user_id, question_id, interaction_type)
);

-- Question Sessions Table
CREATE TABLE question_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    deck_id UUID NOT NULL REFERENCES question_decks(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    questions_completed INTEGER DEFAULT 0,
    questions_skipped INTEGER DEFAULT 0,
    session_duration_minutes INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN ended_at IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (ended_at - started_at)) / 60
            ELSE NULL
        END
    ) STORED
);

-- Shared Questions Table
CREATE TABLE shared_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    shared_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    shared_via VARCHAR(20) NOT NULL CHECK (shared_via IN ('imessage', 'in_app', 'link')),
    recipient_info TEXT, -- email, phone, or user_id depending on share method
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table (tracks progress per deck)
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    deck_id UUID NOT NULL REFERENCES question_decks(id) ON DELETE CASCADE,
    questions_completed INTEGER DEFAULT 0,
    questions_skipped INTEGER DEFAULT 0,
    last_question_id UUID REFERENCES questions(id),
    progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN (SELECT question_count FROM question_decks WHERE id = deck_id) > 0
            THEN (questions_completed::DECIMAL / (SELECT question_count FROM question_decks WHERE id = deck_id)) * 100
            ELSE 0
        END
    ) STORED,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One progress record per user per deck
    UNIQUE(user_id, deck_id)
);

-- Analytics Tables
CREATE TABLE question_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    skips INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    average_session_time_seconds INTEGER DEFAULT 0,
    
    -- One record per question per day
    UNIQUE(question_id, date)
);

CREATE TABLE deck_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID NOT NULL REFERENCES question_decks(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_sessions INTEGER DEFAULT 0,
    total_questions_completed INTEGER DEFAULT 0,
    total_questions_skipped INTEGER DEFAULT 0,
    average_session_duration_minutes DECIMAL(5,2) DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    
    -- One record per deck per day
    UNIQUE(deck_id, date)
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
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

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
