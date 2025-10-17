-- Add Push Notification Support
-- Adds push token and notification preferences to user_profiles

-- Add push notification columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS expo_push_token TEXT,
ADD COLUMN IF NOT EXISTS push_notifications_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS push_token_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index for push token lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_push_token 
ON user_profiles(expo_push_token) 
WHERE expo_push_token IS NOT NULL;

-- Create index for finding users with push enabled
CREATE INDEX IF NOT EXISTS idx_user_profiles_push_enabled 
ON user_profiles(push_notifications_enabled) 
WHERE push_notifications_enabled = true;

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.expo_push_token IS 'Expo push notification token for sending notifications';
COMMENT ON COLUMN user_profiles.push_notifications_enabled IS 'Whether user has enabled push notifications';
COMMENT ON COLUMN user_profiles.push_token_updated_at IS 'Last time the push token was updated';

