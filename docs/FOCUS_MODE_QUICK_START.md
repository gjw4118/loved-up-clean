# Focus Mode Quick Start 🎯

## What is Focus Mode?

Focus Mode is a wellness feature that gently encourages users to enable Do Not Disturb on their devices when starting question card sessions. This helps create a distraction-free environment for meaningful conversations.

## Quick Demo

### User Experience

1. **Opens question deck** 👉 Screen loads
2. **1 second delay** 👉 Beautiful modal appears
3. **User sees prompt**:
   ```
   🎯 Stay Present
   
   Enable Do Not Disturb to minimize distractions 
   and stay focused on what matters most.
   
   📵 Silence notifications
   💭 Stay in the moment  
   💬 Deeper conversations
   
   [Enable Focus Mode]    ← Opens Settings
   [Maybe Later]          ← Dismiss temporarily
   [Don't show again]     ← Disable permanently
   ```

### Settings Control

Users can manage this in Settings:

```
Focus Mode
Manage your focus and presence settings

🎯 Do Not Disturb Reminders
   Enabled - Prompted 3 times
   
[Re-enable Focus Reminders]  ← If disabled
```

## How It Works

### Smart Frequency
- **First time**: Shows immediately
- **Early usage**: Every 5 sessions (first 3 times)
- **Regular usage**: Every 10 sessions
- **Rate limit**: Max once per 24 hours

### Platform Support
- **iOS**: Opens Focus/DND settings directly
- **Android**: Opens system settings
- **Fallback**: Clear manual instructions

## Implementation

### 1. Already integrated in:
- ✅ Question screen (`src/app/questions/[deckId].tsx`)
- ✅ Settings screen (`src/components/settings/ProfileSettings.tsx`)

### 2. Components created:
- ✅ `useFocusMode` hook - Smart prompt logic
- ✅ `FocusModePrompt` modal - Beautiful UI
- ✅ Settings integration - User control

### 3. Ready to use:
```typescript
import { useFocusMode } from '@/hooks/useFocusMode';
import { FocusModePrompt } from '@/components/ui';

// Already working in your app! 
```

## Testing

### Reset for testing:
1. Go to Settings
2. Scroll to "Focus Mode"
3. Tap "Re-enable Focus Reminders"

### Or programmatically:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('@loved_up_focus_mode');
```

## Features

✅ **Non-intrusive** - Only shows when appropriate  
✅ **Respectful** - Easy to dismiss or disable  
✅ **Smart** - Learns from user behavior  
✅ **Beautiful** - Animated, themed, haptic feedback  
✅ **Private** - All data stored locally  
✅ **Accessible** - Screen reader friendly  

## User Benefits

- 🧘‍♀️ **Mindfulness**: Encourages present-moment awareness
- 💬 **Better conversations**: Fewer interruptions
- ❤️ **Connection**: Deeper engagement with partners
- 🎯 **Focus**: Distraction-free question sessions

## Privacy & Control

- **No permissions required** - Works without device access
- **No tracking** - Zero analytics or data collection  
- **User choice** - Full control via settings
- **Local storage** - Preferences stay on device

## Next Steps

1. **Test it**: Open a question deck and see the prompt
2. **Try settings**: Visit Settings → Focus Mode
3. **Customize**: Adjust timing/frequency in `useFocusMode.ts` if needed

## Documentation

For full technical details, see:
- `docs/FOCUS_MODE_FEATURE.md` - Complete documentation
- `src/hooks/useFocusMode.ts` - Hook implementation
- `src/components/ui/FocusModePrompt.tsx` - UI component

---

**Built with ❤️ to help people stay present with what matters most.**

