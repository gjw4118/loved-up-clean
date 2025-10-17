# Focus Mode Feature Documentation

## Overview

The Focus Mode feature helps users stay present and focused during their question card sessions by encouraging them to enable Do Not Disturb (DND) mode on their device.

## Features

### 🎯 Smart Prompting System
- **First-time users**: Shows focus prompt on first session
- **Frequency control**: Automatically adjusts prompt frequency based on usage
  - First 3 times: Every 5 sessions
  - After that: Every 10 sessions
- **Rate limiting**: Maximum one prompt per 24 hours
- **User control**: Users can dismiss permanently or temporarily

### 💭 Beautiful UX
- Animated modal with spring animations
- Blurred background for focus
- Native haptic feedback
- Benefits showcase (silence notifications, stay present, deeper conversations)
- Theme-aware (light/dark mode support)

### ⚙️ Settings Integration
- View focus mode status in Settings
- See prompt history (times prompted)
- Re-enable prompts if previously disabled
- Visual indicators (🎯 enabled, 🔕 disabled)

### 📱 Platform Support
- **iOS**: Deep links to Focus/DND settings (`App-Prefs:DO_NOT_DISTURB`)
- **Android**: Opens Do Not Disturb settings via intent
- Fallback to manual instructions if deep linking fails

## Implementation

### Hook: `useFocusMode`

Located at: `src/hooks/useFocusMode.ts`

```typescript
const {
  shouldShowPrompt,      // Boolean: Should we show the prompt?
  isLoading,            // Boolean: Loading preferences
  preferences,          // Object: Current preferences
  markPromptShown,      // Function: Mark prompt as shown
  setDontShowAgain,     // Function: Disable prompts
  resetPreferences,     // Function: Re-enable prompts
} = useFocusMode();
```

#### Preferences Structure

```typescript
interface FocusModePreferences {
  dontShowAgain: boolean;        // User opted out
  lastPromptDate: string | null; // ISO date of last prompt
  timesPrompted: number;         // Total times prompted
}
```

#### Storage

Preferences are stored in AsyncStorage under the key `@loved_up_focus_mode`.

### Component: `FocusModePrompt`

Located at: `src/components/ui/FocusModePrompt.tsx`

```typescript
<FocusModePrompt
  visible={showPrompt}
  onDismiss={() => {
    setShowPrompt(false);
    markPromptShown();
  }}
  onDontShowAgain={() => {
    setShowPrompt(false);
    setDontShowAgain();
  }}
/>
```

#### Props

- `visible: boolean` - Controls modal visibility
- `onDismiss: () => void` - Called when user dismisses temporarily
- `onDontShowAgain: () => void` - Called when user opts out permanently

## Usage Example

### In Question Screen

```typescript
import { useFocusMode } from '@/hooks/useFocusMode';
import { FocusModePrompt } from '@/components/ui';

function QuestionScreen() {
  const {
    shouldShowPrompt,
    markPromptShown,
    setDontShowAgain,
  } = useFocusMode();
  
  const [showFocusPrompt, setShowFocusPrompt] = React.useState(false);
  
  // Show prompt when session starts
  useEffect(() => {
    if (shouldShowPrompt && sessionStarted) {
      setTimeout(() => setShowFocusPrompt(true), 1000);
    }
  }, [shouldShowPrompt, sessionStarted]);
  
  return (
    <>
      {/* Your content */}
      
      <FocusModePrompt
        visible={showFocusPrompt}
        onDismiss={() => {
          setShowFocusPrompt(false);
          markPromptShown();
        }}
        onDontShowAgain={() => {
          setShowFocusPrompt(false);
          setDontShowAgain();
        }}
      />
    </>
  );
}
```

### In Settings

```typescript
import { useFocusMode } from '@/hooks/useFocusMode';

function Settings() {
  const { preferences, resetPreferences } = useFocusMode();
  
  return (
    <View>
      <Text>
        Status: {preferences.dontShowAgain ? 'Disabled' : 'Enabled'}
      </Text>
      <Text>
        Prompted: {preferences.timesPrompted} times
      </Text>
      {preferences.dontShowAgain && (
        <Button onPress={resetPreferences}>
          Re-enable Focus Reminders
        </Button>
      )}
    </View>
  );
}
```

## User Flow

### First Session
1. User opens question deck
2. Screen loads and session initializes
3. After 1 second, focus mode prompt appears
4. User chooses:
   - **"Enable Focus Mode"** → Opens system settings
   - **"Maybe Later"** → Dismisses, will show again in 5 sessions
   - **"Don't show again"** → Confirms and disables permanently

### Subsequent Sessions
- If user hasn't opted out:
  - Shows prompt every 5 sessions (first 3 times)
  - Then every 10 sessions
  - Maximum once per 24 hours
- If user opted out:
  - No prompts shown
  - Can re-enable in Settings

## Platform-Specific Behavior

### iOS
- Primary: `App-Prefs:DO_NOT_DISTURB` (Focus/DND settings)
- Fallback: `Linking.openSettings()` (main Settings app)
- If both fail: Alert with manual instructions

### Android
- Primary: `android.settings.ZEN_MODE_SETTINGS` intent
- If fails: Alert with manual instructions

## Design Philosophy

### Non-Intrusive
- Appears only once per session
- Respects user preferences
- Easy to dismiss
- Never blocks functionality

### Wellness-Focused
- Encourages presence and mindfulness
- Reduces distractions
- Enhances conversation quality
- Voluntary participation

### Privacy-Respecting
- No DND status detection
- No system permissions required
- All preferences stored locally
- User maintains full control

## Future Enhancements

Potential additions:
- [ ] Per-deck prompt settings (e.g., only for "Spice" deck)
- [ ] Focus session timer
- [ ] Focus mode analytics (time focused, sessions)
- [ ] Integration with device Focus modes (when APIs available)
- [ ] Custom focus reminders (breathing, mindfulness tips)
- [ ] Focus streaks and rewards

## Testing

### Manual Test Checklist

- [ ] First session shows prompt
- [ ] "Maybe Later" dismisses and increments counter
- [ ] "Don't show again" permanently disables
- [ ] Settings shows correct status
- [ ] Re-enable button works
- [ ] iOS deep link works
- [ ] Android deep link works
- [ ] Dark mode styling correct
- [ ] Light mode styling correct
- [ ] Animations smooth
- [ ] Haptics work correctly

### Reset for Testing

To reset focus mode preferences for testing:

```typescript
// In app code
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('@loved_up_focus_mode');

// Or use the hook
const { resetPreferences } = useFocusMode();
await resetPreferences();
```

## Accessibility

- Fully keyboard navigable (web)
- Screen reader friendly labels
- High contrast mode support
- Respects reduced motion preferences (via spring animations)
- Clear visual hierarchy
- Large touch targets (minimum 44x44pt)

## Performance

- Lazy loading: Modal only renders when visible
- Efficient storage: Small JSON payload (~100 bytes)
- No network requests
- Minimal re-renders with React.useState
- Optimized animations with Reanimated

## Dependencies

- `@react-native-async-storage/async-storage` - Preferences storage
- `expo-blur` - Background blur effect
- `expo-haptics` - Tactile feedback
- `expo-linking` - Deep linking to settings
- `react-native-reanimated` - Smooth animations

## Troubleshooting

### Prompt not showing
- Check if user disabled it (Settings → Focus Mode)
- Verify session initialization
- Check console for errors
- Ensure AsyncStorage is working

### Deep linking not working (iOS)
- Some iOS versions restrict URL schemes
- Fallback to `Linking.openSettings()` automatically
- User can manually navigate to Settings → Focus

### Deep linking not working (Android)
- Some Android versions/manufacturers customize settings
- Fallback to manual instructions automatically
- User can manually navigate to Settings → Sound → DND

## Support

For issues or questions:
1. Check console logs for errors
2. Verify AsyncStorage permissions
3. Test on physical device (not just simulator)
4. Check platform-specific settings access

